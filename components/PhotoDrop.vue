<template>
    <div class="relative h-full">
        <label :for="id" class="fd-container rounded-md" :class="{ active: dropping }" @dragenter="dragIn" @dragover="dragOver"
            @dragleave="dragOut" @drop="dragOut">
            <div class="fd-inner-container">
                <div class="flex items-center flex-col">
                    <div class="mt-4 relative flex gap-2">
                        <i class="icon-svg size-[60px] text-primary -rotate-6 -translate-y-2"></i>
                        <i class="icon-png size-[60px] text-secondary rotate-6 translate-y-1"></i>
                    </div>
                    <div class="text-primary mt-4">Drop your files here</div>
                </div>
            </div>
        </label>
        <input type="file" style="display: none;" :id="id" accept="image/png, image/svg+xml" @change="handleFiles" multiple>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (event: 'input', payload: FileList): void
}>()

const id = useId()
const dropping = ref(false)

const dragIn = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropping.value = true
}
const dragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
}
const dragOut = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropping.value = false
    if (e.type == 'drop') {
        handleFiles(e)
    }
}

const handleFiles = (e: DragEvent | Event) => {
    let t = null
    if (e instanceof DragEvent) {
        t = e.dataTransfer
    }
    else if (e instanceof Event) {
        t = e.target as HTMLInputElement
    }
    if (t?.files) {
        emit('input', t.files)
    }
}


</script>

<style scoped>
.fd-container {
    @apply border border-primary w-full rounded p-4 cursor-pointer relative flex flex-col min-h-[150px] md:min-h-[200px];
}

.fd-container .fd-inner-container {
    @apply flex-grow border border-dashed border-primary w-full p-6 rounded-sm flex items-center justify-center text-center pointer-events-none;
}

.fd-container.active {
    @apply bg-primary/20;
}
.fd-drop-icon {
    width: 30px;
    height: 30px;
}
</style>