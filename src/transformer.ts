import { Transformer } from '@contexted/core';

export function generateEchoTransformer<InputType>(): Transformer<
	InputType,
	InputType
> {
	return (input: InputType) => input;
}

export function generateWrapperTransformer<InputType, OutputType>(
	wrapObject: Partial<OutputType>,
	label: string
): Transformer<InputType, OutputType> {
	return (input: InputType) => {
		if (!wrapObject || typeof wrapObject !== 'object') wrapObject = {};

		const output = { ...wrapObject };

		(output as any)[label] = input;

		return output as OutputType;
	};
}

export function generateExtractTransformer<InputType, OutputType>(
	label: string
): Transformer<InputType, OutputType> {
	return (input: InputType) =>
		!input || !(input as any)[label]
			? null
			: ((input as any)[label] as OutputType);
}
