<template>
     <!-- <button @click="copyCode" class="text-sm bg-primary py-2 px-4 w-full text-white disabled:opacity-40" :disabled="disabled"> -->
     <button @click="copyCode" :disabled="disabled">
        <slot v-if="!copying" />
        <span v-else>Copied!</span>
    </button>
</template>

<script setup lang="ts">
interface Props {
    textToCopy?: string,
    disabled?: boolean
}
const props = defineProps<Props>()
const copying = ref(false)
const copyCode = async () => {
    if (!props.textToCopy || copying.value) {
        return
    }
    try {
        await navigator.clipboard.writeText(props.textToCopy)
        copying.value = true
        setTimeout(() => {
            copying.value = false
        }, 1000)
    }
    catch (err) {
        console.log(err)
    }
}
</script>