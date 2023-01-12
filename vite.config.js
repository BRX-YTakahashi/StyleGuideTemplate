import { defineConfig } from 'vite'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars';
import markdoc from 'vite-plugin-markdoc';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

const pageData = {
  '/styleGuide/index.html': {
    title: 'Hello Vite!',
  },
};


export default defineConfig(({ command, mode, ssrBuild }) => {
  console.log(`command: ${command}`);
  console.log(`mode: ${mode}`);

  if (command === "serve") {

    if (mode === "development") {
      return {
        root: './',
        base: './',
        publicDir: '../public',

        server: {
          host: true,
          open: '/src/styleGuide/index.html',
        },

        css: {
          devSourcemap: true
        },

        plugins: [
          handlebars({
            partialDirectory: resolve(__dirname, './src', 'styleGuide/components'),
            context(pagePath) {
              return pageData[pagePath];
            },
          }),
        ]
      }

    } else {
      return {
        root: './',
        base: './',

        server: {
          open: '/styleGuide/index.html',
        },
      }
    }


  } else {
    // command === "build"

    return {
      root: './src',
      base: '/',
      publicDir: '../public',

      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, './src', 'styleGuide/index.html')
          },

          output: {
            assetFileNames: (assetInfo) => {
              let extType = assetInfo.name.split('.')[1];

              if (/png|jpe?g|webp|svg|gif|tiff|bmp|ico/i.test(extType)) {
                extType = 'images';
              }

              if (extType === 'css') {
                return `styleGuide/assets/css/style.css`;
              }

              return `styleGuide/assets/${extType}/[name][extname]`;
            },

            chunkFileNames: 'styleGuide/assets/js/[name].js',

            entryFileNames: 'styleGuide/assets/js/[name].js',
          },
        },

        outDir: '../dist',

        emptyOutDir: true,

        raw: {
          extensions : ['html', 'txt', 'md'],
          glob: ['**.html', '**.md']
        },
      },

      plugins: [
        handlebars({
          partialDirectory: resolve(__dirname, './src', 'styleGuide/components'),
          context(pagePath) {
            return pageData[pagePath];
          },
        }),

        markdoc(),

        ViteMinifyPlugin({}),
      ]
    }
  }
});
