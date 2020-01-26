---
layout: post
title: Connect to an Oracle Database using kerberos with python
category: blog
tags:
  - kerberos
  - python
  - docker
  - oracle
  - database
name: python-kerberos-oracle
thumb: 'https://d22e4d61ky6061.cloudfront.net/sites/default/files/Kerberos_1.png'
published: true
---

<p>Previously I had written python scripts connecting to oracle database. However recently the server was upgraded with kerberos & most of the scripts were failings.</p>

After few digging, I learnt few things about kerberos authentication. Kerberos is a network authentication protocol which uses tickets to authenticate access to services<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<p>Previously I had written python scripts connecting to oracle database. However recently the server was upgraded with kerberos & most of the scripts were failings.</p>

After few digging, I learnt few things about kerberos authentication. Kerberos is a network authentication protocol which uses tickets to authenticate access to services.

# Table of Contents
{:.no_toc}

1. Will be replaced with the ToC, excluding the "Table of Contents" header
{:toc}

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

```python
if __name__ == "__main__":
    # parse the configuration file
    config_file = os.getcwd() + '/config.json'

    with open(config_file, "r") as handler:
        info = json.load(handler)

    config = OracleConfig(info)

class OracleConfig(object):
    """
    Oracle Connection details
    """

    def __init__(self, data):
        self.__dict__ = data

    @property
    def hostname(self):
        return self._hostname

    @property
    def portnumber(self):
        return self._portnumber

    @property
    def service_name(self):
        return self._service_name

    @property
    def username(self):
        return self._username

    @property
    def password(self):
        return self._password

    @property
    def jdbc_jar(self):
        return self._jdbc_jar

    @property
    def jdbc_class(self):
        return self._jdbc_class

    @property
    def jdbc_url(self):
        return self._jdbc_url

    @jdbc_jar.setter
    def jdbc_jar(self, jdbc_jar):
        self._jdbc_jar = jdbc_jar

    @jdbc_url.setter
    def jdbc_url(self, jdbc_url):
        self._jdbc_url = jdbc_url


### Connect to Oracle database

Let us try to connect to oracle database using jaydebeapi library.


<pre class="brush: python;  title: ; notranslate">
import jaydebeapi as jj
import jpype as j
import os
import json

def connectOracle(config):
    """
    connecting to the oracle with kerberos
    @param config object: reference to config.json
    """
    # set the environement
    config.jdbc_jar = os.path.join(os.getcwd(), config.jdbc_jar)
    config.jdbc_url = config.jdbc_url.format(config.hostname,
                                             config.portnumber,
                                             config.service_name)


    # create instance of JVM
    args = '-Djava.class.path=%s' % config.jdbc_jar
    jvm_path = j.getDefaultJVMPath()
    j.startJVM(jvm_path, args)

    conn = None
    try:
        conn = jj.connect(config.jdbc_class,
                          config.jdbc_url,
                          {'username': config.username,
                           'password': config.password},
                           jars=config.jdbc_jar)
    except Exception as e:
        print(e)

```

However while running the script, you will get the following error

```
ORA-01017: invalid username/password; logon denied
```


### Kerberos

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

```python
import jaydebeapi as jj
import jpype as j
import os
import krbcontext
import json


class OracleConfig(object):
    """
    Oracle Connection details
    """

    def __init__(self, data):
        self.__dict__ = data

    @property
    def hostname(self):
        return self._hostname

    @property
    def portnumber(self):
        return self._portnumber

    @property
    def service_name(self):
        return self._service_name

    @property
    def username(self):
        return self._username

    @property
    def password(self):
        return self._password

    @property
    def kPrincipal(self):
        return self._kPrincipal

    @property
    def keytab(self):
        return self._keytab

    @property
    def jdbc_jar(self):
        return self._jdbc_jar

    @property
    def jdbc_class(self):
        return self._jdbc_class

    @property
    def jdbc_url(self):
        return self._jdbc_url

    @keytab.setter
    def keytab(self, keytab):
        self._keytab = keytab

    @jdbc_jar.setter
    def jdbc_jar(self, jdbc_jar):
        self._jdbc_jar = jdbc_jar

    @jdbc_url.setter
    def jdbc_url(self, jdbc_url):
        self._jdbc_url = jdbc_url


def connectOracle(config):
    """
    connecting to the oracle with kerberos
    @param config object: reference to config.json
    """
    # set the environement
    config.keytab = os.path.join(os.getcwd(), config.keytab)
    config.jdbc_jar = os.path.join(os.getcwd(), config.jdbc_jar)
    config.jdbc_url = config.jdbc_url.format(config.hostname,
                                             config.portnumber,
                                             config.service_name)

    # create a kerberos ticket
    with krbcontext.krbContext(
        using_keytab=True,
        principal=config.kPrincipal,
        keytab_file=config.keytab,
        ccache_file='/tmp/krb5cc'
    ):
        # create instance of JVM
        args = '-Djava.class.path=%s' % config.jdbc_jar
        jvm_path = j.getDefaultJVMPath()
        j.startJVM(jvm_path, args)

        conn = None
        try:
            conn = jj.connect(config.jdbc_class,
                              config.jdbc_url,
                              {'username': config.username,
                              'password': config.password,
                              'oracle.net.authentication_services': "(KERBEROS5)"},
                              jars=config.jdbc_jar)
        except Exception as e:
            print(e)

        if conn:
            curs = conn.cursor()

            query = 'select username as schema_name from sys.all_users order by username'

            curs.execute(query)

            print(curs.fetchall())


if __name__ == "__main__":
    # parse the configuration file
    config_file = os.getcwd() + '/config.json'

    with open(config_file, "r") as handler:
        info = json.load(handler)

    config = OracleConfig(info)

    connectOracle(config)

```

### Using Docker

As if [now](https://github.com/krbcontext/python-krbcontext/issues/33#issuecomment-569232653), `krbcontext` library only supports Linux like OS. So we can use Docker to run the python script on windows

```sh
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
