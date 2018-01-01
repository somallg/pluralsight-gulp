import bowerJson from '../bower.json';

const server = './src/server';
const client = './src/client';
const clientApp = `${client}/app`;
const build = './build';
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
  build: './build',
  index: `${client}/index.html`,
  js: [
    `${clientApp}/**/*.module.js`,
    `${clientApp}/**/*.js`,
    `!${clientApp}/**/*.spec.js`
  ],
  css: `${tmp}/styles.css`,
  fonts: './bower_components/font-awesome/fonts/**/*.*',
  html: `${clientApp}/**/*.html`,
  htmlTemplates: `${clientApp}/**/*.html`,
  images: `${client}/images/**/*.*`,
  less: `${client}/styles/styles.less`,
  source: 'src',

  /**
   * Template cache
   */
  templateCache: {
    file: 'template.js',
    options: {
      module: 'app.core',
      standAlone: false,
      root: 'app/'
    }
  },

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
