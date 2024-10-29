<script lang="ts" setup>
import {useAccount, useChains, useSwitchChain} from '@wagmi/vue';

const {address, chainId} = useAccount();
const selectedChainID = ref(`${chainId.value}`);
const chains = useChains();
const {switchChainAsync} = useSwitchChain();

watch(selectedChainID, function (newChain) {
  switchChainAsync({
    chainId: Number(newChain),
  });
});

</script>

<template>
  <div>
    <div class="flex items-center">
      <label class="font-semibold">Chain</label>
    </div>
    <div class="flex flex-col w-full items-center gap-2">
      <Select v-model="selectedChainID">
        <SelectTrigger>
          <SelectValue placeholder="Select Token"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="chain in chains" :key="chain.id" :value="`${chain.id}`">
              {{ chain.id }} - {{ chain.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div>Address:
      <div>
        <Input v-model="address" readonly type="text"/>
      </div>
    </div>
  </div>
</template>
