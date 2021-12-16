import type {
	Context,
	Generator,
	Controller,
	Route,
	Middleware,
	AsyncReturn,
} from '@contexted/core';

export type StrategyController<
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext extends boolean = false
> =
	| Controller<ContextType, InjectablesType, ImmutableContext>
	| Middleware<ContextType, InjectablesType, ImmutableContext>;

export type Strategy<
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext extends boolean = false
> = {
	test: TestType;
	children?: Strategy<TestType, ContextType, InjectablesType>[];
	controllers?: StrategyController<
		ContextType,
		InjectablesType,
		ImmutableContext
	>[];
	injectables?: {
		beforeControllers?: StrategyController<
			ContextType,
			InjectablesType,
			ImmutableContext
		>[];
		afterControllers?: StrategyController<
			ContextType,
			InjectablesType,
			ImmutableContext
		>[];
	};
};

function normalizeControllers<
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext extends boolean = false
>(
	...controllers: StrategyController<
		ContextType,
		InjectablesType,
		ImmutableContext
	>[]
) {
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
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext extends boolean = false
>(
	strategy: Strategy<
		TestType,
		ContextType,
		InjectablesType,
		ImmutableContext
	>,
	testReducer: Generator<TestType[], TestType>,
	parentTest?: TestType,
	parentInjectables?: Strategy<
		TestType,
		ContextType,
		InjectablesType,
		ImmutableContext
	>['injectables']
) {
	const test = await testReducer([parentTest, strategy.test]);
	const routes: Route<TestType, ContextType, InjectablesType>[] = [];

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
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext extends boolean = false
>(
	...strategies: {
		strategy: Strategy<
			TestType,
			ContextType,
			InjectablesType,
			ImmutableContext
		>;
		testReducer: Generator<TestType[], TestType>;
	}[]
) {
	const routes: Route<TestType, ContextType, InjectablesType>[] = [];

	for (const prospect of strategies || [])
		routes.push(
			...(await extractRoutesFromStrategy(
				prospect.strategy,
				prospect.testReducer
			))
		);

	return routes;
}
