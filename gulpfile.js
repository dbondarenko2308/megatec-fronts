import gulp from 'gulp';
import browserSync from 'browser-sync';
import { filePaths } from './gulp/config/paths.js';

/**
 * Импорт задач
 */
import { copy } from './gulp/tasks/copy.js';
import { copyRootFiles } from './gulp/tasks/copy-root-files.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { javascript } from './gulp/tasks/javascript.js';
import { fonts } from './gulp/tasks/fonts.js';
import { createSvgSprite } from './gulp/tasks/create-svg-sprite.js';
import { zip } from './gulp/tasks/zip.js';
import { ftpDeploy } from './gulp/tasks/ftp-deploy.js';
import { processImages, copySvg } from './gulp/tasks/images.js';

const isBuild = process.argv.includes('--build');
const browserSyncInstance = browserSync.create();

/**
 * Хелпер для перезагрузки браузера
 */
const reloadBrowser = (done) => {
  browserSyncInstance.reload();
  done();
};

const copyMainJs = () => {
  return gulp.src(filePaths.src.mainJs)
    .pipe(gulp.dest(filePaths.build.js))
    .pipe(browserSyncInstance.stream());
};

/**
 * Создание обработчиков (хендлеров) с привязкой контекста
 */
const handleServer = server.bind(null, browserSyncInstance);
const handleHTML = html.bind(null, isBuild, browserSyncInstance);
const handleSCSS = scss.bind(null, isBuild, browserSyncInstance);

const handleJS = gulp.parallel(
  javascript.bind(null, !isBuild, browserSyncInstance),
  copyMainJs
);

// Комплексный обработчик для всех изображений с последующей перезагрузкой
const handleImages = gulp.series(
  gulp.parallel(
    processImages(isBuild),
    copySvg
  ),
  reloadBrowser
);

// Комплексный обработчик для SVG-спрайта с последующей перезагрузкой
const handleSprite = gulp.series(createSvgSprite, reloadBrowser);

/**
 * Наблюдатель за изменениями в файлах
 */
function watcher() {
  gulp.watch(filePaths.watch.static, copy);
  gulp.watch(filePaths.watch.html, handleHTML);
  gulp.watch(filePaths.watch.scss, handleSCSS);
  gulp.watch(filePaths.watch.js, handleJS);
  gulp.watch(filePaths.watch.images, handleImages);
  gulp.watch(filePaths.src.svgIcons, handleSprite);
}

/**
 * Параллельные задачи для первоначальной сборки
 */
const imageTasks = gulp.parallel(processImages(isBuild), copySvg);
const devTasks = gulp.parallel(copy, copyRootFiles, createSvgSprite, handleHTML, handleSCSS, handleJS, imageTasks);

/**
 * Основные задачи
 */
const mainTasks = gulp.series(fonts, devTasks);

/**
 * Построение сценариев выполнения задач
 */
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, handleServer));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftpDeploy);

/**
 * Выполнение сценария по умолчанию
 */
gulp.task('default', dev);

/**
 * Экспорт сценариев
 */
export { dev, build, deployZIP, deployFTP, createSvgSprite };