import * as gulp from 'gulp';

gulp.task('default', ['hello'], () => {
});

gulp.task('hello', () => {
  console.log('Hello World');
});

function add(i: number) {
  return i + 11;
}
