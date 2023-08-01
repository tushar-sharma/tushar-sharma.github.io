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
npm install bootstrap@latest
```

and import it in `src/styles.css`

```css
@import '~bootstrap/dist/css/bootstrap.min.css';
```

Building a UserService

```bash
ng generate service user
```

```ts
@Injectable()
export class UserService{
  constructor(private http: HttpClient) { }
  
  getUsers(){
    return this.http.get<any[]>('/api/users');
  }
}
```

It returns an observable of the HTTP response. 

### Subscribing in the component

Inject the service into `AppComponent`

```ts
constructor(private userService: UserService){ } 
```

subscribe to `getUsers()`

```ts
ngOnInit() {
  this.userService.getUsers()
  .subscribe(
    users => this.users = users,
    error => this.error = error
    );
}
```
Displaying the data

```html
<ul>
  <li *ngFor="let user of users">
    {{ user.name }}
  </li>
</ul>
```