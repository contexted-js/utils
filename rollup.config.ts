import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';

import { resolve } from 'path';
import { readFile, readdir } from 'fs/promises';

async function generateConfiguration(id) {
	const banner = await readFile(resolve(__dirname, 'LICENSE'), 'utf-8');
	return {
		input: `./src/${id}.ts`,
		plugins: [
			typescript(),
			terser({ format: { comments: false } }),
			license({ banner }),
		],
		output: [
			{
				file: `dist/${id}/index.cjs`,
				format: 'cjs',
			},
			{
				file: `dist/${id}/index.mjs`,
				format: 'es',
			},
		],
	};
}

async function readModules() {
	const modules = await readdir(resolve(__dirname, 'src'));
	const configs = [];

	for (const module of modules)
		configs.push(await generateConfiguration(module.replace('.ts', '')));

	return configs;
}

export default readModules();
