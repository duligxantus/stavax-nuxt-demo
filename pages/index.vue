<script lang="ts" setup>
import {useAccount}          from '@wagmi/vue';
import {useWebAppBackButton} from 'vue-tg';
import ConnectButton         from '~/components/ConnectButton.vue';
import MiniApp               from '~/components/MiniApp.vue';
import {Separator}           from '~/components/ui/separator';
import WalletInfo            from '~/components/WalletInfo.vue';

onActivated(() => {
  useWebAppBackButton().hideBackButton();
});

const {isConnected} = useAccount();

</script>

<template>
  <div class="space-y-4">
    <template v-if="isConnected">
      <WalletInfo/>
      <Separator/>
      <SignMessage/>
      <Separator/>
      <SendNativeToken/>
      <MintNFT contract-address="0x924772bb9c9656dc0c588f0e1998f3b6338724fe"
               title="Mint NFT (ERC721)"/>
      <Separator/>
    </template>
    <ConnectButton/>
  </div>
  <MiniApp/>
</template>
