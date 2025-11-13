/**
 * Storybook Main Configuration
 * 
 * Configures Storybook for Atomic Design component documentation.
 */

import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/presentation/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/presentation/**/*.story.@(js|jsx|ts|tsx|mdx)',
  ],
  
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  
  docs: {
    autodocs: 'tag',
  },
  
  staticDirs: ['../public'],
  
  webpackFinal: async (config) => {
    // Add path aliases
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../'),
        '@domain': path.resolve(__dirname, '../src/domain'),
        '@infrastructure': path.resolve(__dirname, '../src/infrastructure'),
        '@presentation': path.resolve(__dirname, '../src/presentation'),
        '@components': path.resolve(__dirname, '../src/presentation/components'),
        '@atoms': path.resolve(__dirname, '../src/presentation/components/atoms'),
        '@molecules': path.resolve(__dirname, '../src/presentation/components/molecules'),
        '@organisms': path.resolve(__dirname, '../src/presentation/components/organisms'),
        '@templates': path.resolve(__dirname, '../src/presentation/components/templates'),
        '@features': path.resolve(__dirname, '../src/presentation/features'),
      };
    }
    
    return config;
  },
};

export default config;

