//
// header-start
//////////////////////////////////////////////////////////////////////////////////
//
// \file      gulpfile.ts
//
// \brief     This file belongs to the ng2 tutorial project
//
// \author    Bernard
//
// \copyright Copyright ng2goodies 2015
//            Distributed under the MIT License
//            See http://opensource.org/licenses/MIT
//
//////////////////////////////////////////////////////////////////////////////////
// header-log
//
// $Author$
// $Date$
// $Revision$
//
//////////////////////////////////////////////////////////////////////////////////
// header-end
//

const fs            = require('fs');
const cp            = require('child_process');
const gulp          = require('gulp');
const nodemon       = require('gulp-nodemon');
const livereload    = require('livereload');
const gasync        = require('async');            // from nodejs.org/api/async.html
const wget          = require('wgetjs');
const rename        = require('gulp-rename');
const sass          = require('gulp-sass');
const sourcemaps    = require('gulp-sourcemaps');
const gprint        = require('gulp-print');
const ts            = require('gulp-typescript');
const tslint        = require('gulp-tslint');
const tslintStylish = require('gulp-tslint-stylish');
const yargs         = require('yargs');

const argv = yargs
              .option('v', {
                alias: 'verbose'
              })
              .argv;

const verbosity = ('verbose' in argv) ? Number(argv.verbose) : 0;

console.log("DEBUG = verbosity = ", verbosity);

function filtered_log(level: number, args: string) {
  if (level <= verbosity) {
    console.log(args);
  }
}

