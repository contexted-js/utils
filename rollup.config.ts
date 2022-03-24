import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import licensePlugin from 'rollup-plugin-license';

import { resolve } from 'path';
import { readFile, readdir } from 'fs/promises';

const generateConfiguration = (id = '', module = 'iife', license = null) => ({
	input: `./src/${id}.ts`,
	plugins: [typescript({ target: module === 'mjs' ? 'ES6' : 'ES3' })].concat(
		module === 'iife'
			? [terser({ format: { comments: false } })]
			: [licensePlugin({ banner: license })]
	),
	output: [
		{
			file: `dist/${id}/index.${module === 'iife' ? 'js' : module}`,
			format: module === 'mjs' ? 'es' : module,
			name: module === 'iife' && `window.ContextedUtils.${id}`,
			extend: module === 'iife',
		},
	],
});

export default async () => {
	const license = await readFile(resolve(__dirname, 'LICENSE'), 'utf-8');
	const modules = (await readdir(resolve(__dirname, 'src'))).map((module) =>
		module.replace('.ts', '')
	);

	const configurations = modules
		.map((id) => [
			generateConfiguration(id, 'cjs', license),
			generateConfiguration(id, 'mjs', license),
			generateConfiguration(id),
		])
		.flat();

	return configurations;
};
