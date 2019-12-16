/// <binding ProjectOpened='Watch - Development' />
"use strict";

var path = require("path");
var WebpackNotifierPlugin = require('webpack-notifier');
const WebpackShellPlugin = require('webpack-shell-plugin');
var webpack = require('webpack');
var _ = require('lodash');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

var mode = process.env.NODE_ENV === 'production'
    ? 'production' : 'development';

var nix = process.env.PLATFORM === 'nix' ? true : false;

console.log(`Running ${mode}. NODE_ENV=${process.env.NODE_ENV}. PLATFORM=${process.env.PLATFORM}`);
//console.log(process.env);
var commonConfig = {
    mode: mode,
    stats: {
        colors: true,
        env: true,
        performance: false,
        entrypoints: false,
        children: false,
        version: false
    },
    module: {
        rules: [
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
            // url-loader translates the file into base64, but should have a limit (performance reasons)
            // file-loader rewrites url to /static/fonts, but fonts have to be manually copied if updated.
            // {
            //     test: /\.(woff|woff2)$/,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 50000,
            //             }
            //         }
            //     ]
            //     //loader: "url?prefix=font/&limit=5000"
            // }, 
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'static/fonts/'
                        }
                    }
                ]
                //loader: "url?prefix=font/&limit=5000"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                            mimetype: 'application/octet-stream'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        // Requires sass-loader@^8.0.0
                        options: {
                          implementation: require('sass'),
                          sassOptions: {
                            fiber: require('fibers'),
                            indentedSyntax: false // optional
                          },
                        },
                      },
                ],
            }, {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        // Requires sass-loader@^8.0.0
                        options: {
                          implementation: require('sass'),
                          sassOptions: {
                            fiber: false,
                            indentedSyntax: true // optional
                          },
                        },
                      },
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                    // other vue-loader options go here
                }
            },
          
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }, {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules[\\/](?!(vuetify)).*/
            
            },
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules[\\/](?!(vuetify)).*/
            }
            // exclude: /node_modules/,
            // options: {
            //     appendTsSuffixTo: [/\.vue$/],
            // }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new WebpackNotifierPlugin({
            alwaysNotify: true
        }),
        new webpack.ProvidePlugin({
            _: 'lodash',
        }),
        new VuetifyLoaderPlugin()
    ],
    performance: {
        //    hints: false
    },
    devtool: '#eval-source-map'
}
 
// if (nix) {
//     if (mode === 'production') {
//        // For release builds their is no .hg folder.
//     } else {
//         commonConfig.plugins.push(new WebpackShellPlugin({
//             onBuildStart:['./writeVersion.sh'],
//             dev: false
//           }))
//     }
// } else {
//     commonConfig.plugins.push(new WebpackShellPlugin({
//         onBuildStart:['writeVersion.cmd'],
//         dev: false
//       }))
// }

console.log('Webpack dirname is ', __dirname)

var vueJsConfig = Object.assign({
    resolve: {
        // To import, use ~alias, for example (scss):
        // @import '~styles/app-theme/colors.scss';
        alias: {
            'vue$': mode === 'production' ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js',
            "vueRouter$": "vue-router/dist/vue-router.js",
            'assets': path.resolve(__dirname, 'assets'),
            'static': path.resolve(__dirname, 'static'),
            'styles': path.resolve(__dirname, 'vueApp/styles'),
            'app': path.resolve(__dirname, 'vueApp')
        },
        extensions: ['*', '.js', '.vue', '.json', '.ts', '.scss'],
        modules: ['node_modules', 'dist']
    },
}, commonConfig);

var main = Object.assign({
        entry: './vueApp/main.ts',
        output: {
            path: path.join(__dirname, "./dist/"),
            filename: "[name].js",
            chunkFilename: './dist/[name].js',
            publicPath: '/'
        },
        externals: {
            //vue: 'Vue',
            vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
 
        }
    },
    vueJsConfig);


module.exports = [main];

if (mode === 'production') {
    console.log("----------------------- RUNNING PRODUCTION ------------------------------");
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}
