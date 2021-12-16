import type { Context as ContextedContext } from '@contexted/core';

import { Contexted } from '@contexted/core';
import { EventEmitter, CustomEventEmitter } from '../src/emitter';

type Test = { content: string };
type Context = ContextedContext & { content: string };

test('subscribe and unsubscribe for string event emitter', async () => {
	const requestContent = { content: 'REQUEST', next: true };

	const emitter = new EventEmitter<Context, Context>();
	const application = new Contexted<string, Context>({
		subscriber: (test, handler) => emitter.subscribe(test, handler),
	});

	const unsubscriber = await application.subscribeRoute({
		test: 'print',
		controllers: [{ middleware: (request: Context) => request }],
	});

	expect(await emitter.emit('print', requestContent)).toStrictEqual(
		requestContent
	);

	await unsubscriber();
	expect(await emitter.emit('print', requestContent)).toBeNull();
});

test('subscribe and unsubscribe for custom event emitter', async () => {
	const requestContent = { content: 'REQUEST', next: true };

	const emitter = new CustomEventEmitter<Test, Context, Context>(
		(prospect: Test, target: Test) => prospect.content === target.content
	);
	const application = new Contexted<Test, Context>({
		subscriber: (test, handler) => emitter.subscribe(test, handler),
	});

	const unsubscriber = await application.subscribeRoute({
		test: { content: 'print' },
		controllers: [{ middleware: (request: Context) => request }],
	});

	expect(await emitter.emit({ content: 'print' }, requestContent)).toStrictEqual(
		requestContent
	);

	await unsubscriber();
	expect(await emitter.emit({ content: 'print' }, requestContent)).toBeNull();
});
