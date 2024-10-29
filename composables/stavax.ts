import {StavaxAccount} from '@stavaxio/account-sdk';
import {useConfig}     from '@wagmi/vue';

export function useStavaxAccount(): StavaxAccount {
  const runtimeConfig = useRuntimeConfig();

  return new StavaxAccount({
    projectID: runtimeConfig.public.stavaxProjectId,
    // @ts-expect-error
    wagmiConfig: useConfig(),
  });
}
