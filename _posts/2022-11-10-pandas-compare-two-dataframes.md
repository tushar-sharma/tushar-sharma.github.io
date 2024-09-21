---
layout: post
date: 2022-11-10
title: Pandas inner join on dataframes
tags:
   - python
   - pandas
image: https://unsplash.com/photos/4EajIuUxgAQ/download?w=437
thumb: https://unsplash.com/photos/4EajIuUxgAQ/download?w=437
author: Tushar Sharma
category: blog
---

Performing inner join on pandas dataframe is straightforward. However I wanted to override values from the right dataframe.<!-- truncate_here -->

Performing inner join on pandas dataframe is straightforward. However I wanted to override values from the right dataframe.

Let us assume we have two dataframes as 

```python
import pandas as pd

df1_data = [[1, 'apple'], [2, 'orange'], ['3', 'lemon']]   
df1_df = pd.DataFrame(df1_data, columns = ['id', 'fruit']) 

df2_data = [[1, 'guava'], [2, 'orange'], ['4', 'jackfruit']]
df2_df = pd.DataFrame(df2_data, columns = ['id', 'fruit'])
```

We can visualize these dataframes as

| <img align="center"  loading="lazy" src="{{ root_url }}/img/pandas_inner_join1.png" alt="Pandas Inner Join" />|

Cast column `id` as integer

```python
df1_df['id'] = df1_df['id'].astype(int)
df2_df['id'] = df2_df['id'].astype(int)
```

We can perform a simple inner join on key `id`

```python
df1_df.merge(df2_df, on='id', how='inner')
```

| <img align="center"  loading="lazy" src="{{ root_url }}/img/pandas_inner_join2.png" alt="Pandas Inner Join" />|


Since we need to retain right column , so we can rename columns from the left with suffix as `dup`


```python
df = df1_df.merge(df2_df, on='id', how='inner', suffixes =('_dup', ''))
```

| <img align="center"  loading="lazy" src="{{ root_url }}/img/pandas_inner_join3.png" alt="Pandas Inner Join" />|

We can drop rows where fruit_dup is not equal to fruit column since we are only interested in differences.

```python
df = df[df['fruit_dup'] != df['fruit']]
```

| <img align="center"  loading="lazy" src="{{ root_url }}/img/pandas_inner_join4.png" alt="Pandas Inner Join" />|


Lastly we can drop the _dup column

```pyton
del df['fruit_dup']
```