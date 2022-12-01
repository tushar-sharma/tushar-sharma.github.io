---
published: false
---

```bash
Caused by: java.io.FileNotFoundException: META-INF/native/libnetty_resolver_dns_native_macos_aarch_64.jnilib
```


Add this in `build.gradle` 

```bash
dependencies {

	implementation("io.netty:netty-resolver-dns-native-macos:4.1.75.Final") {
		artifact {
			classifier = "osx-aarch_64"
		}
	}
}
```