<template>
    <div>
        <h2 class="text-center text-lg font-semibold">Convert svg to Data URI.</h2>
        <div class="mt-4 mx-auto">
            <textarea v-model="codeInput" class="textarea textarea-primary textarea-xs min-h-[150px] w-full resize-none" placeholder="Paste your svg code here"></textarea>
            <div class="mt-4">
                <div class="flex gap-4 flex-col sm:flex-row">
                    <div class="size-[150px] mx-auto flex-shrink-0 border border-secondary rounded-lg bg-center bg-contain bg-no-repeat flex items-center justify-center" :style="preview">
                        <div v-if="!preview" class="text-xs text-gray-400">Preview</div>
                        <i v-else class="preview-icon size-[150px] cursor-pointer" ref="previewIcon" onclick="this.classList.toggle('color')"></i>
                    </div>
                    <textarea class="textarea textarea-bordered  textarea-xs !border-accent h-[150px] resize-none w-full" disabled placeholder="Output Data URI will be here">{{ dataURI }}</textarea>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <CopyButton class="btn btn-primary" :text-to-copy="withUrl" :disabled="!dataURI">Copy with url()</CopyButton>
                    <CopyButton class="btn btn-secondary" :text-to-copy="dataURI" :disabled="!dataURI">Copy Raw</CopyButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import svg2DataURI from '~/assets/js/svg2data-uri';

const codeInput = ref('')

const dataURI = computed(() => {
    if (!codeInput.value) {
        return ''
    }
    return svg2DataURI(codeInput.value)
})

const withUrl = computed(() => {
    if (!dataURI.value) {
        return ''
    }
    return `url("${dataURI.value}")`
})

const preview = computed(() => {
    if (!withUrl.value) {
        return undefined
    }
    return {
        backgroundImage: withUrl.value
    }
})

const previewIcon = ref()
watch(dataURI, () => {
    nextTick(() => {
        if (previewIcon.value) {
            previewIcon.value.style.setProperty('--svg', withUrl.value)
        }
    })
})
</script>