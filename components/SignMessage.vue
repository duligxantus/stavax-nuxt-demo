<script lang="ts" setup>
import {verifyMessage, verifyTypedData}                          from '@wagmi/core';
import {useAccount, useConfig, useSignMessage, useSignTypedData} from '@wagmi/vue';
import {BadgeCheck, Loader2}                                     from 'lucide-vue-next';
import {useWebAppPopup}                                          from 'vue-tg';
import {useStavaxAccount}                                        from '~/composables/stavax';

const {showAlert} = useWebAppPopup();

const {address} = useAccount();
const {signMessageAsync} = useSignMessage();
const {signTypedDataAsync} = useSignTypedData();
const wagmiConfig = useConfig();

const signature = ref('');
const messageToSign = ref('Hello World!');
const isValidSignature = ref(false);
const isSigning = ref(false);

const $stavax = useStavaxAccount();

async function signMessage(mode: 'personal' | 'typed') {
  if (isSigning.value || !messageToSign.value) {
    return;
  }
  try {
    isSigning.value = true;
    isValidSignature.value = false;
    signature.value = '';

    $stavax.openTgBotForInteractWithDelay();

    const message = messageToSign.value;
    const typedDataPayload = {
      types      : {
        Message: [
          {name: 'contents', type: 'string'},
        ],
      },
      primaryType: 'Message',
      message    : {
        contents: message,
      },
    };
    signature.value = await (mode == 'personal' ? signMessageAsync({message}) : signTypedDataAsync(typedDataPayload));
    console.log(signature.value);
    isValidSignature.value = await (mode == 'personal' ? verifyMessage(wagmiConfig, {
      message,
      address  : address.value,
      signature: signature.value,
    }) : verifyTypedData(wagmiConfig, {
      ...typedDataPayload,
      address  : address.value,
      signature: signature.value,
    }));
  } catch (err) {
    console.error(err);
    showAlert(err.message || err.toString());
  } finally {
    isSigning.value = false;
  }
}
</script>

<template>
  <div class="space-y-2">
    <label class="font-semibold">Personal Sign message</label>
    <div class="flex flex-col w-full items-center gap-2">
      <Input v-model="messageToSign" :disabled="isSigning" class="flex-1" placeholder="Message" type="text"/>
      <Button :disabled="isSigning || messageToSign == ''" class="w-full" @click="signMessage('personal')">
        <Loader2 v-if="isSigning" class="w-4 h-4 mr-2 animate-spin"/>
        Personal sign
      </Button>
      <Button :disabled="isSigning || messageToSign == ''" class="w-full" @click="signMessage('typed')">
        <Loader2 v-if="isSigning" class="w-4 h-4 mr-2 animate-spin"/>
        Sign typed message
      </Button>
    </div>
    <div v-if="signature">
      <div class="flex items-center">
        <label class="font-semibold">Signature</label>
        <BadgeCheck v-if="isValidSignature" class="w-4 h-4 ml-1 text-blue-600"/>
      </div>
      <div>
        <Input v-model="signature" readonly type="text"/>
      </div>
    </div>
  </div>
</template>
