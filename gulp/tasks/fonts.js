import gulp from 'gulp';
import fs from 'fs';
import path from 'path';

import { filePaths } from '../config/paths.js';
import { logger } from '../config/logger.js';
import browserSync from 'browser-sync';

const { src, dest } = gulp;
const { fonts: srcFonts, fontFacesFile } = filePaths.src;
const buildFonts = filePaths.build.fonts;

const variableRegex = /variable/i;
const fontWeights = {
	thin: 100, extralight: 200, light: 300, regular: 400, medium: 500,
	semibold: 600, bold: 700, extrabold: 800, black: 900, extrablack: 950
};

const fontFormats = {
	'.woff2': 'woff2',
	'.woff': 'woff',
	'.ttf': 'truetype'
};

const copyFonts = () => {
	// ВОТ ИЗМЕНЕНИЕ: Добавляем { encoding: false }
	return src(`${srcFonts}/*.*`, { encoding: false })
		.pipe(logger.handleError('FONTS [copy]'))
		.pipe(dest(buildFonts))
		.pipe(browserSync.stream());
};

const generateFontFaces = async (done) => {
	try {
		const fontFiles = await fs.promises.readdir(srcFonts);

		if (fontFiles.length === 0) {
			logger.warning('В папке src/fonts нет шрифтов для генерации стилей.');
			await fs.promises.writeFile(fontFacesFile, '');
			return done();
		}

		await fs.promises.writeFile(fontFacesFile, '');
		let fontStylesContent = '';
		const processedFamilies = new Set();

		for (const file of fontFiles) {
			const ext = path.extname(file).toLowerCase();
			const format = fontFormats[ext];

			if (!format) continue;

			const [fileName] = file.split('.');

			if (variableRegex.test(fileName)) {
				const baseName = fileName.replace(variableRegex, '').replace(/-$/, '');
				if (processedFamilies.has(baseName)) continue;

				fontStylesContent += `@font-face {\n\tfont-family: '${baseName}';\n\tfont-display: swap;\n\tsrc: url("../fonts/${file}") format("${format}");\n\tfont-weight: 100 900;\n\tfont-style: normal;\n}\n\n`;
				processedFamilies.add(baseName);
			} else {
				const [name, weightName = 'regular'] = fileName.split('-');
				const weight = fontWeights[weightName.toLowerCase()];
				const style = /italic/i.test(fileName) ? 'italic' : 'normal';

				if (!weight) {
					logger.warning(`Не удалось определить вес для шрифта: ${file}. Использован вес 400.`);
				}

				fontStylesContent += `@font-face {\n\tfont-family: '${name}';\n\tfont-display: swap;\n\tsrc: url("../fonts/${file}") format("${format}");\n\tfont-weight: ${weight || 400};\n\tfont-style: ${style};\n}\n\n`;
			}
		}

		await fs.promises.appendFile(fontFacesFile, fontStylesContent);
		console.log('✅ Файл со стилями шрифтов успешно сгенерирован!');

	} catch (err) {
		logger.error('Ошибка при генерации стилей шрифтов:\n', err);
	}
	done();
};

export const fonts = gulp.series(copyFonts, generateFontFaces);