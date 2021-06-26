# vite-plugin-precompiled-ejs
A vite plugin that implements pre-compiled ejs templates. And you can use some ES6+ syntax in ejs templates.

## Install

```bash
npm i vite-plugin-precompiled-ejs -D
```

## Usage

> vite.config.ts

```ts
import { defineConfig } from 'vite';
import precompiledEjs from 'vite-plugin-precompiled-ejs';


export default defineConfig({
  ...
  plugins: [
    precompiledEjs()
  ],
  ...
});
```

> some.ejs

```ejs
<div>
  <% const { a, b, c } = locals; %>
  <%- a + b + c %>
</div>
```

Then you can use this.  

> `some.js`

```ts
import some from './some.ejs'

// result to be 
// <div>
//   6
// </div>
const result = some({ a: 1, b: 2, c: 3});
```