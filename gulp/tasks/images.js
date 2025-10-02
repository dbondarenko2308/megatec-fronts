import gulp from 'gulp';
import webp from 'gulp-webp';
import newer from 'gulp-newer';

import { filePaths } from '../config/paths.js';
import { logger } from '../config/logger.js';

const createWebp = () => {
  return gulp.src(filePaths.src.images, { encoding: false })
    .pipe(logger.handleError('WEBP'))
    .pipe(webp())
    .pipe(gulp.dest(filePaths.build.images));
};

const compressImages = async () => {
  const { default: imageMin } = await import('gulp-imagemin');
  const { default: mozjpeg } = await import('imagemin-mozjpeg');
  const { default: pngquant } = await import('imagemin-pngquant');

  return gulp.src(filePaths.src.images, { encoding: false })
    .pipe(logger.handleError('COMPRESS IMAGES'))
    .pipe(newer(filePaths.build.images))
    .pipe(
      imageMin([
        mozjpeg({ quality: 75, progressive: true }),
        pngquant({ quality: [0.65, 0.8] }),
      ], {
        verbose: true
      })
    )
    .pipe(gulp.dest(filePaths.build.images));
};

const copyImages = () => {
  return gulp.src(filePaths.src.images, { encoding: false })
    .pipe(newer(filePaths.build.images))
    .pipe(gulp.dest(filePaths.build.images));
};

export const copySvg = () => {
  return gulp.src(filePaths.src.svg, { encoding: false })
    .pipe(logger.handleError('SVG IMAGES'))
    .pipe(newer(filePaths.build.images))
    .pipe(gulp.dest(filePaths.build.images));
};

export const processImages = (isBuild) => {
  if (isBuild) {
    return gulp.parallel(createWebp, compressImages);
  } else {
    return copyImages;
  }
};