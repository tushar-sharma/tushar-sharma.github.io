---
published: false
---

Below are my rough notes while reading the [ng-book]({{ root_url }}/books/)


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

### Accepting inputs

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

### AppModule

We use `AppModule` to bootstrap the app. AppModule is specified in `src/app/app.module.ts`. You have to declare components in NgModule before you can use them in your templates. However if you use `ng generate` command, component is automatically added to the declarations list.


### Writing first application