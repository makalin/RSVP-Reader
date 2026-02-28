import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites at https://<user>.github.io/<repo>/
// Use base: '/' for custom domain or user/org site
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/RSVP-Reader/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
