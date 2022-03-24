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

[**Documentation**](../README.md) > [**Modules**](README.md) > **Transformer**

---

## Explain

**Transformers** are explained in [@Contexted/Core Documentations](https://github.com/contexted-js/core/tree/master/docs). This utility package provides three efficient transformers for different cases:

```ts
import type { Transformer } from '@contexted/core';

export function generateEchoTransformer<InputType>(): Transformer<
	InputType,
	InputType
>;

export function generateWrapperTransformer<InputType, OutputType>(
	wrapObject: Partial<OutputType>,
	label: string
): Transformer<InputType, OutputType>;

export function generateExtractTransformer<InputType, OutputType>(
	label: string
): Transformer<InputType, OutputType>;
```

Three types of transformers are available:

-   **Echo transformer**: Simply casts input to the output.
-   **Wrapper transformer**: Wraps your input object inside a given object.
-   **Extract Transformer**: Extracts given id from input object.

## Example

A simple echo transformer, which can be used when you **request** and **context**, or your **context** and **response** have a same type:

```ts
import type { InputType } from 'your-code';

import { generateEchoTransformer } from '@contexted/utils/transformer';

import { emitter, traverser } from 'your-code';

const echoTransformer = generateEchoTransformer<InputType>();
const application = new Contexted<string, string, never, string, string, false>(
	{
		subscriber: (test, handler) => emitter.subscribe(test, handler),
		traverser,
		requestTransformer: echoTransformer,
		responseTransformer: echoTransformer,
	}
);
```

Example of using wrapper and extract transformers in a HTTP application:

```ts
import {
	generateWrapperTransformer,
	generateExtractTransformer,
} from '@contexted/utils/transformer';

import { emitter, traverser } from 'your-code';

type Request = {
	readonly url: string;
	readonly method: string;
	readonly body?: Buffer;
};

type Response = {
	status: number;
	mime?: string;
	body?: any;
};

type Context = {
	readonly request: Request;
	response: Response;
	next: boolean;
};

const requestTransformer = generateWrapperTransformer(
	{
		response: { status: 404 },
		next: true,
	},
	'request'
);

const responseTransformer = generateExtractTransformer('response');

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
[Modules](README.md)

Next Page >
[Traverser](traverser.md)
