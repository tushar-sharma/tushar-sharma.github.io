## Connect to Database using oracle client and kerberos with Python
tags : python, database, oracle, kerberos

### Prerequisite

I've assumed the following prerequisite: 

1. Linux hosting oracle database 

2. Oracle databse configured with kerberos (I've tried with 12 c) 

3. Oracle thin client-side JDBC driver (ojdbc6.jar)

4. Docker (if running on Windows)


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

