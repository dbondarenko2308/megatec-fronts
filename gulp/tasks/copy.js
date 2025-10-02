import gulp from 'gulp';
import { filePaths } from '../config/paths.js';
import { logger } from "../config/logger.js";

const copy = () => {
  return gulp.src([filePaths.src.static, `!${filePaths.src.fonts}/**/*`], { allowEmpty: true, encoding: false })
    .pipe(logger.handleError('COPY'))
    .pipe(gulp.dest(filePaths.build.static));
};

export { copy };