# CSS.jsx

Write your CSS in JSX.\
This is the syntax for jsx lovers. (a nice experiment)

> disclaimer, this project is work in progress and I'm the only maintainer. If you would like to collab, feel free to create an issue regarding that and we let's work together

## Vision

We want to allow our users to write CSS in JSX way:

### `my-style.css.jsx`

```jsx
<>
  <rule selector="h1">
    color: red;
  </rule>

  <rule selector=".btn">
      color: red;
      <rule selector="&:hover">
        <properties color="gold" fontSize="1rem">
      </rule>
  </rule>
</>
```


### `my-component.js` (this will output 2 files):
```jsx

const { classes } = (
  <>
  <rule selector="h1">
    color: red;
  </rule>

  <rule selector=".btn">
      color: red;
      <rule selector="&:hover">
        <properties color="gold" fontSize="1rem">
      </rule>
  </rule>
</>
)

const Component = () => <button className={classes.btn}>My Button</button>
```

#### output:
 
> The `namespace` prefix below will be determent in the build process.

`some-css.css`:
```css
h1 {
  color: red;
}

.namespace__btn {
  color: red;
}

.namespace__btn:hover {
  color: gold;
  font-size: 1rem;
}
```

`my-component.js`:
```jsx

const { classes } = {
  classes: {
    btn: 'namespace_btn'
  }
}

const Component = () => <button className={classes.btn}>My Button</button>
```

> We will provide the classes object and the compilation flow will decide if it should be inlined.