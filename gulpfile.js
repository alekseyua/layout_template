const 		{watch, dest, src, gulp, parallel, series}	= require('gulp');
let				path_src 													= "./#src"; /*путь к файлам для разработки*/
let				path_dest													= require('path').basename(__dirname); /*путь к файлам для итогов  "project_result"*/
/*устанавливаем модули для верстки*/
const			browserSync													= require('browser-sync').create();
const			scss														= require('gulp-sass')(require('sass'));
const			autoprefixer												= require('gulp-autoprefixer');
const			group_media													= require('gulp-group-css-media-queries');
const			cleancss													= require('gulp-clean-css');
const			rename														= require('gulp-rename');
const 			fileinclude													= require('gulp-file-include');
const 			buffer														= require('vinyl-buffer');
const 			uglify_es													= require('gulp-uglify-es').default;
/*плагины для работы с шрифтами*/
const 		ttf2woff														= require('gulp-ttf2woff');
const 		ttf2woff2														= require('gulp-ttf2woff2');
const 		fonter															= require('gulp-fonter');
/*для подключения файлов проекте */
const 		fs																= require('fs');
const 		del																= require('del');
/*модули обработки изображения*/
const 		webp															= require('gulp-webp');
const 		imagemin														= require('gulp-imagemin');
const 		webphtml														= require('gulp-webp-html');
const 		webpcss															= require('gulp-webp-css');
//для отслеживания ошибок
const 		plumber 														= require('gulp-plumber');
const		iconfont														= require('gulp-iconfont');
const		iconfontCss														= require('gulp-iconfont-css');
const		consolidate														= require('gulp-consolidate');
const		minifyCss														= require('gulp-minify-css');
const		svgSprites														= require('gulp-svg-sprites');
const		svgmin															= require('gulp-svgmin');
const		cheerio															= require('gulp-cheerio');
const		replace															= require('gulp-replace');

const		spritesmith														= require('gulp.spritesmith');
const 		spritesmash 													= require('gulp-spritesmash');

var $ = {
	gutil: require('gulp-util'),
	svgSprite: require('gulp-svg-sprite'),
	size: require('gulp-size'),
};

/*укажем все пути к файлам источника, куда выгружать и что будим отслеживать*/
let path = {
src : {
	html			: [path_src + "/html/**/*.html", "!" + path_src + "/html/**/_*.html"],
	js				: [path_src + "/js/**/*.js", "!" + path_src + "/js/**/_*.js"],
	scss			: [path_src + "/scss/**/*.scss", "!" + path_src + "/scss/**/_*.scss"],
	fonts			: path_src + "/fonts/*.ttf",
	img				: [path_src + "/img/**/*.{jpg,jpeg,svg,webp,png,gif,ico}", "!" + path_src + "/img/icons***"],
	json			: path_src + "/json/*.json",
	svg 			: path_src + "/img/icons/svg/*.svg",
	svgcss			: path_src + "/_sprite.scss",
	templates		: path_src + "/templates/_icons_template.scss",
	templates_symbol: path_src + "/templates/_icons_template_symbol.scss",
	mainsvg			: path_src + "/img/icons/sprit/sprite.svg",
	},
upload	: {
	html		: path_dest + "/",
	js			: path_dest + "/js/",
	css			: path_dest + "/style/",
	fonts		: path_dest + "/fonts/",
	img			: path_dest + "/img/",
	json		: path_dest + "/json/",
	svg 		: path_src + "/img/icons/sprite/",
	svgsymbol	: path_src + "/html/",
	scsssymbol	: path_src + "/scss/",
	}
}


function browsersync() {
    browserSync.init({
        server: {
            baseDir: "./" + path_dest + "/",
            watch  : true
        }
    });
};

function html() {
	return src(path.src.html)
			.pipe(fileinclude())
			.pipe(webphtml())
			.pipe(dest(path.upload.html));
}

function js() {
	return src(path.src.js)
			.pipe(fileinclude())
			.pipe(dest(path.upload.js))
			.pipe(uglify_es())
			.pipe(
				rename({
					extname: ".min.js"
				}))
			.pipe(dest(path.upload.js))
			.pipe(browserSync.stream());
}

