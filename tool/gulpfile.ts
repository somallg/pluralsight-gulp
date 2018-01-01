import ReadWriteStream = NodeJS.ReadWriteStream;
import * as path from 'path';
import * as gulp from 'gulp';
import * as yargs from 'yargs';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as del from 'del';
import * as wiredep from 'wiredep';
import * as browserSync from 'browser-sync';
import * as karma from 'karma';

import { config } from './gulp.config';
import { BrowserSyncOptions, GulpLoadPlugins, Message } from './interface';

const args = yargs.argv;
const $ = gulpLoadPlugins({ lazy: true }) as GulpLoadPlugins;
const port = process.env.PORT || config.defaultPort;

gulp.task('list', $.taskListing);

gulp.task('default', ['list'], () => {
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

gulp.task('fonts', ['clean-fonts'], () => {
  log('Copying fonts');

  return gulp.src(config.fonts)
    .pipe<ReadWriteStream>(gulp.dest(`${config.build}/fonts`));
});

gulp.task('images', ['clean-images'], () => {
  log('Copying and compressing images');

  return gulp.src(config.images)
    .pipe<ReadWriteStream>($.imagemin({ optimizationLevel: 4 }))
    .pipe<ReadWriteStream>(gulp.dest(`${config.build}/images`));
});

gulp.task('clean', () => {
  const delConfig = [config.build, config.tmp];
  return clean(delConfig);
});

gulp.task('clean-code', () => {
  const delConfig = [
    `${config.tmp}/**/*.js`,
    `${config.build}/**/*.html`,
    `${config.build}/js/**/*.js`,
  ];
  return clean(delConfig);
});

gulp.task('clean-fonts', () => {
  return clean(`${config.build}/fonts/**/*.*`);
});

gulp.task('clean-images', () => {
  return clean(`${config.build}/images/**/*.*`);
});

gulp.task('clean-styles', () => {
  return clean(`${config.tmp}/**/*.css`);
});

gulp.task('less-watcher', () => {
  gulp.watch([config.less], ['styles']);
});

gulp.task('templatecache', ['clean-code'], () => {
  return gulp.src(config.htmlTemplates)
    .pipe<ReadWriteStream>($.minifyHtml({ empty: true }))
    .pipe<ReadWriteStream>($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe<ReadWriteStream>(gulp.dest(config.tmp));

});

gulp.task('wiredep', () => {
  log('Wire up the bower css js and our app js into the html');

  return gulp.src(config.index)
    .pipe<ReadWriteStream>(wiredep.stream(config.wiredepDefaultOptions))
    .pipe<ReadWriteStream>($.inject(gulp.src(config.js)))
    .pipe<ReadWriteStream>(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'],  () => {
  log('Wire up the app css into the html, after call wiredep');

  return gulp.src(config.index)
    .pipe<ReadWriteStream>($.inject(gulp.src(config.css)))
    .pipe<ReadWriteStream>(gulp.dest(config.client));
});

gulp.task('optimize', ['inject', 'fonts', 'images'], () => {
  log('Optimizing the javascript, css, html');

  const assets = $.useref.assets({ searchPath: './' });
  const templateCache = `${config.tmp}/${config.templateCache.file}`;
  const cssFilter = $.filter('**/*.css', { restore: true });
  const jsLibFilter = $.filter(`**/${config.optimized.lib}`, { restore: true });
  const jsAppFilter = $.filter(`**/${config.optimized.app}`, { restore: true });

  return gulp.src(config.index)
    .pipe<ReadWriteStream>($.plumber())
    .pipe<ReadWriteStream>($.inject(
      gulp.src(templateCache, { read: false }),
      { starttag: '<!-- inject:templates:js -->' }))
    .pipe<ReadWriteStream>(assets)
    .pipe<ReadWriteStream>(cssFilter)
    .pipe<ReadWriteStream>($.csso())
    .pipe<ReadWriteStream>(cssFilter.restore)
    .pipe<ReadWriteStream>(jsLibFilter)
    .pipe<ReadWriteStream>($.uglify())
    .pipe<ReadWriteStream>(jsLibFilter.restore)
    .pipe<ReadWriteStream>(jsAppFilter)
    .pipe<ReadWriteStream>($.ngAnnotate())
    .pipe<ReadWriteStream>($.uglify())
    .pipe<ReadWriteStream>(jsAppFilter.restore)
    .pipe<ReadWriteStream>($.rev())
    .pipe<ReadWriteStream>(assets.restore())
    .pipe<ReadWriteStream>($.useref())
    .pipe<ReadWriteStream>($.revReplace())
    .pipe<ReadWriteStream>(gulp.dest(config.build))
    .pipe<ReadWriteStream>($.rev.manifest())
    .pipe<ReadWriteStream>(gulp.dest(config.build));
});

/**
 * Bump version
 * --type=minor|major|patch
 * --versions=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', () => {
  const { type, versions } = args;
  let options = {};
  let msg = 'Bumping versions';

  if (versions) {
    options = {
      ...options,
      versions
    };
    msg = `${msg} to ${versions}`;
  } else {
    options = {
      ...options,
      type
    };
    msg = `${msg} for a ${type}`;
  }
  log(msg);

  return gulp.src(config.packages)
    .pipe<ReadWriteStream>($.print())
    .pipe<ReadWriteStream>($.bump(options))
    .pipe<ReadWriteStream>(gulp.dest(config.root));
});

gulp.task('serve-build', ['optimize'], () => {
  serve(false);
});

gulp.task('serve-dev', ['inject'], () => {
  serve(true);
});

gulp.task('hello', () => {
  console.log('Hello World');
});

gulp.task('test', ['vet', 'templatecache'], (done) => {
  startTests(true, done);
});
/////////////

function serve(isDev: boolean) {
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
      startBrowserSync(isDev);
    })
    .on('crash', () => {
      log('*** nodemon crashed ***');
    })
    .on('exit', () => {
      log('*** nodemon exit ***');
    });
}

function changeEvent(event: gulp.WatchEvent) {
  const srcPattern = new RegExp(`/.*(?=/${config.source})/`);
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync(isDev: boolean): any {
  if (args.nosync || browserSync.active) {
    return;
  }
  log('Start browser sync');

  if (isDev) {
    gulp.watch([config.less], ['styles'])
      .on('change', changeEvent);
  } else {
    gulp.watch([config.less, ...config.js, config.html], ['optimize', browserSync.reload])
      .on('change', changeEvent);
  }

  const options: BrowserSyncOptions = {
    proxy: `localhost:${port}`,
    port: 3000,
    files: isDev ? [
      `${config.client}/**/*.*`,
      `!${config.less}`,
      `${config.tmp}/**/*.css`
    ] : [],
    watchEvents: ['add', 'change'],
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

function startTests(singleRun: boolean, done: Function) {
  let excludeFiles = [];
  const serverSpec = config.serverIntegrationSpecs;

  excludeFiles = serverSpec;

  new karma.Server(
    {
      configFile: path.join(__dirname, '..', 'karma.conf.js'),
      exclude: excludeFiles,
      singleRun: Boolean(singleRun)
    },
    karmaCompleted).start();

  function karmaCompleted(karmaResult: any) {
    log('*** Karma completed! ***');
    if (karmaResult === 1) {
      done(`karma: tests failed with code ${karmaResult}`);
    } else {
      done();
    }
  }
}

function clean(path: string | string[]): Promise<string[]> {
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
