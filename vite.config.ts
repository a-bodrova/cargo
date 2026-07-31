import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})
