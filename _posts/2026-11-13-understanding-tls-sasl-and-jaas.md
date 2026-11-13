---
layout: post
title: Understanding TLS, SASL, and JAAS
image: https://unsplash.com/photos/Fi334arhI2o/download?w=437
thumb: https://unsplash.com/photos/Fi334arhI2o/download?w=437
author: tushar sharma
category: blog
tags:
  - security
  - authentication
  - java
---

The simple way for me to remember them is.<!-- truncate_here -->

The simplest way for me to remember them is:

- TLS protects the connection.
- SASL handles the authentication conversation.
- JAAS tells a Java application how to perform that authentication.

## TLS

TLS stands for **Transport Layer Security**. It encrypts data in transit, checks that the data was not modified along the way, and usually verifies the server's identity using a certificate. It can also verify the client's identity when mutual TLS, or mTLS, is enabled.

SSL is the older, obsolete predecessor to TLS. People still casually say "SSL," but modern systems should be using TLS.

TLS does not automatically mean that the application user has been authenticated. It secures the road between the client and server; another mechanism can still be needed to identify who is travelling on that road.

## SASL

SASL stands for **Simple Authentication and Security Layer**. It is not one authentication algorithm. It is a framework that lets a client and server agree on and use an authentication mechanism.

Some SASL mechanisms I keep seeing are:

1. **SCRAM-SHA-512**: a challenge-response mechanism based on a username and password. The password itself is not sent across the network. The `512` refers to the SHA-512 hash function used by the mechanism.
2. **GSSAPI/Kerberos**: a ticket-based mechanism. Kerberos is the authentication system, while GSSAPI is the SASL mechanism name commonly exposed by applications such as Kafka.

SASL can support security features beyond authentication, depending on the mechanism. In the systems I am looking at, however, the useful mental model is still: **TLS encrypts the connection, while SASL authenticates the client**.

This is why configuration names sometimes combine both ideas. For example, `SASL_SSL` in Kafka means: use SASL for authentication over a TLS-encrypted connection. Despite the name, modern Kafka configurations use TLS rather than the obsolete SSL protocol.

## JAAS

JAAS stands for **Java Authentication and Authorization Service**. In this context, it is the Java-side configuration that tells the application which login module to use and provides the options that module needs.

For example, a Java or Kafka client using SCRAM may configure a SCRAM login module with a username and password. A client using Kerberos would use a Kerberos login module and supply settings such as a principal and keytab.

So JAAS is not another network protocol competing with TLS or SASL. It is how the Java application plugs into the chosen authentication mechanism.

Putting the full flow together in my head:

1. The client opens a connection to the server.
2. TLS can encrypt that connection and verify the server certificate.
3. SASL runs an authentication mechanism, such as SCRAM-SHA-512 or GSSAPI, over the connection.
4. In a Java client, JAAS supplies the login module and credentials needed by that SASL mechanism.

