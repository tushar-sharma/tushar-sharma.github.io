---
published: false
---

Below are my rough notes while reading the [ng-book]({root_url}/books/)

Creating a new component 

```bash
$ ng generate component user-item
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