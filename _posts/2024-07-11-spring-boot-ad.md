
Active Directory is a directory service for Windows systems. It allows for managing permissions and acesss to various resources. LDAP is a protocal that interact with AD, making it possible to query and modify directory services.

## Setting up AD with docker

We can simulate AD using Samba server. Samba is a free software re-implementation that provides file and print services to SMB/CIFS clients. It can also function as an Active Directory domain controller.


```bash
$ docker run -it --name samba -p 139:139 -p 445:445 dperson/samba -s "public;/share" -u "admin;admin" -p -r
```

This will create a Samba server. 

Create a Spring boot using initializr 

TODO : build.gradle file

Add this in `application.properties` 

```yaml
spring.ldap.urls=ldap://localhost:389
spring.ldap.base=dc=example,dc=com
spring.ldap.username=cn=admin,dc=example,dc=com
spring.ldap.password=admin
spring.ldap.user.dn-pattern=cn={0},ou=users
```

Implement a simple security configuration where we would use Spring Security. 

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
      .anymatches("/public").permitAll()
      .anyRequest().authenticated()
      .and()
      .formLogin();
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
 
 


