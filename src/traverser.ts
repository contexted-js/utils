import type { Controller, Traverser } from '@contexted/core';

type TraverseGeneratorConfiguration<
	IsImmutable extends boolean,
	HasNextFlag extends boolean
> = {
	hasNextFlag?: HasNextFlag;
	isImmutable?: IsImmutable;
};

export function createTraverser<
	Context extends HasNextFlag extends true ? { next: boolean } : any,
	Injectables,
	IsImmutable extends boolean,
	HasNextFlag extends boolean
>(
	configuration?: TraverseGeneratorConfiguration<IsImmutable, HasNextFlag>
): Traverser<Context, Injectables, IsImmutable> {
	return async (
		context: Context,
		...controllers: Controller<Context, Injectables, IsImmutable>[]
	) => {
		configuration ||= {};

		for (const controller of controllers) {
			let result = await controller.middleware(
				context,
				...(controller.injectables || [])
			);

			if (configuration.hasNextFlag && context.next === false) break;
			if (configuration.isImmutable) context = result as Context;
		}

		return context;
	};
}
