import bowerJson from '../bower.json';

const server = './src/server';
const client = './src/client';
const clientApp = `${client}/app`;
const tmp = './tmp';

export const config = {
  server,
  client,
  tmp,
  /**
   * Files path
   */
  // all js to vet
  alljs: [
    './src/**/*.js',
    './*.js'
  ],
  index: `${client}/index.html`,
  js: [
    `${clientApp}/**/*.module.js`,
    `${clientApp}/**/*.js`,
    `!${clientApp}/**/*.spec.js`
  ],
  css: `${tmp}/styles.css`,
  less: `${client}/styles/styles.less`,
  source: 'src',

  /**
   * Bower and Npm locations
   */
  wiredepDefaultOptions: {
    bowerJson,
    directory: './bower_components/',
    ignorePath: '../..'
  },

  /**
   * Node settings
   */
  defaultPort: 7203,
  nodeServer: './src/server/app.js',

  browserReloadDelay: 1000
};
