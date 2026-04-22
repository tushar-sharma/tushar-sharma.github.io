---
layout: post
title: DNS Route 53 weighted Routing
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
published: false
---

## DNS

Domain Name System (DNS) is internet's phone book. It translates human-readable domain names like `api.example.com` into IP address like `203.0.113.42` that computers use to communicate. 


## How DNS resolution works

```
User types : api.example.com
>
Browser checks cache 
> 
Queries DNS resolver (ISP or 8.8.8.8)
>
root directs to TLD server (example.com)
>
TLD directs to Authoritative server (route 53)
> 
Returns IP: 203.0.113.42
>
Browers connects to 203.0.113.42
```

## DNS record type

| record type | Purpose                          | Example                                            |
| A           | maps domain to IPv4 address      | api.example.com -> 203.0.113.42                    |
| AAAA        | maps domain to IPv6 address      | api.example.com -> 2001:0db8::1                    |
| CNAME       | alias to another domain          | www.example.com -> example.com                     |
| ALIAS       | Like cname but for root domains  | example.com -> alb-123.us-east-1.elb.amazonaws.com |
| NS          | Specific authoritative nameservers  | example.com -> ns-123.awsdns-12.com             |
| TXT         | Arbitrary text (often for verification) | example.com -> "v=spf1 include:_spf.google.com" | 

## Route 53

It's a managed DNS service. Scalable DNS web service. It's named after port 53 , which is standard DNS port 53.

Key capablities: 

1. Domain registration : buy and manage domain names
2. DNS hosting : Authoritative endpoint avaiilability 
3. Health checks : Monitor endpoint availibitly
4. Traffic Routing : Intelligent request distribution

```
Internet -> DNS Query : api.example.com

-> Route 53 (DNS Layer) -> 
    A record : api.example.com
     -> 203.0.113.42 (weight 80)
     -> 203.0.113.99 (weight 20)

-> returns IP based on routing policy
  
Application infrastructure 
| local balancer, API gateway , servers | 
```

## Reverse proxy 

A proxy in front of client is usualy a proxy. A reverse proxy is in front of a server. SO it's sits in front of backend server and forwards client request to them. client think they are talking to the proxy, but it's actually orchestrating communcations with mulitple backend services

```
Client 

-> GET /api/users

Reverse proxy 
(Spring gateway)

/routes 
/api/users -> usersvc
/api/order -> ordersvc

```

spring gatweay is a reactive reverse proxy built on spring webflux and project reactor. It 

1. Route : mapping from a request pattern 
2. predicate : condition to match (path )
3. filter modify request / response

```yaml
spring:
  cloud:
    gateway:
      routes:
        -id: user-service
         uri: http://user-service:8081
         predicates:
           -Path=/api/users/**
         filters:
           - AddRequestHeader=X-Gateway-Source, Spring-Gateway
           - RewritePath=/api/users(?<segment>.*),/${segment}/

        -id order-service
         uri: http://order-service:8082
         predicates:
            - path=/api/orders/**
        filters:
          - CircuitBreaker=orderService

```

Why use a reverse proxy?

1. Single Entry point: client calls one endpoint, gateway routes internally
2. Cross cutting concerns : Auth, logging, rate limiting in one place 
3. Bakend flexibility: changes backend urls without affecting clients
4. protocol translation: HTTPS -> HTTP, REST -> gRPC
5. Load blanancing > Distribute traffic accorss instancesx 
6. canary deployments -> Route percentage of trafic to new version

Weighted routing expalined

weighted routing si distribution of traffic accross multiple endpoints based on assigned weights.

```
route 53: api.example.com

A record -> 203.0.113.42 (weights: 80)
A Record -> 203.0.113.99 (weihgt : 20)

total weights = 100

traffic distribution : 
- 80% of requests -> 203.0.113.42 (stable version)
- 20% of requests -> 203.0.113.99 (canary version)
```

Route 53 weighted record example

```json 
{
  "Name": "api.example.com",
  "Type": "A",
  "SetIdentifier": "stable-v1",
   "Weight": 80,
   "TTL": 60,
    "ResourceRecords:" [
      {"Value" : "203.0.113.42"}
    ]
},
{
  "Name": "api.example.com",
  "Type": "A",
  "SetIdentifier": "stable-v1",
   "Weight": 80,
   "TTL": 60,
    "ResourceRecords:" [
      {"Value" : "203.0.113.99"}
    ]
}
```

1. SetIdentifier must be unique per weighted record
2. Weights are relative (80:20 same as 8:2 or 4:1)
3. Low TTL (60s) allows faster weight adjustment

Cloudformation overview 

AWS cloudformation is infrastructure as Code (IaC). You define AWS resources in YAML / JSON templates, and cloudformation provision them

```yaml
AWSTempalateFormatVersion: 'date'
Description : weighted routing 

Paramters:
  DomainName:
     Type: String
     Default: api.example.com


  StableIP:
     Type: String
     Default: 2023.0.113.42


  CanaryIP:
     type: String 
     Default: 203.0.113.99

  StableWeight:
    Type: nUmber 
    default: 80

  CanaryWeight:
    type: number 
    defult : 20


Resources:
  StableRecord
  Type: AWS::Rotue53::RecordSet
  Properties: 
   HostedZoneName: !Sub '${DomainNeame}'
   Name : !Ref DomainName
   Type: A 
   SetIdentifier: stable-v1 
   weight: !Ref StableWeight
   TTL : 60
   ResourceRecords:
    - !Ref StableIP
CanaryeRecord
  Type: AWS::Rotue53::RecordSet
  Properties: 
   HostedZoneName: !Sub '${DomainNeame}'
   Name : !Ref DomainName
   Type: A 
   SetIdentifier: stable-v1 
   weight: !Ref CanaryeRecord
   TTL : 60
   ResourceRecords:
    - !Ref CanraryIp

Outputs:
 StableRecordName:
 Value: !Ref Stable Record

CanaryRecordName:
  Value: !Ref canaryRecord

```

Update the weighst

```
aws cloudformation update-stack \
 -stack-name api-routing \
 -user-previous-tempo;late \
 -paramters \
 ParamterKey=StableWEight, paramterValue=80 \
 ParamterKey=CanaryWEight, paramterValue=20 \

```
