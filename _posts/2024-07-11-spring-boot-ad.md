
What's an AD? Active Directory mostly for Windows systems. It's used to give permissions to various users.

We create an AD server:

```bash
$ docker run -it --name samba -p 139:139 -p 445:445 dperson/samba -s "public;/share" -u "admin;admin" -p -r 
```

This will create a Samba server. 

Create a Spring boot using initializr 

TODO : build.gradle file

