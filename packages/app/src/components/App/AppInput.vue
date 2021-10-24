<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true,
  },
  standout: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
  lazyRules: {
    type: Boolean,
    default: true,
  },
  dense: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    rquired: false,
  },
  mobileNum: {
    type: Boolean,
    required: false,
  },
  modelValue: {
    type: [String, Number],
    required: false,
  },
  modelModifiers: {
    default: () => ({} as Record<string, any>),
    required: false,
  },
  noErrorIcon: {
    type: Boolean,
    default: true,
  },
  min: {
    type: Number,
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    required: false,
  },
  autogrow: {
    type: Boolean,
    required: false,
  },
  numeric: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: false,
  },
  labelFromName: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <q-input
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :standout="standout"
    :placeholder="placeholder"
    :lazy-rules="lazyRules"
    :rules="[
      min && ((val) => (val && parseInt(val) >= min) || `${name} can't be less than ${min}.`),
      required && ((val) => (val && val.toString().length > 0) || `${name} is required.`),
      mobileNum &&
        ((val) => (val && val.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)) || `Invalid mobile number.`),
      numeric && ((val) => (val && val.match(/^[1-9]\d*$/)) || `${name} can only be a number.`),
    ]"
    :dense="dense"
    :type="type"
    :no-error-icon="noErrorIcon"
    :min="min"
    @keydown.tab="$emit('tab', $event)"
    @change="$emit('change', $event)"
    :readonly="readonly"
    :disable="disable"
    :hint="hint"
    :autogrow="autogrow"
    :label="labelFromName ? name : label"
    label-color="dark"
  />
</template>
