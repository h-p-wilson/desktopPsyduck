const path = require("path");

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
	},
];
