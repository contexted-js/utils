import type { Transformer } from '@contexted/core';

import { Contexted } from '@contexted/core';

import { EventEmitter } from '../src/emitter';
import { createTraverser } from '../src/traverser';

type Injectables = never;
type Context = {
	content: string;
	next: boolean;
};

const transformer: Transformer<Context, Context> = (context) => context;

describe('traverser', () => {
	test('no next flag and mutable context.', async () => {
		const emitter = new EventEmitter<string, Context, Context>();
		const traverser = createTraverser<
			Context,
			Injectables,
			false,
			false
		>();

		const application = new Contexted<
			string,
			Context,
			never,
			Context,
			Context,
			false
		>({
			subscriber: (test, handler) => emitter.subscribe(test, handler),
			traverser,
			requestTransformer: transformer,
			responseTransformer: transformer,
		});

		await application.subscribeRoute({
			test: 'chain',
			controllers: [
				{
					middleware: (context: Context) => {
						context.content = 'null';
						context.next = false;
					},
				},
				{
					middleware: (context: Context) => {
						context.content = context.next.toString();
					},
				},
			],
		});

		expect(
			(await emitter.emit('chain', { content: 'initial', next: true }))
				.content
		).toEqual('false');
	});

	test('with next flag and mutable context.', async () => {
		const emitter = new EventEmitter<string, Context, Context>();
		const traverser = createTraverser<Context, Injectables, false, true>({
			hasNextFlag: true,
		});

		const application = new Contexted<
			string,
			Context,
			never,
			Context,
			Context,
			false
		>({
			subscriber: (test, handler) => emitter.subscribe(test, handler),
			traverser,
			requestTransformer: transformer,
			responseTransformer: transformer,
		});

		await application.subscribeRoute({
			test: 'chain',
			controllers: [
				{
					middleware: (context: Context) => {
						context.content = 'null';
						context.next = false;
					},
				},
				{
					middleware: (context: Context) => {
						context.content = context.next.toString();
					},
				},
			],
		});

		expect(
			(await emitter.emit('chain', { content: 'initial', next: true }))
				.content
		).toEqual('null');
	});

	test('no next flag and immutable context.', async () => {
		const emitter = new EventEmitter<string, Context, Context>();
		const traverser = createTraverser<Context, Injectables, true, false>({
			isImmutable: true,
		});

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

		await application.subscribeRoute({
			test: 'chain',
			controllers: [
				{
					middleware: (context: Context) => {
						context.content = 'null';
						context.next = false;

						return context;
					},
				},
				{
					middleware: (context: Context) => {
						context.content = context.next.toString();

						return context;
					},
				},
			],
		});

		expect(
			(await emitter.emit('chain', { content: 'initial', next: true }))
				.content
		).toEqual('false');
	});

	test('with next flag and immutable context.', async () => {
		const emitter = new EventEmitter<string, Context, Context>();
		const traverser = createTraverser<Context, Injectables, true, true>({
			isImmutable: true,
			hasNextFlag: true,
		});

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

		await application.subscribeRoute({
			test: 'chain',
			controllers: [
				{
					middleware: (context: Context) => {
						context.content = 'null';
						context.next = false;

						return context;
					},
				},
				{
					middleware: (context: Context) => {
						context.content = context.next.toString();

						return context;
					},
				},
			],
		});

		expect(
			(await emitter.emit('chain', { content: 'initial', next: true }))
				.content
		).toEqual('null');
	});
});
