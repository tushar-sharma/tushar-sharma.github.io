---
published: false
---

TypeScript Enums and String Mapping

In a world of typescript, type safety is a king. Enumerations (enums) provide a way to define a set of named constants, ensuring more readable and less error-prone code. 

Lets define a enum in typescript

```
enum Answer {
    No = 0,
    Yes = 1
}

enum Status {
    Approved = 'Approved',
    Pending = 'Pending'
}

console.log('The status is ' + Status.Approved + ' with answer ' + Answer.Yes);

// The status is Approved with answer 1
```

## Create a new angular application

```
ng create enum-mapping && cd $_
npm install --save bootstrap@latest
```

And import it in `src/styles.css` 

```
@import '~bootstrap/dist/css/bootstrap.min.css';
```