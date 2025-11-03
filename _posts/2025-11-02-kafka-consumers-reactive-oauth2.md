---
layout: post
title: Kafka Consumers with Reactive OAuth2 in Non-HTTP Contexts
category: blog
author: tushar shamra
tags: [kafka, spring, reactive, oauth2]
thumb: https://unsplash.com/photos/t9EziRd2RBk/download?w=437
image: https://unsplash.com/photos/t9EziRd2RBk/download?w=437
---

When integrating Kafka consumers with reactive OAuth2 for securing outbound HTTP calls, a common pitfall arises: Kafka processing typically operates in a background, non-HTTP context. This means there's no `ServerWebExchange` available, which is a core component of the reactive web stack that exposes the current HTTP request/response and request-scoped attributes.<!-- truncate_here -->

When integrating Kafka consumers with reactive OAuth2 for securing outbound HTTP calls, a common pitfall arises: Kafka processing typically operates in a background, non-HTTP context. This means there's no `ServerWebExchange` available, which is a core component of the reactive web stack that exposes the current HTTP request/response and request-scoped attributes.

### Why `ServerWebExchange` is Absent in Kafka Consumers

*   **Kafka's Nature:** Kafka consumers are designed to read messages from topics. They do not inherently make or receive HTTP requests. Any HTTP API calls made by a consumer are initiated from within the consumer's processing logic, not as a direct response to an incoming HTTP request.
*   **`ServerBearerExchangeFilterFunction` Limitations:** While `ServerBearerExchangeFilterFunction` might seem like a solution, it relies on the presence of a `ServerWebExchange` to extract a bearer token. It's designed for scenarios where an HTTP request is actively being processed. If your Kafka processing happens to be part of an existing HTTP request flow (which is rare), it might appear to work, but this is not its intended use for background tasks.

### The Problem with Server-Side OAuth2 Helpers

Server-side helpers like `ServerOAuth2AuthorizedClientExchangeFilterFunction` or any component that depends on `ServerWebExchange` will inevitably fail in background contexts with errors such as "ServerWebExchange can't be null". This is because these components are built to operate within the lifecycle of an HTTP request.

### The Solution: Programmatic Client Credentials Grant

For Kafka consumers and other non-HTTP contexts, the client-credentials grant flow must be handled programmatically. This involves configuring a reactive OAuth2 client stack that can obtain and manage tokens independently of an HTTP request.

**Key Components for a Reactive OAuth2 Client Stack:**

1.  **`ReactiveClientRegistrationRepository`**: Manages client registrations, providing details about OAuth2 clients (e.g., client ID, client secret, authorization grant type).
2.  **`InMemoryReactiveOAuth2AuthorizedClientService`**: Stores and retrieves `OAuth2AuthorizedClient` instances in memory. For production, consider a persistent store.
3.  **`AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager`**: This manager is responsible for authorizing OAuth2 clients. It uses the `ReactiveClientRegistrationRepository` and `InMemoryReactiveOAuth2AuthorizedClientService` to obtain and refresh tokens. Crucially, it needs to be configured with a `clientCredentials()` provider for non-HTTP contexts.

**Minimal Sketch (Reactive, Conceptual):**

The following code snippet illustrates how to set up and use these components to obtain an OAuth2 token and attach it to a `WebClient` request:

```java
import org.springframework.security.oauth2.client.AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.InMemoryReactiveOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ReactiveOAuth2AuthorizedClientProviderBuilder;
import org.springframework.web.reactive.function.client.WebClient;

// Assume 'regs' is an instance of ReactiveClientRegistrationRepository,
// configured with your client registration details (e.g., "service-client").
ReactiveClientRegistrationRepository regs = ...;

// Initialize the client service to store authorized clients.
InMemoryReactiveOAuth2AuthorizedClientService clientService =
    new InMemoryReactiveOAuth2AuthorizedClientService(regs);

// Configure the authorized client manager for client_credentials grant.
AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager manager =
    new AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager(regs, clientService);

manager.setAuthorizedClientProvider(
    ReactiveOAuth2AuthorizedClientProviderBuilder.builder().clientCredentials().build());

// Create an authorization request for your service client.
OAuth2AuthorizeRequest authReq = OAuth2AuthorizeRequest.withClientRegistrationId("service-client")
    .principal("kafka-worker") // A principal name for the authorization request
    .build();

// Use the manager to obtain an OAuth2AuthorizedClient and then make a WebClient call.
manager.authorize(authReq)
  .flatMap(authorizedClient -> {
    // Build your WebClient (e.g., using WebClient.builder().build())
    WebClient webClient = WebClient.builder().build();
    return webClient.get()
      .uri("https://api.example.com")
      .headers(headers -> headers.setBearerAuth(authorizedClient.getAccessToken().getTokenValue()))
      .retrieve()
      .bodyToMono(String.class);
  })
  .subscribe(
    response -> System.out.println("API Response: " + response),
    error -> System.err.println("Error calling API: " + error.getMessage())
  );
```