## How JavaScript & React Work (For Beginners)

### What is JavaScript?

JavaScript is a programming language that runs in your web browser. It makes websites interactive - things like buttons that respond when clicked, forms that validate input, and content that updates without reloading the page.

### What is React?

React is a JavaScript library (a collection of pre-written code) that helps developers build user interfaces efficiently. Here are the key concepts:

#### Components

Think of components like LEGO blocks. Each component is a self-contained piece of the user interface that can be reused. For example, a button, a table, or an entire page can be a component.

```javascript
function MyButton() {
    return <button>Click Me</button>;
}
```

#### JSX (JavaScript XML)

JSX lets you write HTML-like code inside JavaScript. It looks like HTML but gets converted to JavaScript behind the scenes.

```javascript
// This JSX:
<div className="container">
    <h1>Hello World</h1>
</div>

// Gets converted to JavaScript that creates these elements
```

#### Props (Properties)

Props are how components receive data from their parent components - like passing arguments to a function.

```javascript
// Parent passes data
<GreetingCard name="Alice" />

// Child receives and uses it
function GreetingCard({ name }) {
    return <h1>Hello, {name}!</h1>;
}
```

#### State

State is data that can change over time. When state changes, React automatically updates the display to reflect the new data.

```javascript
const [count, setCount] = useState(0);
// count = the current value
// setCount = function to update the value
```

#### Hooks

Hooks are special functions that let you use React features. Common ones include:

- **useState**: Manages data that changes
- **useEffect**: Runs code when something happens (like page loading)
- **useContext**: Shares data across many components

#### Import/Export

Files share code with each other using import and export:

```javascript
// File A exports a function
export default function MyComponent() { ... }

// File B imports and uses it
import MyComponent from './FileA';
```

---