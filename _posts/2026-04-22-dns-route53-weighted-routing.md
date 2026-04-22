---
layout: post
title: "DNS Strategy: Weighted Routing with Route 53 and Spring Cloud Gateway"
image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=437&q=80
thumb: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=437&q=80
author: tushar sharma
category: blog
skipImage: true
tags: [aws, route53, dns, spring cloud, cloudformation]
published: true
---

Weighted routing is a powerful strategy for managing traffic distribution, enabling everything from simple load balancing to sophisticated canary deployments. By combining AWS Route 53 at the DNS layer with Spring Cloud Gateway at the application layer, you can create a robust, multi-tiered routing architecture.<!-- truncate_here -->

Weighted routing is a powerful strategy for managing traffic distribution, enabling everything from simple load balancing to sophisticated canary deployments. By combining AWS Route 53 at the DNS layer with Spring Cloud Gateway at the application layer, you can create a robust, multi-tiered routing architecture.

---

## The Basics: What is DNS?

The **Domain Name System (DNS)** is often called the "phone book of the internet." Its primary job is to translate human-readable domain names like `api.example.com` into machine-readable IP addresses like `203.0.113.42`.

### How DNS Resolution Works

When you type a URL into your browser, a multi-step resolution process begins:

1. **Browser Cache**: The browser first checks if it already knows the IP.
2. **DNS Resolver**: If not, it queries a resolver (like your ISP or Google's `8.8.8.8`).
3. **Root Server**: The resolver asks the Root server where to find the `.com` TLD.
4. **TLD Server**: The TLD server points to the **Authoritative Nameserver** (e.g., AWS Route 53).
5. **Authoritative Server**: Route 53 returns the specific IP address for the domain.
6. **Connection**: The browser finally connects to the server at that IP.

---

## Common DNS Record Types

Understanding record types is crucial for configuring routing policies:

| Record Type | Purpose | Example |
| :--- | :--- | :--- |
| **A** | Maps a domain to an **IPv4** address | `api.example.com` -> `203.0.113.42` |
| **AAAA** | Maps a domain to an **IPv6** address | `api.example.com` -> `2001:0db8::1` |
| **CNAME** | Creates an alias for another domain | `www.example.com` -> `example.com` |
| **ALIAS** | Route 53 specific; like CNAME but for root domains | `example.com` -> `alb-123.aws.com` |
| **NS** | Lists the authoritative nameservers | `example.com` -> `ns-123.awsdns.com` |
| **TXT** | Stores arbitrary text (used for SPF/verification) | `example.com` -> `"v=spf1 ..."` |

---

## AWS Route 53 Capabilities

Route 53 is a highly available and scalable cloud DNS web service. It’s named after **Port 53**, the standard port for DNS queries.

1. **Domain Registration**: Buy and manage domain names.
2. **DNS Hosting**: Provide authoritative responses to DNS queries.
3. **Health Checks**: Monitor the health of your endpoints.
4. **Traffic Routing**: Use policies like Weighted, Latency, or Failover to distribute requests.

---

## The Role of a Reverse Proxy

While Route 53 handles routing at the "front door," a **Reverse Proxy** sits in front of your backend servers to orchestrate internal communication.

**Spring Cloud Gateway** is a popular reactive reverse proxy built on Spring WebFlux. It provides:
- **Routes**: Mappings based on request patterns.
- **Predicates**: Conditions that must be met (e.g., path, headers).
- **Filters**: Logic to modify requests or responses on the fly.

### Example Configuration:

<div style="display:none;" markdown="1">
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://user-service:8081
          predicates:
            - Path=/api/users/**
          filters:
            - AddRequestHeader=X-Gateway-Source, Spring-Gateway
            - RewritePath=/api/users(?<segment>.*), /${segment}

        - id: order-service
          uri: http://order-service:8082
          predicates:
            - Path=/api/orders/**
          filters:
            - CircuitBreaker=orderService
</div>

{% template  customCode.html %}
---
id: afd8c027c88f76b8db0143cf228f5c1d
file: gw.yaml
---
{% endtemplate %}

### Breaking Down the Gateway Logic:

*   **`id`**: A unique identifier for the route, used for logging and metrics.
*   **`uri`**: The destination address (load balancer or service name) where the request will be forwarded.
*   **`predicates` (e.g., `Path`)**: These are the "if" statements. In this case, if the request path starts with `/api/users/**`, this route is triggered.
*   **`filters`**: These allow you to modify the request before it hits the backend or the response before it returns to the client:
    *   **`AddRequestHeader`**: Injects metadata (like source identification) for the downstream service to consume.
    *   **`RewritePath`**: Strips the `/api/users` prefix so that the backend service (which might just expect `/login` or `/profile`) receives a clean path.
    *   **`CircuitBreaker`**: Provides fault tolerance. If `order-service` goes down, the gateway can return a fallback response instead of hanging.

---

## Weighted Routing Explained

Weighted routing allows you to associate multiple resources with a single domain name and choose how much traffic is routed to each resource.

### Example Scenario:
You are launching a new "Canary" version of your API. You want 80% of traffic to stay on the stable version and 20% to go to the new version.

- **Stable Version**: `203.0.113.42` (Weight: 80)
- **Canary Version**: `203.0.113.99` (Weight: 20)

### Route 53 Weighted Record (JSON)

<div style="display:none;" markdown="1">
[
  {
    "Name": "api.example.com",
    "Type": "A",
    "SetIdentifier": "stable-v1",
    "Weight": 80,
    "TTL": 60,
    "ResourceRecords": [
      { "Value": "203.0.113.42" }
    ]
  },
  {
    "Name": "api.example.com",
    "Type": "A",
    "SetIdentifier": "canary-v2",
    "Weight": 20,
    "TTL": 60,
    "ResourceRecords": [
      { "Value": "203.0.113.99" }
    ]
  }
]
</div>

{% template  customCode.html %}
---
id: afd8c027c88f76b8db0143cf228f5c1d
file: record.json
---
{% endtemplate %}


### ⚠️ Pro-Tip:
Always use a **low TTL (e.g., 60 seconds)** for weighted records. This ensures that when you update weights, DNS resolvers across the world pick up the change quickly.

---

## Infrastructure as Code: CloudFormation

Using AWS CloudFormation (IaC), you can automate the provisioning of these records. Here is a corrected template for setting up weighted routing:


<div style="display:none;" markdown="1">
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Weighted Routing configuration for API Canary Deployment'

Parameters:
  DomainName:
    Type: String
    Default: 'api.example.com'
  HostedZoneId:
    Type: String
  StableIP:
    Type: String
    Default: '203.0.113.42'
  CanaryIP:
    Type: String
    Default: '203.0.113.99'
  StableWeight:
    Type: Number
    Default: 80
  CanaryWeight:
    Type: Number
    Default: 20

Resources:
  StableRecord:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneId: !Ref HostedZoneId
      Name: !Ref DomainName
      Type: A
      SetIdentifier: 'stable-v1'
      Weight: !Ref StableWeight
      TTL: '60'
      ResourceRecords:
        - !Ref StableIP

  CanaryRecord:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneId: !Ref HostedZoneId
      Name: !Ref DomainName
      Type: A
      SetIdentifier: 'canary-v2'
      Weight: !Ref CanaryWeight
      TTL: '60'
      ResourceRecords:
        - !Ref CanaryIP
</div>

{% template  customCode.html %}
---
id: afd8c027c88f76b8db0143cf228f5c1d
file: cf.yaml
---
{% endtemplate %}

### Updating Weights via CLI

To adjust the traffic flow (e.g., moving to 100% stable), simply update the stack parameters:

<div style="display:none;" markdown="1">
aws cloudformation update-stack \
  --stack-name api-routing \
  --use-previous-template \
  --parameters \
    ParameterKey=StableWeight,ParameterValue=100 \
    ParameterKey=CanaryWeight,ParameterValue=0
</div>

{% template  customCode.html %}
---
id: afd8c027c88f76b8db0143cf228f5c1d
file: aws.sh
---
{% endtemplate %}

---