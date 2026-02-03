---
published: false
---

`claude-commit` uses `claude` to generate git commit messages. 

```
pipx install claude-commit
```

Error 

```
, line 509, in generate_commit_message
    console.print(f"[red]❌ Unexpected error: {e}[/red]", file=sys.stderr)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
TypeError: Console.print() got an unexpected keyword argument 'file
```


```
pipx uninstall claude-commit
pipx install git+https://github.com/tushar-sharma/claude-commit.git
```

