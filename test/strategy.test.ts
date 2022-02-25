import { extractRoutes } from '../src/strategy';

type Context = { next: boolean };

const middleware = (context: Context) => context;
const controller = middleware;
const expandedController = { middleware, injectables: [] };

test('extract route from simple strategy', async () =>
	expect(
		await extractRoutes({
			strategy: {
				test: 'r',
				children: [
					{ test: 'a1', controllers: [controller] },
					{
						test: 'a2',
						children: [
							{ test: 'b1', controllers: [controller] },
							{ test: 'b2' },
							{ test: 'b3', controllers: [controller] },
						],
					},
					{ test: 'a3', controllers: [controller] },
				],
			},
			testReducer: (tests: string[]) =>
				tests
					.filter((word) => word && word.length && word.length > 0)
					.join(':'),
		})
	).toStrictEqual([
		{ test: 'r:a1', controllers: [expandedController] },
		{ test: 'r:a2:b1', controllers: [expandedController] },
		{ test: 'r:a2:b3', controllers: [expandedController] },
		{ test: 'r:a3', controllers: [expandedController] },
	]));

test('extract route from strategy with injectable controllers', async () =>
	expect(
		await extractRoutes({
			strategy: {
				test: 'r',
				children: [
					{
						test: 'a1',
						controllers: [controller],
					},
					{
						test: 'a2',
						injectables: {
							beforeControllers: [controller],
							afterControllers: [controller, controller],
						},
						children: [
							{ test: 'b1', controllers: [controller] },
							{ test: 'b2' },
							{ test: 'b3', controllers: [controller] },
						],
					},
					{ test: 'a3', controllers: [controller] },
				],
			},
			testReducer: (tests: string[]) =>
				tests
					.filter((word) => word && word.length && word.length > 0)
					.join(':'),
		})
	).toStrictEqual([
		{ test: 'r:a1', controllers: [expandedController] },
		{
			test: 'r:a2:b1',
			controllers: [
				expandedController,
				expandedController,
				expandedController,
				expandedController,
			],
		},
		{
			test: 'r:a2:b3',
			controllers: [
				expandedController,
				expandedController,
				expandedController,
				expandedController,
			],
		},
		{ test: 'r:a3', controllers: [expandedController] },
	]));
