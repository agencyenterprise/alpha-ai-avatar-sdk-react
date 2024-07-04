import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default [
  {
    input: {
      index: 'src/index.ts',
      'plugins/stt/azure/index': 'src/plugins/stt/azure/index.ts',
      'plugins/stt/deepgram/index': 'src/plugins/stt/deepgram/index.ts',
    },
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].js',
      },
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js',
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: [
          '**/*.test.tsx',
          '**/*.test.ts',
          '**/*.stories.ts',
          'examples/**',
        ],
      }),
      copy({
        targets: [
          { src: 'README.md', dest: 'dist' },
          { src: 'package.json', dest: 'dist' },
        ],
      }),
      del({ targets: 'dist/*' }),
    ],
    onwarn: (warning, next) => {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      if (warning.code === 'PLUGIN_WARNING') return;

      next(warning);
    },
  },
];
