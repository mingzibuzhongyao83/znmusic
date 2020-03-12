let path = require('path');

//导入css分离插件
let MiniCssExtractPlugin=require('mini-css-extract-plugin');

//导入处理HTML插件
let HTML_WEBPACK_PLUGIN = require('html-webpack-plugin');


//创建一个分离css实例
let miniCssExtractPlugin=new MiniCssExtractPlugin({
    //输出css名称

    filename:'[name][hash].css'
})

//创建处理html模板实例

let htmlWebpackPlugin=new HTML_WEBPACK_PLUGIN({
    template:'./index.html',

    inject:true,

    //压缩配置
    minify:{
        //去除注释
        removeComments:true,
        removeAttributeQuotes:true,
        collapseWhitespace:true
    },

    filename:'index.html'
})


module.exports={
    mode:'production',

    entry:{
        index:['./js/index.js']
    },

    output:{
        path:path.resolve(__dirname,'public'),
        filename:'[name][hash].min.js'
    },

    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    {loader:MiniCssExtractPlugin.loader},
                    {loader:'css-loader'}
                ]
            },

            {
                test:/\.(png|gif|jpg|jpeg|webp|ico)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:5120,
                            esModule:false
                        }
                }
                ]
            },

            {
                test:/\.html?$/,
                use:[
                    {loader:'html-withimg-loader'}
                ]
            }
        ],
    
    },

    plugins:[
        miniCssExtractPlugin,
        htmlWebpackPlugin
    ],

    devServer:{
        host:'localhost',
        port:9009
    }
}

