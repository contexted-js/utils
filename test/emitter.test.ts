import type { Transformer } from '@contexted/core';

import { Contexted } from '@contexted/core';

import { EventEmitter } from '../src/emitter';
import { createTraverser } from '../src/traverser';

type Injectables = never;
type Context = { content: string };

const transformer: Transformer<Context, Context> = (context) => context;

const traverser = createTraverser<Context, Injectables, true, false>({
	isImmutable: true,
});

describe('emitter', () => {
	const requestContent = { content: 'REQUEST', next: true };

	test('subscribe, unsubscribe and duplicated test cases for map emitter with string test', async () => {
		const emitter = new EventEmitter<string, Context, Context>();
		const application = new Contexted<
			string,
			Context,
			never,
			Context,
			Context,
			true
		>({
			subscriber: (test, handler) => emitter.subscribe(test, handler),
			traverser,
			requestTransformer: transformer,
			responseTransformer: transformer,
		});

		const unsubscriber = await application.subscribeRoute({
			test: 'print',
			controllers: [{ middleware: (request: Context) => request }],
		});

		expect(await emitter.emit('print', requestContent)).toStrictEqual(
			requestContent
		);

		await expect(
			application.subscribeRoute({
				test: 'print',
				controllers: [{ middleware: (request: Context) => request }],
			})
		).rejects.toThrow();

		await unsubscriber();
		await expect(emitter.emit('print', requestContent)).rejects.toThrow();
	});

	test('subscribe, unsubscribe and duplicated test cases for map emitter with custom test', async () => {
		type Test = { label: string };

		const key: Test = { label: 'CUSTOM-KEY' };

		const emitter = new EventEmitter<Test, Context, Context>();
		const application = new Contexted<
			Test,
			Context,
			never,
			Context,
			Context,
			true
		>({
			subscriber: (test, handler) => emitter.subscribe(test, handler),
			traverser,
			requestTransformer: transformer,
			responseTransformer: transformer,
		});

		const unsubscriber = await application.subscribeRoute({
			test: key,
			controllers: [{ middleware: (request: Context) => request }],
		});

		expect(await emitter.emit(key, requestContent)).toStrictEqual(
			requestContent
		);

		await expect(
			application.subscribeRoute({
				test: key,
				controllers: [{ middleware: (request: Context) => request }],
			})
		).rejects.toThrow();

		await unsubscriber();
		await expect(emitter.emit(key, requestContent)).rejects.toThrow();
	});
});
