import webpack       from 'webpack'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.config'

// SERVER SIDE //
// const serverConfig = buildConfig('server', 'development')
// const serverCompiler = webpack(serverConfig)
// serverCompiler.watch({}, (err, stats)=> {
//   if (err) {
//     throw err
//   }
//   if (stats.hasErrors() || stats.hasWarnings()) {
//     console.log(stats.toString(errorStats))
//   }
//   console.log('Compiled server build...')
// })


// CLIENT SIDE //
const devCompiler = webpack(config)
const devOptions = {
  quiet: true,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
}

const errorStats = {
  hash: false,
  version: false,
  timings: false,
  assets: false,
  chunks: false,
  chunkModules: false,
  modules: false,
  colors: true
}

export default [
  devMiddleware(devCompiler, devOptions),
  hotMiddleware(devCompiler)
]