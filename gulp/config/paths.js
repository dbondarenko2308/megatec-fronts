import path from 'path';
import fs from 'fs';

const buildFolder = './dist';
const srcFolder = './src';

const scssPaths = [`${srcFolder}/scss/main.scss`];

if (fs.existsSync(`${srcFolder}/scss/pages`)) {
  scssPaths.push(`${srcFolder}/scss/pages/*.scss`);
}

const svgIconsPaths = [];
if (fs.existsSync(`${srcFolder}/images/icons`)) {
  svgIconsPaths.push(`${srcFolder}/images/icons/*.svg`);
}

export const filePaths = {
  build: {
    js: `${buildFolder}/js/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/images/`,
    fonts: `${buildFolder}/fonts/`,
    static: `${buildFolder}/static/`,
  },
  src: {
    js: `${srcFolder}/js/*.js`,
    mainJs: `${srcFolder}/js/main.js`,
    images: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp}`,
    svg: `${srcFolder}/images/**/*.svg`,
    scss: scssPaths,
    html: `${srcFolder}/*.html`,
    static: `${srcFolder}/static/**/*.*`,
    svgIcons: svgIconsPaths,
    fontFacesFile: `${srcFolder}/scss/config/fonts.scss`,
    fonts: `${srcFolder}/fonts/`,
  },
  watch: {
    js: `${srcFolder}/js/**/*.js`,
    scss: `${srcFolder}/scss/**/*.scss`,
    html: `${srcFolder}/**/*.html`,
    images: `${srcFolder}/**/*.{jpg,jpeg,png,svg,gif,webp,ico}`,
    static: `${srcFolder}/static/**/*.*`,
  },
  buildFolder,
  srcFolder,
  clean: buildFolder,
  projectDirName: path.basename(path.resolve()),
  ftp: ``,
};