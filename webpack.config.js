const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ['@babel/polyfill', './src/js/style.js', './src/css/reset.scss','./src/css/main.scss'],
  // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },
  plugins: [
    // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
    new MiniCssExtractPlugin({ filename: 'css/style.css' })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/js')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader?outputStyle=expanded'
          // 'sass-loader?outputStyle=compressed'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        loader: 'file-loader',
        options: { outputPath: '../images' }
      },
      {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          loader: 'file-loader',
          options: { outputPath: '../fonts' }
      }
    ]
  },
  devtool: 'source-map',
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development'
};