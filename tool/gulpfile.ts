import ReadWriteStream = NodeJS.ReadWriteStream;

import * as gulp from 'gulp';
import * as yargs from 'yargs';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { config } from './gulp.config';

const args = yargs.argv;
const $ = gulpLoadPlugins({ lazy: true }) as any;

gulp.task('default', ['hello'], () => {
});

gulp.task('vet', () => {
  log('Analyzing source with JSHint and JSCS');

  return gulp.src(config.alljs)
    .pipe<ReadWriteStream>($.if(args.verbose, $.print()))
    .pipe<ReadWriteStream>($.jscs())
    .pipe<ReadWriteStream>($.jshint())
    .pipe<ReadWriteStream>($.jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe<ReadWriteStream>($.jshint.reporter('fail'));
});

gulp.task('hello', () => {
  console.log('Hello World');
});

/////////////
interface Message {
  [key: string]: any;
}

function log(msg: Message | string) {
  if (typeof msg === 'object') {
    for (const item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}
