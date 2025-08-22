---
layout: post
title: Getting Started with Oauth2
image: https://unsplash.com/photos/8FxJi5wuwKc/download?w=437
thumb: https://unsplash.com/photos/8FxJi5wuwKc/download?w=437
author: tushar sharma
category: blog
tags:
  - oauth2
  - java
  - spring boot
---

OAuth2 is an authorization framework that enables applications to access resources on behalf of a user without exposing their credentials. It is not an authentication protocol by itself — it delegates authorization securely.<!-- truncate_here -->

OAuth2 is an authorization framework that enables applications to access resources on behalf of a user without exposing their credentials. It is not an authentication protocol by itself — it delegates authorization securely. 

### Why OAuth2? 

Imagine an app that needs access to your Gmail. Instead of asking for your password (a security risk), it redirects you to Google’s login page. After you log in, Google issues a token to the app. The app uses this token to access your data — you never shared your password. 

This is OAuth2 in action: secure, delegated access

### Core OAuth2 Flow (Authorization Code Flow) 

1. Redirect to /authorize endpoint
The app redirects the user to the authorization server (e.g., Google, Okta).
Example:  

```
https://accounts.google.com/oauth2/authorize?
  client_id=CLIENT_ID&
  redirect_uri=CALLBACK_URL&
  response_type=code&
  scope=email profile
```

2. User logs in and consents
The identity provider authenticates the user and asks for permission.

3. Authorization server redirects with a code
On success, it sends a one-time-use authorization code to the redirect_uri

4. App exchanges code for tokens
The backend calls the /token endpoint:  

```
POST /token
Body: client_id, client_secret, code, redirect_uri, grant_type=authorization_code
```

Response includes: 

* **access_token** – to access resources

* **id_token (if OpenID Connect)** – for user identity
    
* **refresh_token** – to get new access tokens

5. Use access token
Include in requests as:  

```
Authorization: Bearer <access_token>
```

### Key Concepts 

* Authorization Server: Issues tokens after verifying identity (e.g., Google, Okta, Azure AD).

* Resource Owner: The user who owns the data.

* JWT (JSON Web Token): (Base64URL-encoded) dot separated string like : "xxx.yyy.zzz" which is (header.payload.signature). Can be decoded but not modified

* Identity Provider (IdP): Service implementing OAuth2/OpenID Connect (e.g., Auth0, Okta, Entra ID).

### OAuth2 vs OpenID Connect (OIDC) 

* OAuth2: Authorization only (what can the app do?)

* OpenID Connect (OIDC): Adds authentication layer on top of OAuth2.
     

OIDC introduces: 

* id_token (a JWT containing user identity)

* /userinfo endpoint (returns user details like name, email)
    
* openid scope (required to trigger OIDC flow)
     
* Always use OIDC when you need to log in users. 
     
### Common OAuth2 Flows

| Flow | Use Case | Client Type | Security Notes |
|------|---------|-------------|----------------|
| **Authorization Code** | Web applications with a backend | Confidential | Recommended for server-side apps |
| **Authorization Code + PKCE** | Single-Page Apps (SPAs), mobile apps | Public | Secure against code interception; required for SPAs |
| **Client Credentials** | Machine-to-machine (M2M) communication | Confidential | For service accounts, not end-user access |
| **Implicit (Legacy)** | Older SPAs (no backend) | Public | ❌ Deprecated — do not use |
| **Resource Owner Password Credentials** | Trusted first-party apps only | Confidential | Only if absolutely necessary; avoid in favor of OAuth2 flows |

#### When to Use Which Flow?

- **User Login (Web App)**: Authorization Code  
- **React/Angular App**: Authorization Code + PKCE  
- **Backend Service Calling API**: Client Credentials  
- **Native Mobile App**: Authorization Code + PKCE  
- **Testing in Postman**: Authorization Code + PKCE


### OAuth2 in Java Spring Boot

#### Using token from UI
If your UI already has an access token:

```java
@Repository
public class Repository {

    private final WebClient webClient;

    public Repository(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                          .baseUrl("URL")
                          .filter(new ServerBearerExchange(FilterFunction))
                          .build();
    }
}
```
### Using Client Credentials Flow

in application.yaml 

```yaml
api:
  auth2:
    provider:
      issuer-uri: "https://auth-server.com/oauth2"
    client:
      client-id: "CLIENT_ID"
      client-secret: "CLIENT_SECRET"
      authorization-grant-type: client_credentials
      scope: "read write"

```

Set up a reactive WebClient that automatically fetches and attaches OAuth2 tokens using client credentials.

```java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(WebClient.Builder webClientBuilder,
                               @Value("${apis.url}") String apiUrl,
                               @Value("${api.auth2.provider.issuer-uri}") String issuerUri,
                               @Value("${api.auth2.client.client-id}") String clientId,
                               @Value("${api.auth2.client.client-secret}") String clientSecret,
                               @Value("${api.auth2.client.scope}") String scope) {

        ClientRegistration clientRegistration = ClientRegistration
                .withRegistrationId("instrument-api")
                .tokenUri(issuerUri + "/v1/token")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
                .scope(scope)
                .build();

        ReactiveClientRegistrationRepository clientRegistrations =
                new InMemoryReactiveClientRegistrationRepository(clientRegistration);

        ReactiveOAuth2AuthorizedClientService authorizedClientService =
                new InMemoryReactiveOAuth2AuthorizedClientService(clientRegistrations);

        return webClientBuilder
                .filter(new ServerOAuth2AuthorizedClientExchangeFilterFunction(
                        new AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager(
                                clientRegistrations, authorizedClientService)))
                .baseUrl(apiUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}

```