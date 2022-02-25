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

[**Documentation**](../README.md) > [**Modules**](README.md) > **Emitters**

---

## Explain

**Emitters** are simple [event drivers](https://en.wikipedia.org/wiki/Event-driven_architecture). They are designed to work with **Contexted**, but it's also possible to use them in any project:

```ts
import type { Transformer, Unsubscriber } from '@contexted/core';

class EventEmitter<Test, Request, Response> {
	subscribe(
		test: Test,
		handler: Transformer<Request, Response>
	): Unsubscriber;

	async emit(test: Test, request?: Request): Promise<Response>;
}
```

It also ships with a construction function for functional use:

```ts
import type { EventEmitter } from '@contexted/utils/emitter';

function createEventEmitter<Test, Request, Response>(): EventEmitter<Test, Request, Response>();
```

## Example

First, look at this simple vanilla implementation:

```ts
import { EventEmitter } from '@contexted/utils/emitter';

const emitter = new EventEmitter<string, string, string>();

emitter.subscribe('reverse', (context) => context.split('').reverse().join(''));
emitter.emit('reverse', 'INPUT DATA TO BE REVERSED');
```

This example shows how to use an empty EventEmitter with Contexted:

```ts
import { Contexted } from '@contexted/core';
import { EventEmitter } from '@contexted/utils/emitter';

import { traverser, requestTransformer, responseTransformer } from 'your-code';

const emitter = new EventEmitter<string, string, string>();
const application = new Contexted<string, string, never, string, string, false>(
	{
		subscriber: (test, handler) => emitter.subscribe(test, handler),
		traverser,
		requestTransformer,
		responseTransformer,
	}
);
```

---

< Prev Page
[Traverser](traverser.md)

Next Page >
[Strategy](strategy.md)
