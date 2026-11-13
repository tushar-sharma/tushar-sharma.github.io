---
layout: post
title: Understanding TLS, OIDC, OAuth, SASL, and JAAS
image: https://unsplash.com/photos/Fi334arhI2o/download?w=437
thumb: https://unsplash.com/photos/Fi334arhI2o/download?w=437
author: tushar sharma
category: blog
tags:
  - security
  - authentication
  - oauth
  - oidc
  - kafka
  - java
---

I kept seeing TLS, Okta, OIDC, OAuth, SASL, and JAAS together. They all relate to security, but they do not do the same job. This is the mental model I want to remember.<!-- truncate_here -->

- **TLS** protects the connection.
- **Okta** is an identity provider that manages identities.
- **OIDC** tells an application who signed in.
- **OAuth 2.0** gives a client permission to access a resource.
- **SASL** authenticates a client connection inside another protocol, such as Kafka.
- **JAAS** configures the authentication mechanism in a Java application.

## TLS

TLS stands for **Transport Layer Security**. It encrypts data in transit, checks that the data was not modified along the way, and usually verifies the server's identity using a certificate. It can also verify the client's identity when mutual TLS, or mTLS, is enabled.

SSL is the older, obsolete predecessor to TLS. People still casually say "SSL," but modern systems should be using TLS.

TLS does not automatically mean that the application user has been authenticated. It secures the road between the client and server; another mechanism can still be needed to identify who is travelling on that road.

## Okta: the identity provider

Okta is an **identity provider**, or IdP. It manages or connects to identities and information such as users, credentials, groups, application assignments, and MFA settings.

When I visit `company.okta.com`, Okta may ask for my password and send an Okta Verify Push. The Push is one authentication factor. Only after I complete authentication can Okta issue tokens to the application.

Okta also keeps an SSO session, normally through a secure browser cookie. When I open another company application, that application can redirect me to Okta again. If my Okta session is still valid, I may not need to enter my password or approve another Push. Okta can still issue new tokens intended for that application.

## OIDC and the ID token

OpenID Connect, or **OIDC**, is an identity and authentication protocol built on top of OAuth 2.0. It lets an application ask an identity provider: **Who signed in?**

After the user authenticates, an OIDC flow can return an **ID token**. The ID token is usually a signed JWT containing claims such as:

```json
{
  "iss": "https://company.okta.com/oauth2/default",
  "sub": "user-123",
  "aud": "application-client-id",
  "email": "user@company.com",
  "exp": 1234567890
}
```

The application must validate the signature and claims. In particular, it checks the issuer (`iss`), audience (`aud`), expiration (`exp`), and subject (`sub`). Decoding a JWT only makes its contents readable; decoding does not validate it.

The ID token is for the client application to establish a login session. It should not be sent to an API as if it were an access token.

## OAuth 2.0 and the access token

OAuth 2.0 is primarily an **authorization framework**. It lets a client obtain permission to access a protected resource, such as an API. The result is normally an **access token**.

The client sends that token to the API:

```http
Authorization: Bearer <access-token>
```

The API validates the token and checks whether it was issued by a trusted authorization server, has not expired, is intended for that API, and has the necessary scopes or permissions.

An access token is often a bearer token. This means whoever possesses it may be able to use it, so it must be protected.

The distinction I want to remember is:

```text
ID token     -> who authenticated?
Access token -> what resource may the client access?
```

OIDC and OAuth do not necessarily happen as two completely separate flows. An application commonly uses the Authorization Code flow and receives both tokens after exchanging the code:

```text
Browser -> Okta: authenticate the user, including MFA when required
Okta -> application: authorization code
Application -> Okta: exchange the code
Okta -> application: ID token + access token
```

The request must include the `openid` scope to make it an OIDC request and receive an ID token.

### Why client credentials gives me no ID token

The Client Credentials flow represents a service or application, not a human user:

```text
Application authenticates itself -> access token
No user signs in                 -> no ID token
```

This explains why calling Okta's token endpoint with a client ID and client secret gives me an access token but no ID token. To receive an ID token for a user, I need a user-facing OIDC flow such as Authorization Code with PKCE.

During development, the `id_token` appears in the response from the token endpoint. For a server-side application, the backend usually performs the code exchange, so the browser may never see the tokens. I should not log real tokens or paste company tokens into public JWT-decoding websites.

