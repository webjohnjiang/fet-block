import terser from '@rollup/plugin-terser'
import fs from 'node:fs'
import jsonPlugin from '@rollup/plugin-json'
import replacePlugin from '@rollup/plugin-replace'
import babelPlugin from '@rollup/plugin-babel'
import copyPlugin from 'rollup-plugin-copy'

console.log('hello', process.env.NODE_ENV)

const outputDir = process.env.NODE_ENV === 'dev' ? 'examples/dist' : 'dist'
const pkg = JSON.parse(fs.readFileSync('./package.json'))
const pkgVersion = pkg.version

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${pkg.author}
 * Released under the ${pkg.license} License.
 */
`;

const outputBasicItemConfig = {
  banner,
  dir: outputDir,
  entryFileNames: `[name]@${pkgVersion}.[format].js`,
  exports: 'named',
  // sourcemap: true,
  // globals: {
  //   'vue': 'vue',
  // },
}

const commonOptions = {
  plugins: [
    jsonPlugin(),
    replacePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'pkgVersion': JSON.stringify(pkgVersion),
      preventAssignment: true
    }),
    // 由于fetBlockLogic.js是需要直接被远程拉取执行，无预编译过程，因此需要helpers打包
    babelPlugin({
      babelHelpers: 'bundled'
    })
  ]
}

export default [{
  input: {
    fetBlock: 'src/stub/main.js'
  },
  external: [],
  output: [
    {
      ...outputBasicItemConfig,
      format: 'esm'
    },
    {
      ...outputBasicItemConfig,
      format: 'cjs',
      entryFileNames: `[name]@${pkgVersion}.[format].cjs`,
    },
    {
      ...outputBasicItemConfig,
      format: 'umd',
      name: 'fetBlock',
    },
    {
      ...outputBasicItemConfig,
      format: 'umd',
      name: 'fetBlock',
      entryFileNames: `[name]@${pkgVersion}.[format].min.js`,
      plugins: [terser()]
    }
  ],
  ...commonOptions
}, {
  input: {
    fetBlockLogic: 'src/logic/main.js'
  },
  output: [
    {
      ...outputBasicItemConfig,
      format: 'esm'
    },
    {
      ...outputBasicItemConfig,
      format: 'cjs'
    },
    {
      ...outputBasicItemConfig,
      format: 'umd',
      name: 'fetBlockLogic',
    },
    {
      ...outputBasicItemConfig,
      format: 'umd',
      name: 'fetBlockLogic',
      entryFileNames: `[name]@${pkgVersion}.[format].min.js`,
      plugins: [terser()]
    }
  ],
  ...commonOptions,
  plugins: [
    ...commonOptions.plugins,
    copyPlugin({
      targets: [
        { src: 'src/public/**/*', dest: outputDir }
      ]
    })
  ]
}]