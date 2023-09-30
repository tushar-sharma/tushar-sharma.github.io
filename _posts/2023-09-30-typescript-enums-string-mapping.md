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

## Lets create a Mock data

```
npm install -g json-server
```

lets create a file `db.json`

```
{
  "users": [
    {
      "id": 1234,
      "name": "Andrew Owen",
      "status": "Approved"
    },
    {
      "id": 1235,
      "name": "Susan Que",
      "status": "Pending"
    },
    {
      "id": 1236,
      "name": "John Doe",
      "status": "Pending"
    }
  ]
}
```

```
json-server --watch db.json --port 3003
```

Check `localhost:3003/users` on your browser.


## Create a new angular application

```
ng new enum-mapping && cd $_
npm install --save bootstrap@latest
```

And import it in `src/styles.css` 

```
@import '~bootstrap/dist/css/bootstrap.min.css';
```

Create a new file `src/app/types.ts`:

```ts
export enum Status {
  Pending = 'Pending',
  Approval = 'Approval'
}

```

Create a new service

```
ng generate service data
```

add this to `data-service.ts`

```ts
import { Injectable } from '@angular/core';
import { Status } from './types';
import { HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
const API_ENDPOINT = 'http://localhost:3003/users';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  fetchData() {
    return this.http.get<any[]>(API_ENDPOINT).pipe(
      map(apps => apps.map( app => {
        app.status = this.decodeStatus(app.status);
        return app;
      }))
    )
  }

  private decodeStatus(status: string){
    return Status[status as keyof typeof Status];
  }
}

```

`Injectable` is a decorator for dependency injection (DI). Through the `providedIn` property, it controls the scope and instantiation of services.