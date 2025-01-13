import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

export default defineConfig((env) => {
  const mode = env.mode as 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera';
  interface ManifestPaths {
    [key: string]: [string, string];
  }

  interface RollupOutputOptions {
    entryFileNames: (chunkInfo: { name: string }) => string;
  }

  interface BuildOptions {
    outDir: string;
    emptyOutDir: boolean;
    rollupOptions: {
      input: {
        index: string;
        background: string;
      };
      output: RollupOutputOptions;
    };
  }

  interface BaseConfig {
    plugins: (ReturnType<typeof react> | {
      name: string;
      closeBundle: () => void;
    })[];
    build: BuildOptions;
  }

    const baseConfig: BaseConfig = {
      plugins: [
        react(),
        {
          name: 'copy-manifest',
          closeBundle() {
            const manifests: ManifestPaths = {
              chrome: ['manifest.chrome.json', 'dist-chrome/manifest.json'],
              firefox: ['manifest.firefox.json', 'dist-firefox/manifest.json'],
              safari: ['manifest.safari.json', 'dist-safari/manifest.json'],
              edge: ['manifest.edge.json', 'dist-edge/manifest.json'],
              opera: ['manifest.opera.json', 'dist-opera/manifest.json'],
            };
            
            if (mode in manifests) {
              const [src, dest] = manifests[mode];
              copyFileSync(src, dest);
            }
          }
        }
      ],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'index.html'),
            background: resolve(__dirname, 'src/background.ts'),
          },
            output: {
              entryFileNames: (chunkInfo) => {
                return chunkInfo.name === 'background' ? 'background.js' : '[name].js';
              }
            
          },
        },
      },
    };

  const platforms = {
    firefox: 'dist-firefox',
    chrome: 'dist-chrome',
    safari: 'dist-safari',
    edge: 'dist-edge',
    opera: 'dist-opera'
  };

  if (mode in platforms) {
    return {
      ...baseConfig,
      build: {
        ...baseConfig.build,
        outDir: platforms[mode],
      },
    };
  }

  return baseConfig;
});
