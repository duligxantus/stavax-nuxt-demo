<script lang="ts" setup>
import {useAccount, useBalance, useWaitForTransactionReceipt} from '@wagmi/vue';
import {BadgeCheck, CircleX, Loader2}                         from 'lucide-vue-next';
import {formatUnits, type Hex, parseEther}                    from 'viem';
import {useWebAppPopup}                                       from 'vue-tg';
import {useStavaxAccount}                                     from '~/composables/stavax';
import {toNumber}                                             from '~/lib/utils';

const {showAlert} = useWebAppPopup();

const {address} = useAccount();

const txHash = ref<Hex>();
const toAddress = ref<Hex>();
const sendAmount = ref<number>(0);
const isSending = ref(false);

const {data: balanceData, isFetched: isFetchedBalance} = useBalance({
  address,
});

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

async function sendNativeToken() {
  if (isSending.value) {
    return;
  }
  try {
    isSending.value = true;
    txHash.value = undefined;

    const amount = toNumber(sendAmount.value);
    txHash.value = await $stavax.sendTransaction({
      to   : toAddress.value,
      value: parseEther(amount.toString()),
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
      <label class="font-semibold">Send Native Token</label>
      <div v-if="isFetchedBalance && balanceData">
        &nbsp;| Balance: {{ formatUnits(balanceData.value, balanceData.decimals) }} {{ balanceData.symbol }}
      </div>
    </div>
    <div class="flex flex-col w-full items-center gap-2">
      <Input v-model="toAddress" :disabled="isSending" placeholder="To Address" type="text"/>
      <Input v-model="sendAmount" :disabled="isSending" inputmode="decimal" placeholder="Amount" type="text"/>
      <Button :disabled="isSending || !toAddress || txReceiptStatus == 'pending'"
              class="w-full"
              @click="sendNativeToken">
        <Loader2 v-if="isSending || txReceiptStatus == 'pending'" class="w-4 h-4 mr-2 animate-spin"/>
        Send
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
