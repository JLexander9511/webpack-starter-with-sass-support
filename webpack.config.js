const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const {mode} = argv;
    const isProduction = mode == 'production';
    return{ 
        entry: './src/index.js',
        output: {
          filename: isProduction ? '[name].[fullhash].js' 
                                 : 'main.js',
          path: path.resolve(__dirname, 'dist'),
          clean: true
        },
        module:{
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ['@babel/preset-env']
                }
              }
          },
          {
            test: /\.(sa|sc|c)ss$/,
            exclude: /styles\.css$/,
            use: [isProduction ? MiniCssExtractPlugin.loader :
                                 'style-loader', 'css-loader', 'sass-loader']
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    esModule: false,
                                    name: 'assets/[name].[ext]'
                                }
                            }
                        ]
                }
          ]
          
        },
        plugins: [
          new HtmlWebpackPlugin({
            title: 'index.html',
            template: 'src/index.html',
          }),
          new MiniCssExtractPlugin({
            filename: isProduction ? '[name].[fullhash].css' 
                                 : 'styles.css',
            ignoreOrder: false
          }),
          new CopyPlugin({
            patterns: [
              { from: "src/assets", to: "assets/" },
            ],
          }),
        ],
        devServer: {
          open:true,
          static: ['src']
        },
        optimization: {
            minimize: isProduction ? true 
            : false,
            minimizer: [
              new CssMinimizerPlugin({}),
            ],
          },
    }
};
