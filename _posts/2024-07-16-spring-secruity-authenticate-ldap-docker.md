---
layout: post
title: Spring Security authenticate with LDAP using Docker
image: /img/
thumb: /img/
category: blog
author: tushar sharma
published: false
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

```dockerfile
version: '2'
services:
  ldap:
    image: osixia/openldap:1.5.0
    container_name: ldap
    environment:
      - LDAP_ORGANISATION=My Company
      - LDAP_DOMAIN=mycompany.com
      - LDAP_BASE_DN=dc=mycompany,dc=com
      - LDAP_ADMIN_PASSWORD=admin
    ports:
      - 389:389
      - 636:636
    command: [--copy-service,  --loglevel, debug]
    volumes:
      - ./bootstrap.ldif:/container/service/slapd/assets/config/bootstrap/ldif/custom/bootstrap.ldif
```

`--copy-service` ensures that custom assets are the very last items which get added to your LDAP configuration.


`bootstrap.ldif` content:

```bash
dn: ou=groups,dc=mycompany,dc=com
objectclass: organizationalUnit
objectclass: top
ou: groups

dn: cn=user,ou=groups,dc=mycompany,dc=com
cn: user
gidnumber: 500
objectclass: posixGroup
objectclass: top

dn: ou=users,dc=mycompany,dc=com
objectclass: organizationalUnit
objectclass: top
ou: users

dn: uid=app-user,ou=users,dc=mycompany,dc=com
cn: App User
gidnumber: 500
givenname: App
homedirectory: /home/users/app-user
objectclass: inetOrgPerson
objectclass: posixAccount
objectclass: top
sn: User
uid: app-user
uidnumber: 1000
userpassword: {MD5}ICy5YqxZB1uWSwcVLSNLcA==
EOF
```

```bash
$ docker exec -it ldap /bin/bash
```


`application.yaml` is 

```yaml
spring:
  ldap:
    urls: ldap://localhost:389
    base: ou=users,dc=mycompany,dc=com
    username: admin,dc=mycompany,dc=com
    password: admin
  application:
    name: ad
```

Controller is : 

```java
@RestController
@RequestMapping("/test")
public class TestController {
    @GetMapping("/public")
    public String publicEndpoint() {
        return "Public API response";
    }

    @GetMapping("/private")
    public String privateEndpoint() {
        return "Private API Response";
    }
}
```

`build.gradle` is : 

```build.gradle

plugins {
	id 'java'
	id 'org.springframework.boot' version '3.3.1'
	id 'io.spring.dependency-management' version '1.1.5'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-ldap'
	implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-security'
	implementation 'org.springframework.security:spring-security-ldap'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

tasks.named('test') {
	useJUnitPlatform()
}
```

Websecurity is : 

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Value("${spring.ldap.urls}")
    private String ldapUrl;

    @Value("${spring.ldap.username}")
    private String managerDn;

    @Value("${spring.ldap.password}")
    private String managerPassword;

    @Value("${spring.ldap.base}")
    private String base;

    private static final String USER_DN_PATTERN = "uid={0}";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(HttpMethod.GET, "/test/private").authenticated()
                                .requestMatchers(HttpMethod.GET, "/test/public").permitAll()
                                .anyRequest().denyAll()
                )
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(sessionManagement ->
                        sessionManagement
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .build();
    }


    @Bean
    public DefaultSpringSecurityContextSource contextSource() {
        DefaultSpringSecurityContextSource contextSource = new DefaultSpringSecurityContextSource(ldapUrl + "/" + base);
        contextSource.setUserDn(managerDn);
        contextSource.setPassword(managerPassword);
        return contextSource;
    }

    @Bean
    public AuthenticationManager ldapAuthenticationManager(BaseLdapPathContextSource contextSource) {
        LdapBindAuthenticationManagerFactory factory = new LdapBindAuthenticationManagerFactory(contextSource);
        factory.setUserDnPatterns(USER_DN_PATTERN);
        factory.setUserDetailsContextMapper(new PersonContextMapper());
        return factory.createAuthenticationManager();
    }
}
```

```
$ curl -i http://localhost:8080/test/public
 
$ curl -i  -u app-user:123  http://localhost:8080/test/private
```
