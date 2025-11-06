import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        '/Users/akash/Downloads/Prosora Deep Research Business report',
        '/Users/akash/.nvm/versions/node/v20.19.3/lib/node_modules/motia/node_modules/@motiadev/workbench',
      ],
    },
  },
})