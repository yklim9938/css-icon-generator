<template>
    <Teleport to="body">
        <div class="v-modal-overlay" :class="{show: show}">
            <div class="v-modal-wrapper"  @click="closeModal" ref="wrapper">
                <div 
                    class="v-modal-content"
                    :class="containerClass"
                    :style="{maxWidth: `${maxWidth}px`}"
                >
                    <button v-if="!hideCloseBtn" class="v-modal-close" @click="emit('close')">&times;</button>
                    <slot />

                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const {disableScroll, enableScroll} = useBodyScroll()
const props = defineProps({
    show: Boolean,
    clickClose: Boolean,
    containerClass: String,
    hideCloseBtn: {
        type: Boolean,
        default: false
    },
    maxWidth: {
        type: Number,
        default: 500
    }
})

const emit = defineEmits(['close'])
const wrapper = ref()
const closeModal = (e) => {
    if (props.clickClose && e.target == wrapper.value) {
        emit('close')
    }
}

const detectClose = (e) => {
    if (e.key == 'Escape') {
        emit('close')
    }
}


watch(() => props.show, (isShown) => {
    if (isShown) {
        document.addEventListener('keyup', detectClose)
        disableScroll()
    }
    else  {
        document.removeEventListener('keyup', detectClose)
        enableScroll()
    }
})

onBeforeUnmount(() => {
    if (props.show) {
        document.removeEventListener('keyup', detectClose)
        enableScroll()
    }
})
</script>


<style scoped>
.v-modal-overlay {
    height: var(--window-height);
    position: fixed;
    background-color: rgba(0,0,0,0.3);
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 1050;
    overflow: hidden;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s;
    backdrop-filter: blur(5px);
}

.v-modal-wrapper {
    position: relative;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
}

.v-modal-overlay.show {
    visibility: visible;
    opacity: 1;
}

.v-modal-content {
    background: var(--bg-modal);
    overflow-y: auto;
    max-height: 100%;
    transition: all 0.1s;
    transform: translateY(70px);
    position: relative;
    padding: 16px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    width: 100%;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.v-modal-overlay.show .v-modal-content {
    transform: translateY(0);
}

@media screen and (min-width: 640px) {
    .v-modal-content {
        padding: 20px;
    }
}

@media screen and (max-width: 767.999px) {
    .v-modal-content {
        max-width: 100% !important;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }
}

@media screen and (min-width: 768px) {
    .v-modal-wrapper {
        padding: 15px;
        align-items: center;
    }
}

.v-modal-close {
    font-size: 1.875rem;
    line-height: 1;
    position: absolute;
    right: 16px;
    top: 16px;
}

@media screen and (min-width: 640px) {
    .v-modal-close {
        right: 20px;
    }
}
</style>