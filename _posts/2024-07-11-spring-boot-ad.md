
Active Directory is a directory service for Windows systems. It allows for managing permissions and acesss to various resources. LDAP is a protocal that interact with AD, making it possible to query and modify directory services.

## Setting up AD with docker

We can simulate AD using Samba server. Samba is a free software re-implementation that provides file and print services to SMB/CIFS clients. It can also function as an Active Directory domain controller.


```bash
$ docker run -it --name openldap \
  -p 1389:1389 -p 1636:1636 \
  -e LDAP_ADMIN_USERNAME=admin \
  -e LDAP_ADMIN_PASSWORD=adminpassword \
  -e LDAP_USERS=user01 \
  -e LDAP_PASSWORDS=password01 \
  -e LDAP_DOMAIN=example.com \
  -d bitnami/openldap:latest
```
## Setup

Use Spring Boot's [initializr](https://start.spring.io/) to create a new project. Add following dependencies

- Spring Web

- Spring Security

Add following `LDAP` properties in `application.yaml`:

```yaml
spring.ldap.urls=ldap://localhost:389
spring.ldap.base=dc=example,dc=com
spring.ldap.username=cn=admin,dc=example,dc=com
spring.ldap.password=admin
spring.ldap.user.dn-pattern=cn={0},ou=users
```

Here, 

- **Distinguished Name (dn)**: A DN is a string that uniquely identifies an entry within the LDAP directory. It's compose of multiple components

- **Domain Component (dc)**: represent segment of the domain, Example dc is `example.com`

- **Common Name (cn)**: Use to represent name of an object or a person, like a user or group name in AD.

- **Organizational unit (ou)**: respresents an organizational structure within the AD.

Implement a simple security configuration where we would use Spring Security. 

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
      .anymatches("/public").permitAll() // No authentication required for /public
      .anyRequest().authenticated() // All other requests require authentication
      .and()
      .formLogin(); // Use form-based authentication
  }
  
  @Override
  public void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth
      .ldapAuthentication()
      .userDnPattern("cn={0},ou=users")
      .contextSource()
      .url("ldap://localhost:389/dc=example,dc=com")
      .managerDn("cn=admin,dc=example,dc=com")
      .managerPassword("admin");
  }
}


```

TODO : Why is one public and other protected ? Cant both be public? What happens then?

TODO : what's teh differnce betwen DN and dc, cn and ou ?

Next create REST Endpoints 

```java
@RestController
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
 
 


