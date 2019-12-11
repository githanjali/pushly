const path = require('path');

module.exports = {
  entry: './src/firebase-listener.js',
  output: {
    filename: 'firebase-listener.js',
    path: path.resolve(__dirname, 'dist')
  }
};