---
published: false
---
## Git

When you do `git status` , sometimes you want to filter some result. For example if you dont want to see `deleted` files.

```bash
$ git status | grep -v deleted
```

Here -v is for invert-search. 

If you want to filter multiple words

```bash
$ git status | grep -E -v 'deleted|modified'
```

You can type `man grep` for more detail. 

## React 

On an existing react app you can start it by

```bash
$ npm install
$ npm start
```

You can create dropdown using `select`.

```javascript
return (
  <select 
    value={selectedValue} 
    onChange={e => setSelectedValue(e.target.value)}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
```

Here , `value` is used to set the default selected value in the dropdown list when the component first renders. It is taken from the values object using the get function.

`options` is an array of objects that represents the dropdown list options. Each option object contains the text to be displayed in the list and its corresponding value. When the component is rendered, these options will be displayed as the available choices for the user to select from.

You can pass `options` as 

```javascript
const options = [
  { value: 'Option 1', label: 'Option 1' },
  { value: 'Option 2', label: 'Option 2' },
  { value: 'Option 3', label: 'Option 3' },
];
```


## Guinea Pig food

I stopped at Petsmart today to buy pellets for piggies. Those little cute bastards are pooping volcanoes. They even poop in their sleep. It's one of the worst thing owning a guinea pig.

## Brussel Sprouts

Brussels sprouts are not my favoruite food. Here's the recipe 

1. Cut the Sprouts in half and discard the stem.

2. Pour olive oil over the sprouts in the tray with black pepper and salt.

3. Heat oven with 425 temperature.

4. Bake them for 20 minutes. 


## Tennis 

I played tennis in the morning. My serves keep hitting the net. I guess I need to work on my serves. I usually do continental serve but had to switch to pancake serves when I hit too many of them.