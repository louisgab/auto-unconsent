let mix = require('laravel-mix')

mix.setPublicPath('dist')
mix.setResourceRoot('../')

mix.js('src/js/background.js', 'js')
mix.js('src/js/content.js', 'js')
mix.copy('src/manifest.json', 'dist/manifest.json')
mix.copyDirectory('src/img', 'dist/img')