## SASL

SASL stands for **Simple Authentication and Security Layer**. It is not one authentication algorithm. It is a framework that lets a client and server agree on and use an authentication mechanism.

Some SASL mechanisms I keep seeing are:

1. **SCRAM-SHA-512**: a challenge-response mechanism based on a username and password. The password itself is not sent across the network. The `512` refers to the SHA-512 hash function used by the mechanism.
2. **GSSAPI/Kerberos**: a ticket-based mechanism. Kerberos is the authentication system, while GSSAPI is the SASL mechanism name commonly exposed by applications such as Kafka.
3. **OAUTHBEARER**: a mechanism through which a client presents an OAuth access token to the server.

SASL can support security features beyond authentication, depending on the mechanism. In the systems I am looking at, however, the useful mental model is still: **TLS encrypts the connection, while SASL authenticates the client**.

This is why configuration names sometimes combine both ideas. For example, `SASL_SSL` in Kafka means: use SASL for authentication over a TLS-encrypted connection. Despite the name, modern Kafka configurations use TLS rather than the obsolete SSL protocol.

## Why OIDC and SASL are both related to authentication

OIDC and SASL can both participate in authentication, but at different boundaries:

| | OIDC | SASL |
|---|---|---|
| Main conversation | Application and identity provider | Protocol client and protocol server |
| Typical use | Sign a user into a web or mobile application | Authenticate a Kafka, SMTP, or LDAP connection |
| Result | Identity represented by an ID token | Authenticated protocol connection |
| Built-in browser login, SSO, and MFA flow | Yes | No |
| Authentication choices | OIDC flow through an identity provider | Pluggable mechanisms such as SCRAM, GSSAPI, and OAUTHBEARER |

SASL does not store identities and it is not an identity provider. It defines the authentication conversation inside another protocol. Depending on the selected mechanism, the proof might be based on a password, a Kerberos ticket, or an OAuth access token.

The analogy that works for me is:

> The identity provider issues the badge. SASL defines how I show an accepted badge at a particular door. The server's authorization rules decide which rooms I may enter.

## How OAuth and SASL can connect in Kafka

A self-managed Kafka cluster can be configured to trust OAuth tokens from an identity provider:

```text
Client -> Okta/OAuth: obtain an access token
Client -> Kafka using SASL/OAUTHBEARER: present the access token
Kafka: validate the token and map it to a principal
Kafka ACLs: decide which topics or consumer groups it may use
```

OIDC by itself cannot replace the Kafka authentication handshake. Kafka speaks its own binary protocol and does not redirect a client to an Okta login page. The access token is presented to Kafka through the `OAUTHBEARER` SASL mechanism.

For Amazon MSK, the mechanism named `SASL_OAUTHBEARER` is used for AWS IAM authentication; it does not mean that MSK accepts an arbitrary Okta token. AWS controls the managed brokers and supports its documented authentication choices, such as IAM, SASL/SCRAM, and mutual TLS. An organization can federate an Okta identity into an AWS IAM role, but the Kafka client ultimately uses AWS credentials to generate the token MSK accepts.

## JAAS

JAAS stands for **Java Authentication and Authorization Service**. In this context, it is the Java-side configuration that tells the application which login module to use and provides the options that module needs.

For example, a Java or Kafka client using SCRAM may configure a SCRAM login module with a username and password. A client using Kerberos would use a Kerberos login module and supply settings such as a principal and keytab.

So JAAS is not another network protocol competing with TLS or SASL. It is how the Java application plugs into the chosen authentication mechanism.

Putting the original Kafka flow together in my head:

1. The client opens a connection to the server.
2. TLS can encrypt that connection and verify the server certificate.
3. SASL runs an authentication mechanism, such as SCRAM-SHA-512 or GSSAPI, over the connection.
4. In a Java client, JAAS supplies the login module and credentials needed by that SASL mechanism.

The final shortcut I want to recall is:

```text
TLS         -> protects the network connection
Okta        -> manages identities and authentication policies
OIDC        -> supplies identity information to an application
ID token    -> describes who authenticated
OAuth 2.0   -> grants delegated access
Access token-> represents permission to call a resource
SASL        -> authenticates a client within a protocol such as Kafka
Kafka ACLs  -> decide what the authenticated principal may do
JAAS        -> wires the chosen authentication into a Java client
```

