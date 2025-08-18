<script setup lang="ts">

const emit = defineEmits<{
  close: []
}>()

defineProps({
  text: String,
  icon: String,
  color: String,
  size: {
    type: String,
    default: 'small'
  },
  variant: {
    type: String as () => 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain',
    default: 'text'
  },
  closable: {
    type: Boolean,
    default: false
  }
})

const handleClose = () => {
  emit('close')
}

</script>


<template>
  <!--
    IMPORTANT: Only use prepend slot for icons to avoid conflicts.
    Do not set :icon or :prepend-icon props on v-chip when using custom icon slot.
  -->
  <v-chip class="overflow-visible" :text="text" :color="color" label :variant="variant" :size="size"
    :closable="closable" @click:close="handleClose">
    <template #prepend v-if="icon">
      <v-icon :color="color" :size="size">{{ icon }}</v-icon>
    </template>
  </v-chip>
</template>
