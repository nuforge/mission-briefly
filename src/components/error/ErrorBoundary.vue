<template>
    <div class="error-boundary">
        <slot v-if="!hasError" />
        <div v-else class="error-display">
            <v-alert :type="alertType" :title="errorTitle" :text="errorMessage" variant="tonal" closable
                @click:close="clearError">
                <template #prepend>
                    <v-icon :icon="errorIcon" />
                </template>
                <template #append>
                    <v-btn v-if="showRetry" variant="outlined" size="small" @click="retry">
                        Retry
                    </v-btn>
                    <v-btn v-if="showDetails" variant="text" size="small" @click="toggleDetails">
                        {{ showingDetails ? 'Hide Details' : 'Show Details' }}
                    </v-btn>
                </template>
            </v-alert>

            <v-expand-transition>
                <v-card v-if="showingDetails && error" class="mt-4 error-details" variant="outlined">
                    <v-card-title class="text-error">
                        Error Details
                    </v-card-title>
                    <v-card-text>
                        <pre class="error-stack">{{ errorDetails }}</pre>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn variant="outlined" size="small" @click="copyErrorDetails">
                            Copy Details
                        </v-btn>
                        <v-btn variant="outlined" size="small" @click="reportError">
                            Report Issue
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-expand-transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onErrorCaptured } from 'vue'
import { handleError, createUserFriendlyMessage, LogLevel } from '@/errors'
import type { MissionBrieflyError } from '@/errors'

interface Props {
    /** Show retry button */
    showRetry?: boolean
    /** Show error details toggle */
    showDetails?: boolean
    /** Custom error message */
    fallbackMessage?: string
    /** Alert type override */
    alertType?: 'error' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
    showRetry: true,
    showDetails: true,
    fallbackMessage: 'An unexpected error occurred',
    alertType: 'error'
})

const emit = defineEmits<{
    error: [error: Error]
    retry: []
    cleared: []
}>()

const hasError = ref(false)
const error = ref<Error | null>(null)
const showingDetails = ref(false)

const errorTitle = computed(() => {
    if (!error.value) return 'Error'

    if (error.value instanceof Error && 'code' in error.value) {
        const mbError = error.value as MissionBrieflyError
        switch (mbError.code) {
            case 'VALIDATION_ERROR':
                return 'Invalid Input'
            case 'CHARACTER_ERROR':
                return 'Character Error'
            case 'SHIP_ERROR':
                return 'Ship Error'
            case 'MISSION_ERROR':
                return 'Mission Error'
            case 'NETWORK_ERROR':
                return 'Connection Error'
            default:
                return 'Error'
        }
    }

    return 'Error'
})

const errorMessage = computed(() => {
    if (!error.value) return props.fallbackMessage
    return createUserFriendlyMessage(error.value)
})

const errorIcon = computed(() => {
    switch (props.alertType) {
        case 'warning':
            return 'mdi-alert'
        case 'info':
            return 'mdi-information'
        default:
            return 'mdi-alert-circle'
    }
})

const errorDetails = computed(() => {
    if (!error.value) return ''

    const details: any = {
        name: error.value.name,
        message: error.value.message,
        stack: error.value.stack,
        timestamp: new Date().toISOString(),
    }

    if (error.value instanceof Error && 'code' in error.value) {
        const mbError = error.value as MissionBrieflyError
        details.code = mbError.code
        details.context = mbError.context
    }

    return JSON.stringify(details, null, 2)
})

// Error boundary functionality
onErrorCaptured((err: Error) => {
    captureError(err)
    return false // Prevent error from bubbling up
})

// Handle unhandled promise rejections
onMounted(() => {
    window.addEventListener('unhandledrejection', (event) => {
        captureError(new Error(event.reason))
    })
})

function captureError(err: Error) {
    error.value = err
    hasError.value = true

    // Log the error
    handleError(err, { component: 'ErrorBoundary' }, LogLevel.ERROR)

    // Emit error event
    emit('error', err)
}

function clearError() {
    hasError.value = false
    error.value = null
    showingDetails.value = false
    emit('cleared')
}

function retry() {
    clearError()
    emit('retry')
}

function toggleDetails() {
    showingDetails.value = !showingDetails.value
}

function copyErrorDetails() {
    if (navigator.clipboard && errorDetails.value) {
        navigator.clipboard.writeText(errorDetails.value)
            .then(() => {
                // Could show a success message here
                console.log('Error details copied to clipboard')
            })
            .catch((err) => {
                console.error('Failed to copy error details:', err)
            })
    }
}

function reportError() {
    // In a real application, this would send the error to a reporting service
    console.log('Error reporting triggered:', errorDetails.value)

    // Could open a modal, send to an endpoint, etc.
    // For now, just log it
}

// Expose functions for external use
defineExpose({
    captureError,
    clearError,
    hasError: computed(() => hasError.value),
    error: computed(() => error.value)
})
</script>

<style scoped>
.error-boundary {
    width: 100%;
}

.error-display {
    margin: 1rem 0;
}

.error-details {
    max-width: 100%;
}

.error-stack {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.875rem;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 300px;
    overflow-y: auto;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 1rem;
    border-radius: 4px;
    margin: 0;
}

@media (prefers-color-scheme: dark) {
    .error-stack {
        background-color: rgba(255, 255, 255, 0.05);
    }
}
</style>
