## Connect to Database using oracle client and kerberos with Python
tags : python, database, oracle, kerberos

### Prerequisite

I've assumed the following prerequisite: 

1. Linux hosting oracle database 

2. Oracle databse configured with kerberos (I've tried with 12 c) 

3. Oracle thin client-side JDBC driver (ojdbc6.jar)

4. Docker (if running on Windows)

If you just want to jump to code without explanation


### Step 1 Create a configuration file

Let's create a config.json used for our script

```sh 
{
    "_hostname": "$HOSTNAME",
    "_portnumber": $PORTNUMBER,
    "_service_name": "$SERVICE_NAME",
    "_username": "$USERNAME",
    "_password": "$PASSWORD",
	"_jdbc_jar": "ojdbc6.jar",
	"_jdbc_class": "oracle.jdbc.OracleDriver",
	"_jdbc_url": "jdbc:oracle:thin:@//{}:{}/{}"
}
```

### Step 2 Create a python script to parse config.json

krbOracle.py

```python
if __name__ == "__main__":
    # parse the configuration file
    config_file = os.getcwd() + '/config.json'

    with open(config_file, "r") as handler:
        info = json.load(handler)

    config = OracleConfig(info)
```

```python
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

```

Next try to connect to oracle database using connectOracle funtion.


```python
import jaydebeapi as jj
import jpype as j
import os
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

    

if __name__ == "__main__":
    # parse the configuration file
    config_file = os.getcwd() + '/config.json'

    with open(config_file, "r") as handler:
        info = json.load(handler)

    config = OracleConfig(info)

    connectOracle(config)
```

When running the following, you would get something similar error 

```
ORA-01017: invalid username/password; logon denied
```

### Step 3 Get keytab file for kerberos (skip this if you already have one)


```bash 
$ ssh $server
# try to obtain kerberos ticket
$ kinit username@MYDOMAIN.com
- enter password for username - 
# create a keytab
$ ktutil
addent -password -p username@MYDOMAIN.com -k 1 -e RC4-HMAC 
- enter password for username - 
wkt username.keytab
1
```

Use this file `username.keytab` to get kerberos ticket

```bash 
# check if existing ticket
$ klist
# remove the ticket
$ kdestroy 
$ kinit -kt username.keytab username@MYDOMAIN.com 
```

if you got no errors till these steps, you can copy the file to your test folder


### Step 4 configure python script to use kerberos 

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

### Step 5 Use docker if running on Windows 

As if now krbcontext python library only works on Linux like OS. So if you'are running on Windows, you can launch a Linux container 


```bash
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
