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

[**Documentation**](../README.md) > [**Modules**](README.md) > **Strategy**

---

## Explain

**Strategies** are complex [route](https://github.com/contexted-js/core/blob/master/docs/concepts/routes.md) objects which support children and injectable middlewares to make **routing** easier in Contexted.

```ts
import type {
	Transformer,
	Controller,
	Route,
	Middleware,
} from '@contexted/core';

type StrategyController<Context, Injectables, IsImmutable extends boolean> =
	| Controller<Context, Injectables, IsImmutable>
	| Middleware<Context, Injectables, IsImmutable>;

type Strategy<Test, Context, Injectables, IsImmutable extends boolean> = {
	test: Test;
	children?: Strategy<Test, Context, Injectables, IsImmutable>[];
	controllers?: StrategyController<Context, Injectables, IsImmutable>[];
	injectables?: {
		beforeControllers?: StrategyController<
			Context,
			Injectables,
			IsImmutable
		>[];
		afterControllers?: StrategyController<
			Context,
			Injectables,
			IsImmutable
		>[];
	};
};

async function extractRoutes<
	Test,
	Context,
	Injectables,
	IsImmutable extends boolean
>(
	...strategies: {
		strategy: Strategy<Test, Context, Injectables, IsImmutable>;
		testReducer: Transformer<Test[], Test>;
	}[]
): Route<Test, Context, Injectables, IsImmutable>;
```

The **testReducer** function is responsible for merging the test cases of a single **route** with its parent **routes**.

To understand how this works, check out the following example:

```ts
const strategy = {
	test: '/parent',
	controllers: [parentController],
	injectables: {
		beforeControllers: [beforeInjectedController],
		afterControllers: [afterInjectedController],
	},
	children: [
		{
			test: '/child',
			controllers: [childController],
		},
	],
};

const testReducer = (tests: string[]) => tests.join('');

const equivalentRoutes = [
	{
		test: '/parent',
		controllers: [
			beforeInjectedController,
			parentController,
			afterInjected,
		],
	},
	{
		test: '/parent/child',
		controllers: [beforeInjectedController, childController, afterInjected],
	},
];
```

## Example

This is way simpler when you start using it:

```ts
import type { Strategy } from '@contexted/utils/strategy';

import type { Test, Context, Injectables, IsImmutable } from 'your-code';

import { extractRoutes } from '@contexted/utils/strategy';

import {
	normalizePath,
	welcomeMiddleware,
	authGuard,
	bodyParser,
	jsonPayloadNormalizer,
	readUser,
	registerUser,
} from 'your-code';

const strategy: Strategy<Test, Context, Injectables, IsImmutable> = {
	test: { path: '/api', method: 'GET' },
	controllers: { welcomeMiddleware },
	injectables: {
		beforeControllers: [authGuard, bodyParser],
		afterControllers: [jsonPayloadNormalizer],
	},
	children: [
		{
			test: { path: '/user', method: 'GET' },
			controllers: [readUser],
		},
		{
			test: { path: '/user', method: 'POST' },
			controllers: [registerUser],
		},
	],
};

const testReducer = (tests: Test[]) => {
	const path = normalizePath(tests.map((test) => test.path).join('/'));

	return {
		path,
		method: tests[tests.length - 1].method,
	};
};

const routes = await extractRoutes({ strategy, testReducer });
```

---

< Prev Page
[Emitters](emitters.md)