function scssConvert() {
	return src(path.src.scss)
			.pipe(
				scss({
					outputStyle: "expanded"
				})
				/*.on('error',scss.logError)*/)
			.pipe(group_media())
			.pipe(
				autoprefixer({
					overrideBrowserslist: ["last 5 versions"],
					cascade: true
				})
				)
			.pipe(webpcss())
			.pipe(dest(path.upload.css))
			.pipe(cleancss())
			.pipe(
				rename({
					extname: ".min.css"
				}))
			.pipe(dest(path.upload.css))
			.pipe(browserSync.stream());
}

function watchFile(){
			watch("#src/html/**/*.html", html);
			watch('#src/html/**/*.html').on('change', browserSync.reload);
			watch("#src/scss/**/*.scss", scssConvert);
			watch("#src/js/**/*.js", js);
			watch("#src/json/**/*.json", json);
			watch("#src/img/**/*", images);
		}

function json() {
	return src(path.src.json)
			.pipe(plumber())
				.pipe(dest(path.upload.json))
}

/*функция удаления проекта*/
function alldel() {
	return del("./" + path_dest + "/")
}

/*==================================================================================*/
/*функция сжатия изображения*/
function images() {
	return src(path.src.img)
			.pipe(webp({
				quality: 70
			}))
			.pipe(dest(path.upload.img))
			.pipe(src(path.src.img))
			.pipe(buffer())
			.pipe(
				imagemin({
					progressive: true,
					svgoPlugins: [{ removeViewBox: false}],
					interlaced: true,
					optimizationLevel: 3  //0 to 7
				})
			)
			.pipe(dest(path.upload.img))
}
/*==================================================================================*/
			/*функция создания шрифтов для верстки*/
/*	
	100: Thin;
	200: Extra Light (Ultra Light);
	300: Light;
	400: Normal;Regular;
	500: Medium;
	600: Semi Bold (Demi Bold);
	700: Bold;
	800: Extra Bold (Ultra Bold);
	900: Black (Heavy).
*/


			function fonts() {
						 src(path.src.fonts)
						.pipe(ttf2woff())
						.pipe(dest(path.upload.fonts))
				return src(path.src.fonts)
						.pipe(ttf2woff2())
						.pipe(dest(path.upload.fonts))
			}

			function otf2ttf() {
				return src(path_src + "/fonts/*.otf")
						.pipe(fonter({
							formats : ['ttf']
						}))
						.pipe(dest(path_src + "/fonts/"))
			}

