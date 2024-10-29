<template>
   <div>
        <div class="min-h-screen p-6 relative">
            <Header>Convert svg to Data URI</Header>
            <div class="mt-4 mx-auto max-w-[600px]">
                <textarea v-model="codeInput" class="border border-line rounded min-h-[150px] w-full resize-none py-2 px-3 outline-none text-xs" placeholder="Paste your svg code here"></textarea>
                <div class="mt-4">
                    <div class="flex gap-4 flex-col sm:flex-row">
                        <div class="size-[150px] mx-auto flex-shrink-0 border border-line rounded bg-center bg-cover bg-no-repeat flex items-center justify-center" :style="preview">
                            <div v-if="!preview" class="text-xs text-gray-400">Preview</div>
                        </div>
                        <textarea class="bg-content-light rounded border border-light outline-none p-2 text-xs h-[150px] resize-none w-full" disabled placeholder="Output Data URI will be here">{{ dataURI }}</textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <CopyButton :text-to-copy="withUrl" :disabled="!dataURI">Copy with url()</CopyButton>
                        <CopyButton :text-to-copy="dataURI" :disabled="!dataURI">Copy Raw</CopyButton>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </div>
</template>

<script setup>
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
</script>