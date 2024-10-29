// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: false},

  app: {
    head: {
      script: [
        {src: 'https://telegram.org/js/telegram-web-app.js', async: false},
      ],
    },
  },

  ssr: false,

  nitro: {
    preset: 'cloudflare-pages-static',
    hooks : {
      async compiled(nitro) {
        // Override compiled hook to skip generate empty _redirect file which cause cloudflare error
      },
    },
  },

  devServer: {
    host : process.env.VITE_SSL_KEY_PATH ? 'stv-nuxt-demo.abc' : undefined,
    https: process.env.VITE_SSL_KEY_PATH ? {
      key : process.env.VITE_SSL_KEY_PATH,
      cert: process.env.VITE_SSL_CERT_PATH,
    } : undefined,
  },

  runtimeConfig: {
    public: {
      walletConnectShowModal: false,
      walletConnectProjectId: '',
      stavaxProjectId       : '',
    },
  },

  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },

  compatibilityDate: '2024-10-29',
});
