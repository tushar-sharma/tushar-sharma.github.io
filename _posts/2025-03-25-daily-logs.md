
## Makefile

Lets say you have a Makefile 

```
build:
	./gradlew clean build
```

And when you build it 

```bash 
$ make -s build
```

It may not build it : 

```
make: `build' is up to date.
```

use `.PHONY` to indicate that it's not a file, So your'e Makefile 

```
.PHONY: build

build:
	./gradlew clean build
```