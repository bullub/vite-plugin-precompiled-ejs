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
