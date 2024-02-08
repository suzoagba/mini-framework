# Implementation of the `mini-framework` project

## About

# Mini-framework

This repository comprises a minimalist JavaScript framework alongside a TodoMVC web application developed with it. The framework simplifies DOM manipulation, integrates a URL synchronization routing system, facilitates state management, and manages events. For comprehensive usage guidelines and examples, refer to the documentation below.

## Structure and How to Run Your App

Your app structure should be placed into the `src/` folder. The main entry file is named `index.js`, where you place your start files.

### Requirements:
- Node.js

### Launching Your Framework App:
You can launch your Framework app by running `npm start`.

### Launching Your Framework Development Server:
You can launch your Framework development server by running `npm run dev`.

## Audit Information

For audit-related inquiries, please refer to the **[Audit questions](https://github.com/01-edu/public/tree/master/subjects/mini-framework/audit) section.

To access the TodoMVC web application, use [Vercel](https://mini-framework-suzoagba.vercel.app/)

## Routing Error Handling
If an incorrect route is visited, the framework renders a custom error page with a link that directs you back to the homepage.
`./404.html`

## How to Use the Framework

## 1. Simple counter example

```javascript
import {CustomComponent, Css, init, registerRoute, createState} from "./framework/index.js";

function Home() {
    const counter = createState(0)
    const CounterDisplay = CustomComponent('p',{ id: "counter" }, () => `Counter: ${counter.get()}`)
    const Section = CustomComponent('section',{
        class: "counter-section"
    },
        CustomComponent('div',{
            class: "counter-container"
        },
            CustomComponent('button'{
                id: "counter-button",
                onclick: () => counter.set(counter.get() + 1)
            }, "Increment"),
            CounterDisplay
        )
    )
    counter.subscribe(CounterDisplay)
    return Section
}


Css("src/styles.css")
registerRoute("/", Home)

init()

```

## 2. How to use components

You can create custom components by creating a function which returns variable of `CustomComponent` type. Framework allow you to define any HTML element. To create a main,  `CustomComponent('main',{class: "classname here"}, child components here)`. Example of creating a a reusable component, which has its own state and functions:

```javascript


import {CustomComponent, createState, init,Css, registerRoute, navigate } from "./framework/index.js";

function Home() {
    return CustomComponent('section',{
        class: "main-area"
    }, () => Array.from({ length: 100 }, (_, i) => Item(i)))
}


function Item(index) {
    const randomNumber = createState(0)
    setInterval(() => randomNumber.set(Math.random()), 1000)
    const updateText = () => `Number now: ${randomNumber.get()}`
    const Container = CustomComponent('div',{
        class: "container",
        id: `index-${index}`
    }, updateText)
    randomNumber.subscribe(Container)
    return Container
}


Css("src/styles.css")
registerRoute("/", Home)

init()

```

## 3. How to use states

You can create state with `createState(initialValue)` function which returns a state object `const newState = createState(initialValue)`. In order to access current state value you can use `newState.get()`, to set new state use `newState.set()`. State component needs to be subscribed to the target component with `newState.subscribe(component)`. In order to automatically update component based on state changes, you need to pass the state value as function, to either attributes or children.

How to use state:

```javascript
    function MyComponent() {
        const counterState = createState(0)
        const textComponent = CustomComponent('p',{
            class: "text"
        }, ()=>`Counter is: ${counterState.get()}`, //Pass in function with return value when you need data to change dynamically after updates. You can use it in attributes and children.
            CustomComponent('button',{
                id: "incrementer"
        }, "Increment"))
        counterState.subscribe(textComponent) //Subscribe component to the state updates
        return textComponent
    }
```

## 4. How to navigate

When navigating inside your web app, you have to use `data-link` property for the `<a/>` tags. Example:

```javascript

const link = CustomComponent('a',{
    href: "/",
    "data-link": true
}, "Visit homepage")
```

You can then navigate without reloading the page. Alternatively, you can navigate using `navigate(path)`.

## Author

[Samuel Uzoagba](https://01.kood.tech/git/suzoagba)