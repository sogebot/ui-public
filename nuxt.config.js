import fs from 'fs';

const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr:    false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title:         'sogeBot public page',
    htmlAttrs:     { lang: 'en' },
    meta:          [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description', name: 'description', content: '',
      },
    ],
    link: [{
      rel: 'icon', type: 'image/x-icon', href: '/favicon.ico',
    }],
  },

  env: {
    isNuxtDev: process.env.NODE_ENV === 'development', BUILD: 'web', version,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/onscroll',
    '@/plugins/composition-api',
    { src: '@/plugins/log-version.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    ['@nuxtjs/vuetify', { treeShake: true }],
  ],

  vuetify: {
    icons:      { iconfont: 'mdiSvg' },
    breakpoint: { mobileBreakpoint: 'sm' },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: { extractCSS: true },

  router: { mode: 'hash' },
};
