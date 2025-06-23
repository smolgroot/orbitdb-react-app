const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for Node.js modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util"),
        "events": require.resolve("events"),
        "crypto": require.resolve("crypto-browserify"),
        "path": require.resolve("path-browserify"),
        "fs": false,
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "querystring": require.resolve("querystring-es3"),
        "net": false,
        "tls": false,
        "child_process": false
      };

      // Add plugins to provide global variables
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
          'global': 'globalThis',
        })
      ];

      // Ensure proper module resolution
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'stream': 'stream-browserify',
        'crypto': 'crypto-browserify',
        'buffer': 'buffer'
      };

      return webpackConfig;
    },
  },
};
