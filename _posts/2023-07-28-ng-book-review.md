---
published: false
---

Below are my rough notes while reading the [ng-book]({root_url}/books/)


### Creating a new component 

```bash
ng generate component user-item
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

Then we can use this property on component, 'user-item-component.html`:

```js
Hello {{ name}}
```


### Working with arrays

Lets create a new component 

```
ng generate component user-list
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

```js
<ul>
  <li *ngFor="let name of names">Hello {{ name }}</li>
</ul>
```
NgFor repeats the element that the ngFor is called.
