/**
 * Storybook Manager Configuration
 * 
 * Configures the Storybook UI and sidebar organization.
 */

import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'Builder Score Design System',
  brandUrl: '/',
  brandTarget: '_self',
  
  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,
  
  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',
  
  // Text colors
  textColor: '#1f2937',
  textInverseColor: '#ffffff',
  
  // Toolbar default and active colors
  barTextColor: '#6b7280',
  barSelectedColor: '#3b82f6',
  barBg: '#ffffff',
  
  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#1f2937',
  inputBorderRadius: 6,
});

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});

