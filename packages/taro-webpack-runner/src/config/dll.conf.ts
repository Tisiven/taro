import { emptyObj } from '../util';
import {
  getDefinePlugin,
  getDevtool,
  getDllOutput,
  getDllPlugin,
  getModule,
  getUglifyPlugin,
  processEnvOption
} from '../util/chain';
import { BuildConfig } from '../util/types';
import getBaseChain from './base.conf';

export default function (config: BuildConfig): any {
  const chain = getBaseChain()
  const {
    alias = emptyObj,
    outputRoot = '',
    staticDirectory,
    dllDirectory = 'lib',
    dllFilename = '[name].dll.js',
    dllEntry = {
      lib: ['nervjs', '@tarojs/taro-h5', '@tarojs/router', '@tarojs/components']
    },

    designWidth = 750,
    deviceRatio,
    enableSourceMap = false,
    styleLoaderOption,
    cssLoaderOption,
    lessLoaderOption,
    sassLoaderOption,
    stylusLoaderOption,
    fontUrlLoaderOption,
    imageUrlLoaderOption,
    mediaUrlLoaderOption,

    defineConstants = emptyObj,
    env = emptyObj,

    module = {
      postcss: emptyObj
    },
    plugins
  } = config

  const mode = 'production'

  const minimizer: any[] = []
  if (plugins.uglify && plugins.uglify.enable) {
    minimizer.push(getUglifyPlugin([enableSourceMap, plugins.uglify.config]))
  }

  chain.merge({
    mode,
    devtool: getDevtool(enableSourceMap),
    entry: dllEntry,
    output: getDllOutput({
      outputRoot,
      dllDirectory,
      dllFilename
    }),
    resolve: { alias },
    module: getModule({
      mode,

      staticDirectory,
      designWidth,
      deviceRatio,
      enableExtract: false,
      enableSourceMap,

      styleLoaderOption,
      cssLoaderOption,
      lessLoaderOption,
      sassLoaderOption,
      stylusLoaderOption,
      fontUrlLoaderOption,
      imageUrlLoaderOption,
      mediaUrlLoaderOption,

      module,
      plugins
    }),
    plugin: {
      definePlugin: getDefinePlugin([processEnvOption(env), defineConstants]),
      dllPlugin: getDllPlugin(outputRoot, dllDirectory)
    },
    optimization: { minimizer }
  })
  return chain
}
