import globals from 'rollup-plugin-node-globals'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/browser-convert-svg.js',
    output: {
        file: 'dist/browser-convert-svg.umd.js',
        format: 'umd',
        name: 'SvgToPng',
    },
    plugins: [
        globals(),
        babel(),
        terser(),
    ]
}
