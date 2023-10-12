---
published: false
---

Create a basic Angular application that lets users copy a text to their clipboard. 

### setup

```bash
$ npm install -g @angular/cli
$ ng new clipboard-app
$ cd clipboard-app
```

## Add a component `address-table`

```bash
$ ng generate component address-table
```

inside `address-table.component.ts`: 

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AdressTableComponent {
  people = [
    { name: 'Sherlock', address: '221 Baker Street, London'},
    { name: 'Tom', address: '456 Main St, Springfield'}
  ];
  
  copyAdress(address: string): void {
    navigator.clipboard.writeText(address).then(() => {
     
    });
  }
}
```