import {
	generateEchoTransformer,
	generateWrapperTransformer,
	generateExtractTransformer,
} from '../src/transformer';

type Request = { url: string };
type Response = { status: number };

type Context = {
	request: Request;
	response: Response;
	next: boolean;
};

const echo = generateEchoTransformer<Request>();

const extend = generateWrapperTransformer<Request, Context>(
	{
		response: { status: 404 },
		next: true,
	},
	'request'
);

const extract = generateExtractTransformer<Context, Response>('response');

const request: Request = { url: 'hello' };

test('transformers', async () => {
	const context = await extend(request);

	expect(context).toStrictEqual({
		request,
		response: { status: 404 },
		next: true,
	});

	const response = await extract(context);

	expect(response).toStrictEqual({ status: 404 });
});
