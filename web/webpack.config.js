//使用插件html-webpack-plugin打包合并html
//使用插件extract-text-webpack-plugin打包独立的css
//使用UglifyJsPlugin压缩代码
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取出来css
const CleanWebpackPlugin = require('clean-webpack-plugin');

// var ExtractTextPlugin = require ('extract-text-webpack-plugin');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/atlasp.js',
    },
    output: {
        filename: 'atp.js',
        path: __dirname + '/dist',
    },
    devServer: {
        contentBase: __dirname + '/dist',//静态文件根目录
        host: 'localhost',//配置主机
        port: 8080,//主机名
        compress: true//服务器返回给浏览器是否使用gzip压缩
    },
    externals: {//react已单独引入，所以不将react打包进去目标文件
        "react": 'React',
        'react-dom': 'ReactDOM'
    },
    module: {
        rules: [
            {
                test: /\.css/,
                exclude: /node_modules/, // 取消匹配node_modules里面的文件
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                exclude: /node_modules/, // 取消匹配node_modules里面的文件
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            // {
            //     test: /\.html$/,
            //     loader: 'html-withimg-loader'
            // },
            {
                test: /\.(png|jpg|gif|svg|bmp|eot|woff|woff2|ttf)$/,
                loader: {
                    loader: 'url-loader',
                    options: {
                        limit: 8 * 1024,// 图片大小 > limit 使用file-loader, 反之使用url-loader
                        name: 'img/[name].[ext]'
                    }
                }
            },
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                exclude: /node_modules/

            },
            {
                test: require.resolve('jquery'),// 注意 这里是require的resolve 方法
                use: {
                    loader: "expose-loader",
                    options: "$"
                }
            }
        ],
    },

    resolve:
        {
            extensions: ['.js', '.css', '.json'], //用于配置程序可以自行补全哪些文件后缀
        }
    ,

    plugins: [

        new HtmlWebpackPlugin({
            template: './index.html',//根据自己的指定的模板文件来生成特定的 html 文件。这里的模板类型可以是任意你喜欢的模板，可以是 html, jade, ejs, hbs, 等等，但是要注意的是，使用自定义的模板文件时，需要提前安装对应的 loader， 否则webpack不能正确解析
            filename: 'index.html',// 默认情况下生成的 html 文件叫 index.html
            minify: {
                collapseWhitespace: true, //把生成的 index.html 文件的内容的没用空格去掉，减少空间
            },
            hash: true, //为了更好的 cache，可以在文件名后加个 hash。
        }),

        // 把css从bundle.js中分离出来
        new MiniCssExtractPlugin({
            filename: "atp-vote.css",
        }),
        new webpack.ProvidePlugin({
            _: 'lodash',
        }),
        // new CleanWebpackPlugin(['dist']),
        // webpack -p模式会自动minify
        // new UglifyJsPlugin (),
        // new UglifyJsPlugin ({
        //   compress: {
        //     //压缩代码
        //     dead_code: true, //移除没被引用的代码
        //     warnings: false, //当删除没有用处的代码时，显示警告
        //     loops: true, //当do、while 、 for循环的判断条件可以确定是，对其进行优化
        //   },
        //   except: ['$super', '$', 'exports', 'require'], //混淆,并排除关键字
        // }
        // ),

    ],
}
;
