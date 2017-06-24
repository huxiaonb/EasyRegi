import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'


const config = {
    watch: process.env.NODE_ENV !== 'production',
    entry: {
        'maintain/index' : './maintain/src/index.js',
        'mobile/index' : './mobile/src/entry.js'
    },
    output: {
        path: path.join(__dirname,  'public/dist'),
        publicPath : 'public/',
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    resolve: {
        modulesDirectories: ['node_modules', path.join(__dirname, './node_modules')],
        extensions: ['', '.web.js', '.js', '.json']
    },
    // devtool: "eval",
    module: {
        loaders: [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel',
        }, {
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
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'import', 'export']
            },
            compress: {
                warnings: false
            }
        }))
}



export default config