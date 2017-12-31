import ReadWriteStream = NodeJS.ReadWriteStream;
import * as gulp from 'gulp';
import * as yargs from 'yargs';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as del from 'del';
import * as wiredep from 'wiredep';
import * as browserSync from 'browser-sync';

import { config } from './gulp.config';
import { GulpLoadPlugins, Message } from './interface';

const args = yargs.argv;
const $ = gulpLoadPlugins({ lazy: true }) as GulpLoadPlugins;
const port = process.env.PORT || config.defaultPort;

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

gulp.task('styles', ['clean-styles'], () => {
  log('Compiling Less --> css');

  return gulp.src(config.less)
    .pipe<ReadWriteStream>($.plumber())
    .pipe<ReadWriteStream>($.less())
    .pipe<ReadWriteStream>($.autoprefixer({
      browsers: ['last 2 version', '> 5%']
    }))
    .pipe<ReadWriteStream>(gulp.dest(config.tmp));
});

gulp.task('clean-styles', () => {
  clean(config.tmp + '/**/*.css');
});

gulp.task('less-watcher', () => {
  gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', () => {
  log('Wire up the bower css js and our app js into the html');

  return gulp.src(config.index)
    .pipe<ReadWriteStream>(wiredep.stream(config.wiredepDefaultOptions))
    .pipe<ReadWriteStream>($.inject(gulp.src(config.js)))
    .pipe<ReadWriteStream>(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'],  () => {
  log('Wire up the app css into the html, after call wiredep');

  return gulp.src(config.index)
    .pipe<ReadWriteStream>($.inject(gulp.src(config.css)))
    .pipe<ReadWriteStream>(gulp.dest(config.client));
});

gulp.task('serve-dev', ['inject'], () => {
  const isDev = true;
  const nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      PORT: port,
      NODE_ENV: isDev ? 'dev' : 'build'
    },
    watch: [config.server]
  };

  return $.nodemon(nodeOptions)
    .on('restart', ['vet'], (ev: string) => {
      log('*** nodemon restarted ***');
      log(`files changed ${ev}`);
      setTimeout(
        () => {
          browserSync.notify('reloading now...');
          browserSync.reload({ stream: false });
        },
        config.browserReloadDelay
      );
    })
    .on('start', () => {
      log('*** nodemon started ***');
      startBrowserSync();
    })
    .on('crash', () => {
      log('*** nodemon crashed ***');
    })
    .on('exit', () => {
      log('*** nodemon exit ***');
    });
});

gulp.task('hello', () => {
  console.log('Hello World');
});

/////////////

function changeEvent(event: gulp.WatchEvent) {
  const srcPattern = new RegExp(`/.*(?=/${config.source})/`);
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync(): any {
  if (args.nosync || browserSync.active) {
    return;
  }
  log('Start browser sync');

  gulp.watch([config.less], ['styles'])
    .on('change', changeEvent);

  const options: browserSync.Options = {
    proxy: `localhost:${port}`,
    port: 3000,
    files: [
      `${config.client}/**/*.*`,
      `!${config.less}`,
      `${config.tmp}/**/*.css`
    ],
    ghostMode: {
      clicks: true,
      scroll: true,
      forms: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0
  };

  return browserSync(options);
}

function clean(path: string): Promise<string[]> {
  log(`Cleaning: ${$.util.colors.blue(path)}`);
  return del(path);
}

function log(msg: Message | string): any {
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
