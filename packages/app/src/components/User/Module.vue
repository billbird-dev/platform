<script setup lang="ts">
defineProps<{ icon: string; label: string; path: string }>();
</script>
<template>
  <router-link :to="path">
    <div
      class="
        flex flex-col
        py-8
        px-5
        justify-center
        bordered
        items-center
        cursor-pointer
        h-[115px]
        hover:bg-bbg
        transition transition-colors
        duration-300
      "
    >
      <q-icon :name="icon" size="35px" color="blue-grey-9" />
      <div class="text-body text-blue-grey-10">{{ label }}</div>
    </div>
  </router-link>
</template>
