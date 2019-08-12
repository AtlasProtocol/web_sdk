const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var CESURLPlugin = new webpack.DefinePlugin({
    CES_URL: JSON.stringify(process.env.CES_URL || false)
});

module.exports = env => {
    return {
        entry: __dirname + "/src/main.js", //已多次提及的唯一入口文件
        output: {
            path: __dirname + "/build",
            filename: `atp.ads${env.TARGET_ENV}.js`,
            // library:`AtlasAds.${env.TARGET_ENV}`,
            // libraryTarget: 'umd',
        },

        module: {

            rules: [{
                    test: /(\.jsx|\.js)$/,
                    use: {
                        loader: "babel-loader"
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [{
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }, {
                        loader: "postcss-loader"
                    }]
                },{
                    test: require.resolve('mini-zepto'),
                    use: ['exports-loader?window.Zepto','script-loader']

                }
            ],

        },
        plugins: [
            // new HtmlWebpackPlugin({
            //     template: __dirname + "/public/index.html" //new 一个这个插件的实例，并传入相关的参数
            // }),

            CESURLPlugin
        ]
    }
}
