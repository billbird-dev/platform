<script setup lang="ts">
import { ref } from 'vue';

const clicked = ref(false);

defineEmits(['remove']);
</script>

<template>
  <q-btn
    v-if="!clicked"
    label="Remove"
    no-caps
    color="negative"
    unelevated
    @click="clicked = !clicked"
  />
  <template v-else>
    <!-- <span class="text-negative"> Are you sure ? </span> -->
    <q-btn label="Sure" no-caps color="negative" unelevated @click="$emit('remove')" />
    <q-btn
      label="No"
      no-caps
      color="primary"
      text-color="dark"
      unelevated
      @click="clicked = !clicked"
    />
  </template>
</template>
