import type { Transformer } from '@contexted/core';

export class EventEmitter<Test, Request, Response> {
	private subscribers: Map<Test, Transformer<Request, Response>>;

	constructor() {
		this.subscribers = new Map();
	}

	subscribe(test: Test, handler: Transformer<Request, Response>) {
		try {
			if (this.subscribers.has(test))
				throw new Error(
					'a handler has already been registered for this test inside event emitter map.'
				);

			this.subscribers.set(test, handler);

			return () => {
				try {
					const result = this.subscribers.delete(test);
					if (!result)
						throw new Error(
							'failed to delete element from event emitter map.'
						);
				} catch (error) {
					throw error;
				}
			};
		} catch (error) {
			throw error;
		}
	}

	async emit(test: Test, request?: Request) {
		if (!this.subscribers.has(test))
			throw new Error(
				'no subscriber with matching test registered in event emitter.'
			);

		return await this.subscribers.get(test)(request);
	}
}

export function createEventEmitter<Test, Request, Response>() {
	return new EventEmitter<Test, Request, Response>();
}
