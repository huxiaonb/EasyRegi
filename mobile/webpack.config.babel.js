const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const isPro = process.env.NODE_ENV === "production"


const config = {
  

  entry: { "index": path.resolve(__dirname, './src/entry') },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join(__dirname, '../public/dist/mobile/'),
    publicPath: '/dist/',
    libraryTarget: 'umd'
  },

  resolve: {
    modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: ['', '.web.js', '.jsx', '.js', '.json'],
  },

  module: {
    noParse: [/moment.js/],
    loaders: [
      {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel',
        query: {
          plugins: [
            ["transform-runtime"],
            ["import", { "style": "css", "libraryName": "antd-mobile" }]
          ],
          
          presets:["react", "es2015", "latest", "stage-0"]
        }
      },
      { test: /\.(jpg|png)$/, loader: "url?limit=8192" },
      // svg-sprite for antd-mobile@1.0
      { test: /\.(svg)$/i, loader: 'svg-sprite-loader', include: [
        require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
        // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 自己私人的 svg 存放目录
      ]},
      // { test: /\.css$/, loader: 'style!css' }, // 把css处理成内联style，动态插入到页面
      { test: /\.less$/i, loader: ExtractTextPlugin.extract('style', 'css!less') },
      { test: /\.css$/i, loader: ExtractTextPlugin.extract('style', 'css') }
    ]
  },
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
    }),
    pxtorem({ rootValue: 100, propWhiteList: [] })
  ],
  
 
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //         mangle: {
    //             except: ['$super', '$', 'exports', 'require', 'import', 'export']
    //         },
    //         compress: {
    //             warnings: false
    //         }
    //     }),
    // new webpack.optimize.CommonsChunkPlugin('shared.js'),
    // new webpack.optimize.CommonsChunkPlugin({
    //   // minChunks: 2,
    //   name: 'shared',
    //   filename: 'shared.js'
    // }),
    new ExtractTextPlugin('[name].css', { allChunks: true }),
  ],
  
}
  if(isPro){
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'import', 'export']
            },
            compress: {
                warnings: false
            }
        }))
  }
  export default config;
