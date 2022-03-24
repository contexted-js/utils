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

[**Documentation**](../README.md) > [**Modules**](README.md) > **Traverser**

---

## Explain

**Traversers** are explained in [@Contexted/Core Documentations](https://github.com/contexted-js/core/tree/master/docs). This utility package provides a simple, yet effective traverser with **mutability** and **next flag** options:

```ts
import type { Controller, Traverser } from '@contexted/core';

type TraverseGeneratorConfiguration<
	IsImmutable extends boolean,
	HasNextFlag extends boolean
> = {
	isImmutable?: IsImmutable;
	hasNextFlag?: HasNextFlag;
};

function createTraverser<
	Context extends HasNextFlag extends true ? { next: boolean } : any,
	Injectables,
	IsImmutable extends boolean,
	HasNextFlag extends boolean
>(
	configuration?: TraverseGeneratorConfiguration<IsImmutable, HasNextFlag>
): Traverser<Context, Injectables, IsImmutable>;
```

## Example

The ease of creating a new traverser is shown in the following example:

```ts
import { createTraverser } from '@contexted/utils/traverser';

const mutableTraverser = createTraverser<false, false>();

const immutableTraverserWithNextFlag = createTraverser<true, true>({
	isImmutable: true,
	hasNextFlag: true,
});
```

And it is very easy to be used with Contexted:

```ts
import { createTraverser } from '@contexted/utils/traverser';

import { emitter, requestTransformer, responseTransformer } from 'your-code';

const traverser = createTraverser<false, false>();
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
[Transformer](transformer.md)

Next Page >
[Emitters](emitters.md)
