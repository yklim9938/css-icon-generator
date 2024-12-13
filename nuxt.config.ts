// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/icons.css'],
  app: {
    head: {
      meta: [
        {name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover'}
      ]
    }
  }
})