---
layout: post
title: Connect to an Oracle Database using kerberos with python
category: blog
tags:
  - kerberos
  - projects
  - python
  - docker
  - oracle
  - database
name: kerberos-oracle
thumb: 'https://d22e4d61ky6061.cloudfront.net/sites/default/files/Kerberos_1.png'
published: true
---

Jobs failed! Screamed an automatic failure alert in email inbox. Existing python scripts were failing in the server which fetched data from Oracle database. I wondered if the credentials had changed.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<p>Jobs failed! Screamed an automatic failure alert in email inbox. Existing python scripts were failing in the server which fetched data from Oracle database. I wondered if the credentials had changed.</p>

After few emails back and forth with the Support team, I discoverd that the server had been upgraded with Kerberos authentication. I have to modify my scripts to support kerberos authentication. I have to dig up more to understand more about kerberos. 

## What's a Kerberos?

Kerberos is a system for authenticating access to services. 

1. The caller to a service represent a  `principal` in the system

2. Caller to a service has been granted right on behalf of a principal for a limited period of a time


## Connectiong to Oracle without kerberos

### Get Host IP address

Connect to your host server which is hosting the oracle database. For my setup, I was using RedHat Server. Get the host IP address & use it as $HOSTNAME


```sh
$ hostname -I
```

### Download JDBC driver

I am using Oracle thin client-side JDBC driver (ojdbc6.jar) for Oracle 12c. You can download the drivers from [here](https://www.oracle.com/database/technologies/jdbc-drivers-12c-downloads.html).

### Create a config file

Let's create a config.json used for our script & replace $HOSTNAME, $PORT_NUMBER, $SERVICE_NAME, $USERNAME, $PASSWORD respectively.


```sh
{
    "_hostname": "$HOSTNAME",
    "_portnumber": $PORT_NUMBER,
    "_service_name": "$SERVICE_NAME",
    "_username": "$USERNAME",
    "_password": "$PASSWORD",
    "_jdbc_jar": "ojdbc6.jar",
    "_jdbc_class": "oracle.jdbc.OracleDriver",
    "_jdbc_url": "jdbc:oracle:thin:@//{}:{}/{}"
}
```

### Parse config file

Let's create a simple python script to parse config file

<script src="https://gist.github.com/tushar-sharma/4564f7c5ece9d5acaf439fe3142a8937.js"></script>


### Establishing a connection

Let us try to connect to oracle database using jaydebeapi library.


<script src="https://gist.github.com/tushar-sharma/bb2209809bacbb3f8c6edd909722cbf1.js"></script>


However while running the script, you will get the following error

```sh
ORA-01017: invalid username/password; logon denied
```

###= Connecting to Oracle with Kerberos

To connect to Oracle database using kerberos, we need the following

* kerberos principal
* keytab file

Assuming that the oracle is already configured to use kerberos,

```sh
$ ssh $HOSTNAME
$ kinit
# you should get prompt like username@MYDOMAIN.com
# username@MYDOMAIN.com is the kerberos principal
```

Ketyab file is a binary file containing pairs of Kerberos principals and encrypted keys use to authenticate to the server. It should be provided by the IT administrator. Else you can generate it like this

```sh
$ ktutil
addent -password -p username@MYDOMAIN.com -k 1 -e RC4-HMAC
# - enter password for username -
wkt username.keytab
```

This will create a `username.keytab` file on the system. Use can verify if the file is valid

```sh
# check if existing ticket
$ klist
# remove the ticket
$ kdestroy
$ kinit -kt username.keytab username@MYDOMAIN.com
```

if you got no errors till these steps, you can copy the file to your test folder

### Full code to use kerberos

<script src="https://gist.github.com/tushar-sharma/c95a7f50b88fb14ff1bfaec306b99e20.js"></script>

### Using Docker

As if [now](https://github.com/krbcontext/python-krbcontext/issues/33#issuecomment-569232653), `krbcontext` library only supports Linux like OS. So we can use Docker to run the python script on windows

```dockerfile
FROM alpine:3.7

### 2. config
ENV WORKPATH /usr/src/project
WORKDIR $WORKPATH

### 3. setup for the $WORKPATH
COPY ./krbOracle.py $WORKPATH
COPY ./SharmaT1.keytab $WORKPATH
COPY ./ojdbc6.jar $WORKPATH
COPY ./config.json $WORKPATH

### 4. installing req libraries
RUN apk add --update \
    python3 \
    python3-dev \
    py-pip \
    build-base \
    openjdk8-jre \
  && pip3 install --upgrade pip setuptools \
  && rm -rf /var/cache/apk/*

RUN apk --update add krb5-dev

### uncomment these lines if kerberos complain following error
### error :  Clock skew too great
### set the timezone accordingly
# ENV TZ=America/New_York
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

### 5. set the environment
ENV JAVA_HOME /usr/lib/jvm/java-1.8-openjdk
ENV PATH $PATH:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin
ENV LD_LIBRARY_PATH /usr/lib/jvm/java-1.8-openjdk/jre/lib/amd64/server:/usr/lib/jvm/default-jvm/lib/amd64/jli

### 6. exports
RUN export JAVA_HOME
RUN export PATH
RUN export LD_LIBRARY_PATH

### 7. install python libraries
RUN pip3 install jaydebeapi
RUN pip3 install krbcontext
RUN pip3 install JPype1==0.6.3 --force-reinstall

### 8. run the script
ADD krbOracle.py /
CMD [ "python3", "./krbOracle.py"]
```

You can build & run the dockerfile

```sh
$ docker build -t tshrocks/krboracle .
$ docker run -it --rm tshrocks/krboracle
```


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
