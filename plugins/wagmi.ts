import {QueryClient, VueQueryPlugin}                from '@tanstack/vue-query';
import {walletConnect}                              from '@wagmi/connectors';
import {createConfig, type CreateConnectorFn, http} from '@wagmi/core';
import {baseSepolia}                                from '@wagmi/core/chains';
import {WagmiPlugin}                                from '@wagmi/vue';

export default defineNuxtPlugin((app) => {
  const publicConfig = useRuntimeConfig().public;
  const config = createConfig({
    chains    : [baseSepolia],
    connectors: [
      walletConnect({
        projectId     : publicConfig.walletConnectProjectId,
        showQrModal   : publicConfig.walletConnectShowModal,
        qrModalOptions: {
          explorerRecommendedWalletIds: ['c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662', 'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a'],
        },
        metadata      : {
          name       : 'Stavax Nuxt Demo',
          description: 'Stavax Nuxt Demo description',
          url        : 'https://stavax-nuxt-demo.pages.dev',
          icons      : ['https://avatars.githubusercontent.com/u/37784886'],
          redirect   : {
            native   : 'tg://',
            universal: 'https://t.me/stv_nuxt_demo_bot',
          },
        },
      }) as CreateConnectorFn,
    ],
    transports: {
      [baseSepolia.id]: http(),
    },
  });

  app.vueApp
    // @ts-ignore
    .use(WagmiPlugin, {config})
    .use(VueQueryPlugin, {queryClient: new QueryClient()});
});
