<script setup lang="ts"></script>

<template>
  <div class="loader">
    <span class="spin">
      <q-spinner-tail color="primary" size="5.5em" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200000;
  background-color: #e3f8fa;
  .spin {
    position: absolute;
    top: calc(50% - 40px);
    left: calc(50% - 40px);
    transform: translate(-50%, -50%);
    margin-right: -50%;
    z-index: 1;
  }
}
</style>
