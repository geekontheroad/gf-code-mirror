const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point for your application
  output: {
    filename: 'bundle.js', // Output bundle file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, // Apply this rule to .js and .mjs files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader', // Use Babel loader for transpiling JavaScript
          options: {
            presets: ['@babel/preset-env'], // Use @babel/preset-env for modern JavaScript features
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@codemirror/view': path.resolve(__dirname, 'node_modules/@codemirror/view'),
      '@codemirror/state': path.resolve(__dirname, 'node_modules/@codemirror/state'),
      '@codemirror/language': path.resolve(__dirname, 'node_modules/@codemirror/language'),
      '@codemirror/autocomplete': path.resolve(__dirname, 'node_modules/@codemirror/autocomplete'),
      '@codemirror/lint': path.resolve(__dirname, 'node_modules/@codemirror/lint'),
      '@codemirror/commands': path.resolve(__dirname, 'node_modules/@codemirror/commands'),
    },
  },
  devtool: 'source-map', // Generate source maps for easier debugging
  mode: 'production', // Set mode to production
};