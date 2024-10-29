<script lang="ts" setup>

import {useAccount, useConnect, useConnectors, useDisconnect} from '@wagmi/vue';
import {Loader2, Unplug}                                      from 'lucide-vue-next';
import {useStavaxAccount}                                     from '~/composables/stavax';

const {status} = useAccount();
const {disconnect} = useDisconnect();
const {connectAsync} = useConnect();
const connectors = useConnectors();

const isConnecting = computed(() => status.value == 'connecting');
const isConnected = computed(() => status.value == 'connected');
const isDisconnected = computed(() => status.value == 'disconnected');

const $stavax = useStavaxAccount();

</script>

<template>
  <div>
    <div v-if="isDisconnected || isConnecting" class="space-y-2">
      <Button
        :disabled="isConnecting"
        class="w-full"
        @click="$stavax.connect()"
      >
        <Loader2 v-if="isConnecting" class="w-4 h-4 mr-2 animate-spin"/>
        <span v-if="isConnecting">Connecting</span>
        <span v-else>Connect wallet</span>
      </Button>
      <div class="flex gap-2">
        <template v-for="connector in connectors" :key="connector.id">
          <Button v-if="connector.id != 'walletConnect'" class="w-full" @click="connectAsync({connector})">
            Connect {{ connector.id }}
          </Button>
        </template>
      </div>
    </div>
    <div v-if="isConnected" class="space-y-2">
      <Button
        class="w-full"
        variant="destructive"
        @click="() => disconnect()"
      >
        <Unplug class="w-4 h-4 mr-2"/>
        Disconnect
      </Button>
    </div>
  </div>
</template>
