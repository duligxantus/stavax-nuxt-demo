<script lang="ts" setup>

import {useWaitForTransactionReceipt} from '@wagmi/vue';
import {BadgeCheck, CircleX, Loader2} from 'lucide-vue-next';
import {type Hex}                     from 'viem';
import {useWebAppPopup}               from 'vue-tg';
import {useStavaxAccount}             from '~/composables/stavax';

const props = defineProps<{ contractAddress: Hex, title: string }>();

const abi = [
  {
    inputs         : [],
    name           : 'mint',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
] as const;

const {showAlert} = useWebAppPopup();

const txHash = ref<Hex>();
const isSending = ref(false);
const isSuccessTransaction = ref(false);

const {data: txReceipt} = useWaitForTransactionReceipt({
  hash: txHash,
});

const txReceiptStatus = computed(() => {
  if (!txHash.value) {
    return '';
  }

  if (!txReceipt.value) {
    return 'pending';
  }
  return txReceipt.value.status;
});

const $stavax = useStavaxAccount();

async function mint() {
  if (isSending.value) {
    return;
  }
  try {
    isSending.value = true;
    txHash.value = undefined;
    isSuccessTransaction.value = false;

    txHash.value = await $stavax.writeContract({
      abi         : abi,
      address     : props.contractAddress,
      functionName: 'mint',
    });

    console.log(txHash.value);
  } catch (err: any) {
    console.error(err);
    showAlert(err.message || err.toString());
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center">
      <label class="font-semibold">{{ title }}</label>
    </div>
    <div class="flex flex-col w-full items-center gap-2">
      <Button :disabled="isSending || txReceiptStatus == 'pending'"
              class="w-full"
              @click="mint">
        <Loader2 v-if="isSending || txReceiptStatus == 'pending'" class="w-4 h-4 mr-2 animate-spin"/>
        Mint
      </Button>
    </div>
    <div v-if="txHash">
      <div class="flex items-center">
        <label class="font-semibold">TxHash</label>
        <Loader2 v-if="txReceiptStatus == 'pending'" class="w-4 h-4 mr-2 ml-1 animate-spin"/>
        <BadgeCheck v-else-if="txReceiptStatus == 'success'" class="w-4 h-4 ml-1 text-blue-600"/>
        <CircleX v-else class="w-4 h-4 ml-1 text-red-500"/>
      </div>
      <div>
        <Input v-model="txHash" readonly type="text"/>
      </div>
    </div>
  </div>
</template>