function transpile_ts_files(source: string | string[], rebase: string, dest: string): NodeJS.ReadWriteStream {
  const tsProject = ts.createProject('./tsconfig.json');
  return gulp.src(source, { base: rebase })
    .pipe(gprint((filename: string): string => {
      // given filename has escape codes which prevent correct display!!!
      filtered_log(2, '[TRACE] Gulpfile: transpiling ts file: ' + filename.replace(/\x1B\[\d\dm/g, ''));
      return '';
    }))
    .pipe(ts(tsProject))
    .pipe(gulp.dest(dest));
};

function lint_ts_files(src: string | string[]) {
  gulp.src(src)
    .pipe(gprint((filename: string): string => {
      filtered_log(2, '[TRACE] Gulpfile: linting ts files: ' + filename.replace(/\x1B\[\d\dm/g, ''));
      return '';
    }))
    .pipe(tslint())
    .pipe(tslint.report(tslintStylish, {
      emitError: false,
      configuration: {
        sort: true,
        bell: true
      }
    }));
};

function scss_to_css(source: string | string[], rebase: string, dest: string): NodeJS.ReadWriteStream {
  return gulp.src(source, { base: rebase })
    .pipe(gprint((filename: string): string => {
      filtered_log(2, '[TRACE] Gulpfile: converting scss files: ' + filename.replace(/\x1B\[\d\dm/g, ''));
       return '';
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename((file: any)  => {
      file.dirname = file.dirname.replace('scss', 'css');
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
};

function init_lib(dest: string) {
  const dest_lib   = `${dest}/lib`;

  gulp.src('node_modules/es6-shim/es6-shim.min.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/es6-shim/es6-shim.js').pipe(gulp.dest(dest_lib));

  gulp.src('node_modules/systemjs/dist/system.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/systemjs/dist/system.src.js').pipe(gulp.dest(dest_lib));

  gulp.src('node_modules/rxjs/bundles/Rx.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/rxjs/bundles/Rx.umd.js').pipe(gulp.dest(dest_lib));

  gulp.src('node_modules/angular2/bundles/angular2-polyfills.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/angular2/bundles/angular2-all.umd.dev.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/angular2/bundles/angular2-all.umd.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/angular2/bundles/angular2.min.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/angular2/bundles/angular2.dev.js').pipe(gulp.dest(dest_lib));

  gulp.src('node_modules/angular2/bundles/router.min.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/angular2/bundles/router.dev.js').pipe(gulp.dest(dest_lib));
  gulp.src('node_modules/angular2/bundles/router.js').pipe(gulp.dest(dest_lib));

  filtered_log(1, '[TRACE] Gulpfile: all lib files copied in: ' + dest_lib);
}

gulp.task('init_lib', () => {
  const dest = './dist/client';
  init_lib(dest);
});

//////////////////////////////////////////////////
//
// Task: init
// Initialize the static client folder from the src files
// from the node_module to the client/lib folder
// These files are then loader by index.html
// For example: <script src="lib/system.src.js"></script>
//
//////////////////////////////////////////////////

gulp.task('init', () => {
  gulp.start('init_lib');

  gulp.src('src/**/*.html', {base : 'src'}).pipe(gulp.dest('dist/client'));
  gulp.src('src/**/*.svg', {base : 'src'}).pipe(gulp.dest('dist/client'));
  gulp.src('src/**/*.png', {base : 'src'}).pipe(gulp.dest('dist/client'));
  gulp.src('src/**/favicon.ico', {base : 'src'}).pipe(gulp.dest('dist/client'));

  scss_to_css('src/**/*.scss', 'src', 'dist/client');
  transpile_ts_files('src/**/*.ts', 'src', 'dist/client');
  lint_ts_files(['src/**/*.ts', 'gulpfile.ts', 'server/**/*.ts']);
});

//////////////////////////////////////////////////
//
// individual watch tasks
// unless you are doing some unit test
// you don't need to call these tasks
//

gulp.task('watch.transpile', () => {
  filtered_log(1, '[INFO] Launching watch on the .ts files');
  gulp.watch('src/app/**/*.ts', (event: any) => {
    filtered_log(2, '[INFO] File ' + event.path + ' event: ' + event.type);
    lint_ts_files(event.path);
    transpile_ts_files(event.path, 'src', 'dist/client');
  });
});

gulp.task('watch.copy', () => {
  filtered_log(1, '[INFO] Launching watch on *.html, *.svg, favicon.ico files');
  gulp.watch(['src/**/*.html', 'src/**/*.png', 'src/**/*.svg', 'src/favion.ico'], (event: any) => {
    filtered_log(2, '[INFO] File ' + event.path + ' event: ' + event.type);
    gulp.src(event.path, {base : 'src'}).pipe(gulp.dest('dist/client'));
  });
});

gulp.task('watch.scss', () => {
  filtered_log(1, '[INFO] Launching watch on the .scss files');
  gulp.watch(['src/**/*.scss'], (event: any) => {
    filtered_log(2, '[INFO] File ' + event.path + ' event: ' + event.type);
    scss_to_css(event.path, 'src', 'dist/client');
  });
});


gulp.task('watch.livereload', () => {
  let server = livereload.createServer();
  filtered_log(1, '[INFO] Launching liveserver at https://localhost:' + server.config.port);
  server.watch(__dirname + '/dist/client');
});


gulp.task('http.server', () => {
  filtered_log(1, '[INFO] Launching express http server');

  //
  // prepare process options
  //
  let exec_str = 'ts-node server/bootstrap.ts';

  process.argv.forEach( (val: string, index: number) => {
    if (index >= 3) {
      exec_str += ` ${val}`;
    }
  });
  console.log(`[INFO] Exec: ${exec_str}`);
  nodemon({
    verbose: false,
    watch: 'server',
    ext: 'ts',
    exec: exec_str
  }).on('restart', () => {
    process.env.RESTART = true;
  });
});

//////////////////////////////////////////////////
//
// development tasks: in parallel
// 1. watch on the ts file and transpile to js
// 2. watch on copiable files html, svg, favicon, ...
// 3. watch on scss files
// 4. live reload server on the web client files
// 5. http server
//
gulp.task('demo', () => {
  gasync.parallel([
    () => { gulp.start('watch.transpile'); },
    () => { gulp.start('watch.copy'); },
    () => { gulp.start('watch.scss'); },
    () => { gulp.start('watch.livereload'); },
    () => { gulp.start('http.server'); },
  ]);
});



gulp.task('default', () => {
  console.log(`Usage: gulp task [options]
    Options:
      [--verbose [num]]   console.log output level
    Task list:
      init                Initialize all the local client files
      demo                Start local server in dev mode, with live reload
  `);
});