import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import postcssGroupMedia from 'postcss-sort-media-queries';
import sourcemaps from "gulp-sourcemaps";

import { filePaths } from '../config/paths.js';
import { plugins } from '../config/plugins.js';
import { logger } from "../config/logger.js";

const sass = gulpSass(dartSass);

const scss = (isBuild, serverInstance) => {
	return gulp.src(filePaths.src.scss, { allowEmpty: true })
    .pipe(logger.handleError('SCSS'))
		.pipe(plugins.if(!isBuild, sourcemaps.init()))
		.pipe(sass({
			outputStyle: 'expanded',
			includePaths: ['node_modules']
		}))
		.pipe(plugins.replace(/@img\//g, '../images/'))
		.pipe(plugins.if(isBuild, postcss([
			autoprefixer(),
			postcssPresetEnv(),
			postcssGroupMedia({ sort: 'desktop-first' })
		])))
		.pipe(plugins.if(isBuild, cleanCss()))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(plugins.if(!isBuild, sourcemaps.write('.')))
		.pipe(gulp.dest(filePaths.build.css))
		.pipe(serverInstance.stream());
};

export { scss };