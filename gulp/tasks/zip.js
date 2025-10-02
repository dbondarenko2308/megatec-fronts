import gulp from 'gulp';
import { deleteAsync } from 'del';
import zipPlugin from 'gulp-zip';

import { filePaths } from '../config/paths.js';
import { logger } from "../config/logger.js";

const zip = async () => { 
  await deleteAsync(`./${filePaths.projectDirName}.zip`);
  logger.warning('Прошлый ZIP архив успешно удалён');

  return gulp.src(`${filePaths.buildFolder}/**/*.*`, {})
    .pipe(logger.handleError('ZIP'))
    .pipe(zipPlugin(`${filePaths.projectDirName}.zip`))
    .pipe(gulp.dest('./'));
};

export { zip };