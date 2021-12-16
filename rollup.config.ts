import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';

import { resolve } from 'path';
import { readFile } from 'fs/promises';

async function generateConfiguration() {
	const banner = await readFile(resolve(__dirname, 'LICENSE'), 'utf-8');
	return {
		input: './src/index.ts',
		plugins: [
			typescript(),
			terser({ format: { comments: false } }),
			license({ banner }),
		],
		output: [
			{
				file: 'dist/index.cjs',
				format: 'cjs',
			},
			{
				file: 'dist/index.mjs',
				format: 'es',
			},
		],
	};
}

export default generateConfiguration();
