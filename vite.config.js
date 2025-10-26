import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    console.log('is serve');
  } else {
    console.log('is build');
  }
  return {
    base: '/',
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: true,
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      open: true,
      port: 9527,
      host: '0.0.0.0',
      proxy: {

      },
    },
    // 全局Scss变量
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/styles/define.scss";`,
        },
      },
    },
  };
});
