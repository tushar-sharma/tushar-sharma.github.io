---
layout: post
title: Review of ng-book
image: https://unsplash.com/photos/aJTSzd-8GGI/download?w=437
thumb: https://unsplash.com/photos/aJTSzd-8GGI/download?w=437
author: Tushar Sharma
tags:
  - books
published: false
category: blog
---

Below are my rough notes while reading the [ng-book]({{ root_url }}/bookshelf/).<!-- truncate_here -->

Below are my rough notes while reading the [ng-book]({{ root_url }}/bookshelf/).<br>


* Creating a new component 

```bash
ng g component user-item
```

In user-item.component.ts file , we can define a new property class UserItemComponent.

```js
export class UserItemComponent implements OnInit{
  name: string;

  constuctor(){
    this.name = "Tushar";
  }

  ngOnInit(){
  }
}
```

Then we can use this property on component, `user-item-component.html`:

```js
Hello {{ name}}
```


* Working with arrays

Lets create a new component 

```
ng g component user-list
```

Replace <app-user-item></app-user-item> with <app-user-list></app-user-list>. our `user-list.component.ts` becomes

```js
export class UserListComponent implements OnInit{
    names: string[];

    constructor(){
        this.names = ["Tom", "Mathew", "Mate"];
    }


}
```

Now on `user-list.component.html` :

```html
<ul>
  <li *ngFor="let name of names">Hello {{ name }}</li>
</ul>
```

`NgFor` repeats the element that the ngFor is called.

* Accepting inputs

@Input() and @Output() give a child component a way to communicate with its parent component. @Input() lets a parent component update data in the child component. Conversely, @Output() lets the child send data to a parent component.

Add input to child component :  `user-item-component.ts` : 

```js
imprt {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
)}
           
export class UserItemComponent implements OnInit{
    @Input() name: string; 

    constructor(){
    }

    ngOnInit(){
    }
}
```
To pass values to a component we can use bracket[] syntax on parent component: `user-list.component.html`

```html
<ul>
  <li *ngFor="let individualName of names">
    <app-user-item [name]="individualName"></app-user-item>
  </li>
</ul>

```

* AppModule

We use `AppModule` to bootstrap the app. AppModule is specified in `src/app/app.module.ts`. You have to declare components in NgModule before you can use them in your templates. However if you use `ng generate` command, component is automatically added to the declarations list.


* Binding inputs to values

for this html 

```html
<form>
  <input name="title" #newTitle>
  <button (click)="addArticle(newTitle)">
</form>
```

Here Angular binds the <input> to a variable newTitle. #newTitle syntax is called a resolve. newTitle is now an object that represents this input DOM element (specifically, the type is HTMLInputElement). Because newtitle is an object, that means we get the value of the input tag using newtitle.value.

* create a model 

You can create a model inside a component, `article.model.ts`: 

```js
export class Article {
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}
```

Then you can use `model` inside your component, `article.component.ts`: 

```js
export class ArticleComponent implements OnInit{
  article: Article;

  constructor(){
    this.article = new Article(
      'TestTitle'
    )
  }
}
```
* Property '...' has no initializer and is not definitely assigned in the constructor error fix in Angular

Lets say you ahve a child component 

```js

export class EmpComponent implements OnInit {
  
  @Input() employees: Employee[];
  
  constructor() {

   }

  ngOnInit() {
    
  }

}
```

This may give error : Property '...' has no initializer. 

One fix is to definite assignment assertion to property. 

```js

export class EmpComponent implements OnInit {
  
  @Input() employees!: Employee[];
  
  constructor() {

   }

  ngOnInit() {
    
  }

}
```

* Typescript

Typescript is a superset of ES6 (ECMAScript 6). The transpiler takes typescript code and converts to ES6. 

Benefits of using typescript:
	
1. type checking. It helps prevent bugs at compile time. eg

```js
var fullName : string;
function greetText(fullName: string): string {
  return "hello " + fullName;
}
function setName(name: string) : void{
  this.fullName = name;
}
```

Builtin types for typescript: 

```js
var fullName: string = "Tushar"; 
var age: number = 5;
var married: boolean = true;
var jobs: string[] = ['Apple', 'Dell', 'Hp'];
var JOBS: Array<String> = ['Apple, 'Dell', 'Hp'];
// default value is 0
enum Role { Employee, Manager, Admin}; 
var role : Role = Role.Employee;
// manally set value
enum Role {Employee=3, Manager=9, Admin=0};
var something: any = 'asString';

```

* Component selector

The selector is a way to define what elements in the HTML will match the component. So this is a selector

```html
<inventory-app-root></inventory-app-root>
```

* Component Template

`@Component` decorator is where you configure your component. something like

```js
@Component({
  selector: 'inventory-app-root',
  template: './app.component.html'
})
```

Let's create a new Product

```js
import { Product } from './product.model';

export class AppComponent {
  product: Product;

  constructor() {
    this.product = new Product(
      'name',
      [1, 2, 3, 4, 5]
    );
  }
}
```

We can use Product in the `template`: 

```html
<div class="inventory-app">
  <h1>{{ product.name }}</h1>
</div>
```

`{{...}}` syntax is called template binding. It tells the view we want to use the value of the expression inside the brackets at this location in our template.


* Adding more products

The [] characters at the end mean we want products to be an Array of Products.

```js
export class AppComponent {
  products: Product[];

  constructor() {
    this.products = [
      new Product(),
      new Product()
    ];
  }
}
```

Creating a product List

```html
<div class="inventory-app"> <!-- input -->
  <product-list 
      [productList]="products" <!-- input -->
      (onProductSelected)="productSelected($event)"  <!-- output -->
  >
  </product-list>
</div>

```

The [squareBrackets] pass inputs and the (parentheses) handle outputs. Data flows in to your component via input bindings and events flow out of your component through output bindings. `$event` is a special variable here that represents the thing emitted on (i.e. sent to) the output.

Create a component 

``` bash
ng g component products-list
```


Create a model Product

```bash
ng g class Product
```