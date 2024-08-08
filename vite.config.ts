import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    viteCompression({
      algorithm: 'gzip',
      threshold: 204800,
      verbose: false,
      deleteOriginFile: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // 入口文件名
        entryFileNames: 'assets/js/[name].js',
        // // 块文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // // 资源文件名 css 图片等等
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // id.toString().split('node_modules/')[1].split('/')[0].toString() 取到这个名字是.pnpm，在linux系统中无法读取
            return id
              .toString()
              .split('node_modules/.pnpm/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    },
  },
  server: {
    host: true,
    port: 12001,
    proxy: {
      '^/myblog_api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['vue'],
  },
})
