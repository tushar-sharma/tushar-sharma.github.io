## Connect to Database using oracle client and kerberos with Python
tags : python, database, oracle, kerberos

### Prerequisite

I've assumed the following prerequisite: 

1. Linux hosting oracle database 

2. Oracle databse configured with kerberos (I've tried with 12 c) 

3. Oracle thin client-side JDBC driver (ojdbc6.jar)

4. Docker (if running on Windows)

If you just want o jump to code without explanation


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


