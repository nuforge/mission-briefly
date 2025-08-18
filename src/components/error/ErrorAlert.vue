<template>
  <v-alert v-if="error" :type="alertType" :variant="variant" :density="density" :closable="closable" class="error-alert"
    @click:close="$emit('close')">
    <template #prepend>
      <v-icon :icon="icon" />
    </template>

    <div class="error-content">
      <div class="error-title" v-if="title">{{ title }}</div>
      <div class="error-message">{{ displayMessage }}</div>
    </div>

    <template #append v-if="showRetry">
      <v-btn variant="text" size="small" @click="$emit('retry')">
        Retry
      </v-btn>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { createUserFriendlyMessage } from '@/errors'
import type { MissionBrieflyError } from '@/errors'

interface Props {
  /** The error to display */
  error: Error | null
  /** Custom title override */
  title?: string
  /** Custom message override */
  message?: string
  /** Alert variant */
  variant?: 'flat' | 'outlined' | 'tonal'
  /** Alert density */
  density?: 'default' | 'comfortable' | 'compact'
  /** Show close button */
  closable?: boolean
  /** Show retry button */
  showRetry?: boolean
  /** Force alert type */
  forceType?: 'error' | 'warning' | 'info' | 'success'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'tonal',
  density: 'default',
  closable: true,
  showRetry: false
})

const emit = defineEmits<{
  close: []
  retry: []
}>()

const alertType = computed(() => {
  if (props.forceType) return props.forceType

  if (!props.error) return 'info'

  if (props.error instanceof Error && 'code' in props.error) {
    const mbError = props.error as MissionBrieflyError
    switch (mbError.code) {
      case 'VALIDATION_ERROR':
        return 'warning'
      case 'NETWORK_ERROR':
        return 'error'
      default:
        return 'error'
    }
  }

  return 'error'
})

const icon = computed(() => {
  switch (alertType.value) {
    case 'warning':
      return 'mdi-alert'
    case 'info':
      return 'mdi-information'
    case 'success':
      return 'mdi-check-circle'
    default:
      return 'mdi-alert-circle'
  }
})

const displayMessage = computed(() => {
  if (props.message) return props.message
  if (!props.error) return ''
  return createUserFriendlyMessage(props.error)
})
</script>

<style scoped>
.error-alert {
  margin: 0.5rem 0;
}

.error-content {
  flex-grow: 1;
}

.error-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.error-message {
  opacity: 0.9;
}
</style>

