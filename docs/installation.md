<div align="center">
    <img alt="Contexted Logo" width="64" src="https://raw.githubusercontent.com/contexted-js/brand/master/dark/main-fill.svg">
    <h1>
		<a href="https://github.com/contexted-js/utils">
        	@Contexted/Utils
    	</a>
		<span>Documentations</span>
	</h1>
</div>

<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/contexted-js/utils">

---

[**Documentation**](README.md) > **Installation**

---

## Distributions

Contexted utils is released in three different versions: [CJS](https://nodejs.org/docs/latest/api/modules.html#modules-commonjs-modules) (ES3), [MJS](https://nodejs.org/docs/latest/api/modules.html#the-mjs-extension) (ES6), and [IIFE](https://developer.mozilla.org/en-US/docs/Glossary) (ES3).

You can use CJS and MJS versions with [NodeJS](#nodejs) or with code bundlers and IIFE version with [Browsers](#browsers).

Contexted is written in [TypeScript](https://www.typescriptlang.org/), so it ships with a declaration file as well.

## NodeJS

### Prerequisites

To use Contexted utils in [NodeJS](https://nodejs.org/) applications or with code bundlers, you have to install the latest version of **NodeJS** first. You can download the latest version from the following link:

[NodeJS Downloads](https://nodejs.org/en/download/)

To confirm that you have **NodeJS** and **NPM** installed on your machine, run the following commands inside a command line:

```sh
node -v
npm -v
```

### Installation

`@contexted/utils` package is accessible via NPM:

```sh
npm i --save @contexted/utils
```

### Usage

CommonJS:

```js
const {
	generateEchoTransformer,
	generateWrapperTransformer,
	generateExtractTransformer,
} = require('@contexted/utils/transformer');

const { createTraverser } = require('@contexted/utils/traverser');

const {
	EventEmitter,
	createEventEmitter,
} = require('@contexted/utils/emitter');

const { extractRoutes } = require('@contexted/utils/strategy');
```

MJS:

```js
import {
	generateEchoTransformer,
	generateWrapperTransformer,
	generateExtractTransformer,
} from '@contexted/utils/transformer';

import { createTraverser } from '@contexted/utils/traverser';

import { EventEmitter, createEventEmitter } from '@contexted/utils/emitter';

import { extractRoutes } from '@contexted/utils/strategy';
```

## Browsers

### Installation

`@contexted/utils` package is available on [unpkg CDN](https://unpkg.com/@contexted/core) for in-browser implementations:

```html
<script src="unpkg.com/@contexted/utils/dist/transformer"></script>
<script src="unpkg.com/@contexted/utils/dist/traverser"></script>
<script src="unpkg.com/@contexted/utils/dist/emitter"></script>
<script src="unpkg.com/@contexted/utils/dist/strategy"></script>
```

### Usage

After loading the script, exported objects will append to the [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object:

```html
<script>
	!!ContextedUtils.transformer.generateEchoTransformer; // is true
	!!ContextedUtils.transformer.generateWrapperTransformer; // is true
	!!ContextedUtils.transformer.generateExtractTransformer; // is true

	!!ContextedUtils.traverser.createTraverser; // is true

	!!ContextedUtils.emitter.EventEmitter; // is true
	!!ContextedUtils.emitter.createEventEmitter; // is true

	!!ContextedUtils.strategy.extractRoutes; // is true
</script>
```

---

< Prev Page
[Documentations](README.md)

Next Page >
[Modules](modules/README.md)
