import gulp from 'gulp';
import svgSprite from 'gulp-svg-sprite';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

import { filePaths } from '../config/paths.js';

const createSvgSprite = (done) => {
  if (!filePaths.src.svgIcons || filePaths.src.svgIcons.length === 0) {
    console.log('SVG icons not found, skipping sprite creation.');
    return done();
  }

  return gulp.src(filePaths.src.svgIcons)
    .pipe(plumber(
      notify.onError({
        title: "SVG_SPRITE",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: `../icons/sprite.svg`,
          example: true,
        },
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                {
                  name: 'removeUselessStrokeAndFill',
                  active: true,
                }
              ]
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(filePaths.build.images));
};

export { createSvgSprite };