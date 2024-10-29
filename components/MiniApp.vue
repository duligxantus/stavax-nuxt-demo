<script lang="ts" setup>
import {BackButton, ExpandedViewport, useWebApp} from 'vue-tg';

const router = useRouter();
const route = useRoute();
const isBackButtonVisible = ref<boolean>(false);
watch(() => route.fullPath, function () {
  isBackButtonVisible.value = history.state && !!history.state.back;
});
const {platform, version} = useWebApp();
</script>

<template>
  <BackButton :visible="isBackButtonVisible" @click="router.back()"></BackButton>
  <ExpandedViewport/>
  <div class="text-center mt-2">Telegram Mini App - Platform {{ platform }} - v{{ version }}</div>
</template>
