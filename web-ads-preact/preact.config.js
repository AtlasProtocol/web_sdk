// / **
// *改变原始webpack配置的函数。
// *返回promise时支持异步更改。
// *
// * @param  {object}  config - 原始webpack配置。
// * @param  {object}  env - 传递给CLI的选项。
// * @param  {WebpackConfigHelpers}  帮助程序 - 在使用config时使用有用帮助程序的对象。
// * * /
export default function (config, env, helpers) {
    console.log('config' + JSON.stringify(config.output))

    if(config.entry){
        // let entry={
        //     __dirname + "/src/main.js"
        // }
        // config.entry='./index.js';
        // config.entry.main='./index.js';
        // config.entry.a='./index.js';

    }
    console.log('entry' + JSON.stringify(config.entry))
    // if (config.output){
    //     config.output.filename='AtpAds.js'
    //
    // }
    if (env.isProd) {
        // Make async work
        let babel = config.module.loaders.filter(loader => loader.loader === 'babel-loader')[0].options;
        // Blacklist regenerator within env preset:
        babel.presets[0][1].exclude.push('transform-async-to-generator');
        // Add fast-async
        babel.plugins.push([require.resolve('fast-async'), {spec: true}]);
    }
    let uglify = helpers.getPluginsByName(config, 'UglifyJsPlugin')[0];
    if (uglify) {
        uglify.plugin.options.sourceMap = false;
    }


}