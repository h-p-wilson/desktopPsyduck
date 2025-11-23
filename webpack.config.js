const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
	// Main process configuration
	{
		mode: "development",
		target: "electron-main",
		entry: "./src/main.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "main.js",
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		devtool: "source-map",
	},
	// Preload script configuration
	{
		mode: "development",
		target: "electron-preload",
		entry: "./src/preload.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "preload.js",
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		devtool: "source-map",
	},
	// Renderer process configuration
	{
		mode: "development",
		target: "electron-renderer",
		entry: "./src/renderer/renderer.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "renderer.js",
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		devtool: "source-map",
		plugins: [
			new CopyPlugin({
				patterns: [
					{ from: "src/renderer/index.html", to: "index.html" },
					{ from: "src/assets", to: "assets" },
				],
			}),
		],
	},
];