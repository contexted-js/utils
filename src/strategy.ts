import type {
	Transformer,
	Controller,
	Route,
	Middleware,
} from '@contexted/core';

export type StrategyController<
	Context,
	Injectables,
	IsImmutable extends boolean
> =
	| Controller<Context, Injectables, IsImmutable>
	| Middleware<Context, Injectables, IsImmutable>;

export type Strategy<
	Test,
	Context,
	Injectables,
	IsImmutable extends boolean
> = {
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

function normalizeControllers<
	Context,
	Injectables,
	IsImmutable extends boolean
>(...controllers: StrategyController<Context, Injectables, IsImmutable>[]) {
	return (controllers || []).map((prospect) =>
		typeof prospect === 'function'
			? {
					middleware: prospect,
					injectables: [],
			  }
			: prospect
	);
}

async function extractRoutesFromStrategy<
	Test,
	Context,
	Injectables,
	IsImmutable extends boolean
>(
	strategy: Strategy<Test, Context, Injectables, IsImmutable>,
	testReducer: Transformer<Test[], Test>,
	parentTest?: Test,
	parentInjectables?: Strategy<
		Test,
		Context,
		Injectables,
		IsImmutable
	>['injectables']
) {
	const test = await testReducer([parentTest, strategy.test]);
	const routes: Route<Test, Context, Injectables, IsImmutable>[] = [];

	if (strategy.controllers && strategy.controllers.length > 0) {
		routes.push({
			test,
			controllers: [
				...normalizeControllers(
					...(parentInjectables?.beforeControllers || [])
				),
				...normalizeControllers(
					...(strategy.injectables?.beforeControllers || [])
				),
				...normalizeControllers(...strategy.controllers),
				...normalizeControllers(
					...(strategy.injectables?.afterControllers || [])
				),
				...normalizeControllers(
					...(parentInjectables?.afterControllers || [])
				),
			],
		});
	}

	const injectables = {
		beforeControllers: [
			...(parentInjectables?.beforeControllers || []),
			...(strategy.injectables?.beforeControllers || []),
		],
		afterControllers: [
			...(parentInjectables?.afterControllers || []),
			...(strategy.injectables?.afterControllers || []),
		],
	};

	for (const child of strategy.children || [])
		routes.push(
			...(await extractRoutesFromStrategy(
				child,
				testReducer,
				test,
				injectables
			))
		);

	return routes;
}

export async function extractRoutes<
	Test,
	Context,
	Injectables,
	IsImmutable extends boolean
>(
	...strategies: {
		strategy: Strategy<Test, Context, Injectables, IsImmutable>;
		testReducer: Transformer<Test[], Test>;
	}[]
) {
	const routes: Route<Test, Context, Injectables, IsImmutable>[] = [];

	for (const prospect of strategies || [])
		routes.push(
			...(await extractRoutesFromStrategy(
				prospect.strategy,
				prospect.testReducer
			))
		);

	return routes;
}
