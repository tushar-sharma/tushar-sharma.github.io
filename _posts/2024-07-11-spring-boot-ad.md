
What's an AD? Active Directory mostly for Windows systems. It's used to give permissions to various users. And we can use LDAP protocol to talkk to the AD. 

We create an AD server:

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
 
 