/*==================================================================================*/
			/*надо решить проблему с функциями асинхронности*/
			/*создание файла _fonts.scss*/
			function creatFile() {
				return fs.open(path_src + '/scss/_fonts.scss', 'w', (err) => {
			        if(err) throw err;
			        console.log('File created');
			   });
			}
			/*функция для подключения стилей к файлу css*/

			async function asyncAwaitTask() {
				const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
				console.log(version);
				await Promise.resolve('some result');
			  }
			  
	async function fontsStyle (){
			console.log('first step 1 start')

				let file_content = fs.readFileSync(path_src + '/scss/_fonts.scss', cb);
				console.log('first',file_content)
				await Promise.resolve('some result');
				if (file_content == '') {
					fs.writeFile(path_src + '/scss/_fonts.scss', '', cb);
					// считываем все файлы в папке
					return fs.readdir(path.upload.fonts, function (err, items) {
						if (items) {
							let c_fontname;
							for (var i = 0; i < items.length; i++) {
								let fontname = items[i].split('.');
								console.log('first',fontname)
								fontname = fontname[0];
								console.log(c_fontname != fontname);
								if (c_fontname != fontname) {
									fs.appendFile(path_src + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
									c_fontname = fontname;															
								}								
							}
						}else{
							console.log('нет в папке ни одного файла со стилями #path_dest + /fonts/, добавте файлы или предварительно запустите скрипт fonts')
						}
					})
				}else{
					console.log('файлы уже создан в #path_src + /_fonts.scss, для внесения изменений или новых, удалити существующие cодержимое файла, запустите  скрипт (yarn gulp all) заново')
				}
			     console.log('File complate');
			}
			function cb() { }

/*функция удаления из папки dist/fonts*/
const delFonts = async () => {
	const countFileFonts = fs.readFileSync("./" + path_dest + "/fonts/",(files)=>{
		return console.log('files',files)
	})
	// del("./" + path_dest + "/fonts/**")
	await Promise.resolve('result');
	return console.log('delete complate!!!')
}

exports.json					= json;
exports.fonts					= fonts;
exports.otf2ttf					= otf2ttf;
exports.fontsStyle				= fontsStyle;
exports.images					= images;


exports.creatFile				= creatFile;
exports.alldel					= alldel;
exports.delFonts				= delFonts;



exports.browsersync				= browsersync;
exports.watchFile				= watchFile;
exports.html					= html;
exports.js						= js;
exports.scssConvert				= scssConvert;

exports.all						=series(otf2ttf, fonts, fontsStyle);
exports.default					= parallel(series(json, js, scssConvert,html),browsersync, watchFile);
//exports.all						=series(images, otf2ttf, fonts, creatFile, fontsStyle);




/*===========конвертируем svg в иконочный шрифт===================================*/

var fontName = 'icons';//название щрифта
var className = '_icon';//class css



function iconFont() {
	return  src(['#src/img/icons/*.svg'])
		    .pipe(iconfontCss({
		        path: '#src/templates/_icons_template.scss',
		        fontName: fontName,
		        targetPath: 'myfont.css',
		        fontPath: '../fonts/icons/'
		     }))
		     .pipe(iconfont({
		        fontName: fontName
		     }))
		     .pipe(dest('new/fonts/icons'));
};

exports.iconFont					= iconFont;

/*===========конвертируем svg в sprite===================================*/


function svgSpriteBuild() {
	return src(path.src.svg)
			.pipe($.svgSprite({
			shape: {
				spacing: {
					padding: 5
				}
			},
			// remove all fill and style declarations in out shapes
			// build svg sprite
			mode: {
				css: {
					dest: "./",
					//layout: "diagonal",
					sprite: 'sprite.svg',
					bust: false,
					render: {
						scss: {
							dest: '../../../scss/_sprite.scss',
							template: path.src.templates
						}
					}
				},
			}
		}))
		.pipe(dest(path.upload.svg))
		.pipe(src(path.src.svg))
		// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		// cheerio plugin create unnecessary string '>', so replace it.
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprites({
				mode: "symbols",
				preview: false,
				selector: "icon-%f",
				svg: {
					symbols: '_symbol_sprite.html'
				}
			}
		))
		.pipe(dest(path.upload.svgsymbol))
		
};

// create sass file for our sprite
function svgSpriteSass() {
	return src(path.src.svg)
		.pipe(svgSprites({
				/*preview: false,
				selector: "icon-%f",
				svg: {
					sprite: '_svg_sprite.html'
				},*/
				cssFile: '../scss/_svg_sprite.scss',
				templates: {
					css: require("fs").readFileSync(path.src.templates_symbol, "utf-8")
				}
			}
		))
		.pipe(dest(path.upload.scsssymbol));
};

exports.svgSpriteSass					= svgSpriteSass;
exports.svgSpriteBuild					= svgSpriteBuild;

exports.svgSprite = series(svgSpriteBuild);



/*===========конвертируем sprite===================================*/
function pngSprite() {
  return src('#src/img/icons/*.png')
  		.pipe(spritesmith({
		    imgName: 'sprite.png',
		    cssName: '_sprite.scss',
	  		pading: 10,
	  		algorithm: 'left-right'
	  		//cssTemplate: '#src/templates/_icons_template.scss'
	  	}))
  		.pipe(dest('#src/img/icons/sprite'))
  		.pipe(src('#src/img/icons/sprite/*.png'))
  		.pipe(dest(path.upload.img + '/icons'));
};

exports.pngSprite						= pngSprite;
