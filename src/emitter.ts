import type { Generator, AsyncReturn } from '@contexted/core';

export class EventEmitter<RequestType, ResponseType> {
	private subscribers: {
		[test: string]: Generator<RequestType, ResponseType>;
	};

	constructor() {
		this.subscribers = {};
	}

	subscribe(test: string, handler: Generator<RequestType, ResponseType>) {
		if (this.subscribers[test]) return null;

		let uniqueFlag = true;
		this.subscribers[test] = handler;

		return () => {
			if (!this.subscribers[test] || !uniqueFlag) return false;

			delete this.subscribers[test];
			const success = !this.subscribers[test];

			if (success) uniqueFlag = false;

			return success;
		};
	}

	async emit(test: string, request?: RequestType) {
		return this.subscribers[test]
			? await this.subscribers[test](request)
			: null;
	}
}

export class CustomEventEmitter<TestType, RequestType, ResponseType> {
	private subscribers: {
		test: TestType;
		handler: Generator<RequestType, ResponseType>;
	}[];

	constructor(
		private compare: (
			prospect: TestType,
			target: TestType
		) => AsyncReturn<boolean>
	) {
		this.subscribers = [];
	}

	subscribe(
		test: TestType,
		handler: Generator<RequestType, ResponseType>,
		overwrite = false
	) {
		if (!overwrite)
			for (const subscriber of this.subscribers)
				if (this.compare(subscriber.test, test)) return null;

		const result = { test, handler };
		let uniqueFlag = true;
		this.subscribers.push(result);

		return () => {
			if (this.subscribers.indexOf(result) > -1 && uniqueFlag) {
				this.subscribers.splice(this.subscribers.indexOf(result), 1);
				uniqueFlag = false;
				return true;
			}

			return false;
		};
	}

	async emit(test: TestType, request?: RequestType) {
		for (const subscriber of this.subscribers)
			if (this.compare(subscriber.test, test))
				return await subscriber.handler(request);
		return null;
	}
}
