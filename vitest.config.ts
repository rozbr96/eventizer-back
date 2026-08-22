
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ['test/**\/*.{test,spec}.?(c|m)[jt]s?(x)'],
    fileParallelism: false,
    setupFiles: ['test/setup.ts']
  }
})

