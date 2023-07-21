---
layout: post
date: 2023-07-21
title: Mastering Reactive Pagination with Spring Boot and MongoDB
image: /img/
thumb: /img/
author: Tushar Sharma;
category: blog
---

.<!-- truncate_here -->


###  Create a New Spring Boot Application

Go to https://start.spring.io/ and create a new Spring Boot Application.

Build the applicaiton.


### Dependencies

```
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb-reactive</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
</dependencies>
```

### Configure MongDB

Create an application.properties file in the resources folder with the following configuration.


```java
spring.data.mongodb.uri=mongodb://localhost:27017/testdb
```

### Create an Entity

Create a Product entity in the model package.

```
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {

    @Id
    private String id;
    private String name;

    // Getters and Setters
}

```

###  Create a Repository

Create a ProductRepository in the repository package which extends ReactiveSortingRepository.

```
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends ReactiveSortingRepository<Product, String> {
}

```

### Create a Service

Create a ProductService class in the service package to interact with the repository.



```
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Flux<Product> findPaginated(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
}

```

### Create a Controller

Create a ProductController in the controller package to handle HTTP requests.


```
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.Optional;

@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public Flux<Product> getProducts(
        @RequestParam Optional<Integer> page, 
        @RequestParam Optional<Integer> size
    ) {
        return productService.findPaginated(
            PageRequest.of(page.orElse(0), size.orElse(10))
        );
    }
}

```

### Unit Testing

Create a test class for ProductService in your test directory.

```
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import reactor.test.StepVerifier;

@SpringBootTest
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    public void testFindPaginated() {
        var pageable = PageRequest.of(0, 10);

        var products = productService.findPaginated(pageable);

        StepVerifier.create(products)
                .expectNextCount(10)
                .verifyComplete();
    }
}

```

### Running the Application

Run your Spring Boot application. You should be able to access paginated results at http://localhost:8080/products. To get the first page with two items per page, use http://localhost:8080/products?page=0&size=2.