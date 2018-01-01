# pluralsight-gulp
You've built your JavaScript application but how do you automate testing, code analysis, running it locally or deploying it? These redundant tasks can consume valuable time and resources. Stop working so hard and take advantage of JavaScript task automation using Gulp to streamline these tasks and give you back more time in the day. Studying this repo can help clarify how Gulp works, jump-start task automation with Gulp, find and resolve issues faster, and be a more productive.

## Requirements

- Install Node
	- on OSX install [home brew](http://brew.sh/) and type `brew install node`
	- on Windows install [chocolatey](https://chocolatey.org/) 
    - Read here for some [tips on Windows](http://jpapa.me/winnode)
    - open command prompt as administrator
        - type `choco install nodejs`
        - type `choco install nodejs.install`
- On OSX you can alleviate the need to run as sudo by [following these instructions](http://jpapa.me/nomoresudo). I highly recommend this step on OSX
- Open terminal
- Type `npm install -g node-inspector bower gulp`

## Quick Start
Prior to taking the course, clone this repo and run the content locally
```bash
$ npm install
$ bower install
$ npm start
```

## Write Gulp Task with TypeScript [OPTIONAL]

## What is TypeScript
* TypeScript is a superset of JavaScript which primarily provides optional static typing, classes and interfaces.
* One of the big benefits is to enable IDEs to provide a richer environment for spotting common errors as you type the code.
  
## Why TypeScript?
* Enable IDEs to provide a richer environment for spotting common errors as you type the code.
* New JavaScript features
* Types checking
* Debugging easier

## How to add TypeScript to Gulp Task?
* Install `typescript` and `ts-node`
```
yarn add --dev typescript ts-node
```
* Add `tool/gulpfile.ts`
* Modify `gulpfile.ts` like below
```js
require('ts-node').register({
  typeCheck: true
});
require('./tool/gulpfile.ts');
```
* Install typed definition for gulp
```
yarn add --dev @types/gulp
```
* Modify `tool/gulpfile.ts`
```ts
import * as gulp from 'gulp';

gulp.task('default', ['hello'], () => {
});

gulp.task('hello', () => {
  console.log('Hello World');
});
```
* In terminal at root of your project, run
```
yarn gulp
```
* You should see Gulp tasks and `Hello World`

## Gulp API
* Gulp only have 4 API
  1. gulp.task - Define a task
  2. gulp.src - Read files
  3. gulp.dest - Write the files
  4. gulp.watch - Watch the files

## Code Analysis with JSHint and JSCS
* Install npm packages locally
```
yarn add --dev yargs gulp-load-plugins gulp-if gulp-print jshint-stylish gulp-util
```
* Aslo install npm packages for typescript
```
yarn add --dev @types/yargs @types/gulp-load-plugins
```
* yarns - read options arguments from the commandline
* gulp-load-plugins - load plugin plugin lazily
* gulp-if - conditional run gulp pipe line
* gulp-print - print files being piped
* gulp-ulti - log and colors to out to console

## CSS Compilation
* gulp-plumber - handle errors gracefully
* gulp.on('error', fn) - handle events in this case error events
* callbacks | Promise - end the stream
* gulp-less - compile less to css
* gulp-autoprefixer - add vendor prefixes

## HTML Injection
* Wiredep and Bower - Inject bower dependencies into HTML
* gulp-inject - Inject custom dependencies into HTML
* HTML Injection
* post install script - Run wiredep after bower install

## Serving Your Dev Build (Server side)
* Simplify dev process - easier to start and code
* nodemon - watch for server files and restart

## Keeping Your Browser in Sync (Client side)
* browser-sync
  1. Inject changes
  2. Ghost mode - Sync browsers behaviour such as clicks, forms, scroll
* Injecting Files - Inject CSS, reload for JavaScript
* Watches - Prepare code for injection

## Build Assests and Keeping Organized
* gulp.src --> gulp.desc - built-in copy, great for creating build folder
* gulp-task-listing - list all task great for default help task
* gulp-imagemin - image compression

## Caching HTML Templates
* Inject HTML templates into js code to reduce HTTP requests

## Creating a Production Build Pipeline
* gulp-useref - gather the assets in the index.html
  1. Parses HTML comments
  2. Similar to gulp-inject
  3. Concatenates by default
  4. Replaces script tags
  5. New optimized files
* gulp-useref API
  1. useref.assets() - gather assets from the HTML comments
  2. useref.restore() - restore the files to the stream
  3. useref() -  concatenate files

## Minifying and Filtering
* gulp-filter - Filter and restore stream
* gulp-csso - Minify CSS
* gulp-uglify - Minify JavaScript

