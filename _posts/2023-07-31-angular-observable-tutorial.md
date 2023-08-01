---
published: false
---
## Learn to Use Observables in Angular

Observables provide support for passing messages between parts of your application. They are use frequently in Angular applications for handling async data flows. 

### What are observables?

An observable is a stream of data that we can subscribe to. It emits new values over time that we can react to. 

For example, an Observable from a HTTP request would emit the response when the request completes. Or a time Observalbe could emit values at regular interval. 

Observable help us handle asynchronous data flows in a declarative style.  We define the Observable data stream and then subscribe to it to get notified of new values.


### Getting started

Create a new angular app. 

```bash
ng new angular-observables-demo
cd angular-observables-demo
```

Add Boostrap

```bash
npm install --save bootstrap@latest
```

and import it in  `src/styles.css`

```css
@import '~bootstrap/dist/css/bootstrap.min.css';
```

Building a UserService

```bash
ng generate service user
```

And add `user.service.ts`

```ts
import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  data: string[] = ['Tom', 'Dick', 'Harry'];

  getUsers(): Observable<string[]> {
    return of(this.data);
  }
}
```

It returns an observable of the HTTP response. 

### Subscribing in the component

Modify `app.component.ts`: 

```ts
import {Component, OnInit} from '@angular/core';
import {UserService} from "./user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  users: string[] | undefined;
  title: string;
  constructor(private userService : UserService) {
    this.title = 'Tutorial on Observable';
  }

  ngOnInit(){
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}
```
For displaying data, you can modify `app.component.html`: 

```html
<div>
  <h1>{{ title }}</h1>
  <ul>
    <li *ngFor="let user of users">
      {{ user }}
    </li>
  </ul>
</div>

```