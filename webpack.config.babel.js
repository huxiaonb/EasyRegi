import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'
const pxtorem = require('postcss-pxtorem');

const config = {
    // devtool: process.env.NODE_ENV !== 'production' ? 'eval' : false,
    watch: process.env.NODE_ENV !== 'production',
    entry: {
        'maintain/index' : './maintain/src/index.js',
    },
    output: {
        path: path.resolve(__dirname,  'public/dist'),
        publicPath : '../',
        filename: '[name].js',
    },
    resolve: {
        modulesDirectories: ['node_modules', path.join(__dirname, './node_modules')],
        extensions: ['', '.web.js', '.js', '.json']
    },
    // devtool: "eval",
    module: {
        loaders: [
        {
            test: /\.jsx$/, exclude: /node_modules/, loader: 'babel',
            query: {
            plugins: [
                ["transform-runtime", { polyfill: false }],
                ["import", [{ "style": "css", "libraryName": "antd-mobile" }]]
            ],
            presets: ['es2015', 'stage-0', 'react']
            }
        },
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel',
        }, 
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
        {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        },
        {
            test: /\.(woff|ttf|eot|svg|woff2)(\?[^]{0,100})?$/,
            loader: 'base64-font-loader'
        },
        {
            test: /\.(jpe?g|png|gif)$/i, loaders: [ 'url-loader?limit=10000', 'img-loader?minimize' ] 
        },
        ]
    },
    postcss: [
        autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
        }),
        pxtorem({ rootValue: 100, propWhiteList: [] })
    ],
    
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.NoErrorsPlugin()
    ],
    
}
if(process.env.NODE_ENV === 'production'){    
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'import', 'export']
            },
            compress: {
                warnings: false
            }
        }))
}

// config.postcss.push(pxtorem({
//     rootValue: 100,
//     propWhiteList: [],
//   }));

export default config