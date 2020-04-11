const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => {

	const { mode = 'development' } = env;

	const developmentMode = mode === 'development';
	const productionMode = mode === 'production';

	const getStyleLoader = () => {
		return [
			productionMode ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'
		];
	};

	const getPlugins = () => {
		const plugins = [
			new HtmlWebpackPlugin({
				title: "car-rent",
				template: "public/index.html",
				favicon: "public/favicon.ico",
			}),
			new CopyPlugin([
				{
					from: './src/img/*',
					to: './images/[name].[ext]',
					toType: 'template',
				},
			]),
		];

		if (productionMode) {
			plugins.push(new MiniCssExtractPlugin({
					filename: 'main-[hash:8].css'
				})
			);
		}

		return plugins;
	};

	return {
		mode: productionMode ? 'production' : developmentMode && 'development',
		output: {
			filename: productionMode ? 'main-[hash:8].js' : undefined
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: 'babel-loader'
				},
				{
					test: /\.(png|jpg|jepg|gif|ico)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								outputPath: 'images',
								name: '[name].[ext]'
								// name: '[name]-[sha1:hash:7].[ext]'
							}
						}
					]
				},
				{
					test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								outputPath: 'fonts/',
								name: '[name].[ext]'
							}
						}
					]
				},
				{
					test: /\.(s[ca]ss)$/,
					use: [...getStyleLoader(), "postcss-loader", 'sass-loader']
				}
			]
		},
		plugins: getPlugins(),
		devServer: {
			open: true,
		}
	};
};
