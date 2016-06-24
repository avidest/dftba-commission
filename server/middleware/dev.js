import webpack       from 'webpack'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.config'

const [browserConfig, serverConfig] = config

// SERVER SIDE //
const serverCompiler = webpack(serverConfig)
serverCompiler.watch({}, (err, stats)=> {
  if (err) {
    throw err
  }
  if (stats.hasErrors() || stats.hasWarnings()) {
    console.log(stats.toString(errorStats))
  }
  console.log('Compiled server build...')
})


// CLIENT SIDE //
const devCompiler = webpack(browserConfig)
const devOptions = {
  quiet: true,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: browserConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
}

const errorStats = {
  hash: false,
  version: false,
  timings: true,
  assets: true,
  chunks: false,
  chunkModules: false,
  modules: false,
  colors: true
}

export default [
  devMiddleware(devCompiler, devOptions),
  hotMiddleware(devCompiler)
]