import type { Context } from '@contexted/core';
import { extractRoutes, Strategy } from '../src/strategy';

const middleware = (context: Context) => context;
const controllers = [middleware];
const expandedController = [{ middleware, injectables: [] }];

const strategy: Strategy<string, Context> = {
	test: 'r',
	children: [
		{ test: 'a1', controllers },
		{
			test: 'a2',
			children: [
				{ test: 'b1', controllers },
				{ test: 'b2' },
				{ test: 'b3', controllers },
			],
		},
		{ test: 'a3', controllers },
	],
};

test('extract route from strategy', async () =>
	expect(
		await extractRoutes({
			strategy,
			testReducer: (tests: string[]) =>
				tests
					.filter((word) => word && word.length && word.length > 0)
					.join(':'),
		})
	).toStrictEqual([
		{ test: 'r:a1', controllers: expandedController },
		{ test: 'r:a2:b1', controllers: expandedController },
		{ test: 'r:a2:b3', controllers: expandedController },
		{ test: 'r:a3', controllers: expandedController },
	]));
