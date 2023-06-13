---
published: false
---
## Run Inline Python

```python
python_code=$(cat <<EOF
sum_random_number = 2 + 4;
print(f"Test Inline Python : {sum_random_number}")
EOF
)

python -c "${python_code}"    
```
