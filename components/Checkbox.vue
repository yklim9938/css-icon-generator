<template>
    <div class="o-checkbox-wrapper" :class="{reverse: reverse}">
        <div class="o-checkbox" :class="{'o-switch': $props.switch, checked: shouldCheck}" 
        @click="toggle" 
        :style="{fontSize: size ? `${size}px` : '1.125rem'}">
    </div>
        <input type="checkbox" :checked="shouldCheck" style="display:none;" :required="required">
        <label class="o-checkbox-label" @click="toggle"><slot></slot></label>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: [Boolean, Array],
        required: true
    },
    value: [String, Number],
    switch: Boolean,
    required: Boolean,
    size: Number,
    reverse: Boolean
})

const emit = defineEmits(['update:modelValue'])

const shouldCheck = computed(() => {
    if (typeof props.modelValue == 'boolean') return props.modelValue
    if (Array.isArray(props.modelValue) && props.value) return (props.modelValue.indexOf(props.value) > -1)
    return false
})

const toggle = () => {
    if (typeof props.modelValue == 'boolean') {
        emit('update:modelValue', !props.modelValue)
        return
    }
    if (Array.isArray(props.modelValue) && props.value) {
        if (props.modelValue.indexOf(props.value) > -1) { // in modelValue, remove it
            emit('update:modelValue', props.modelValue.filter(v => v != props.value))
        }
        else { // not in modelValue, add it
            emit('update:modelValue', [...props.modelValue, ...[props.value]])
        }
    }
}
</script>

<style scoped>
.o-checkbox-wrapper {
    display: flex;
    align-items: center;
}

.o-checkbox {
    width: 1em;
    height: 1em;
    border-radius: 4px;
    display: inline-block;
    vertical-align: middle;
    border: 1px solid var(--checkbox-border-color);
    background-color: var(--checbox-bg);
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
    flex-shrink: 0;
    box-shadow: var(--o-shadow);
}

.o-checkbox.checked {
    background-color: var(--primary);
}

.o-checkbox::after {
    content: "";
    position: absolute;
    top: calc(50% - 0.04em);
    left: 50%;
    transform: translate(-50%, -50%) rotate(38deg) scale(0);
    width: 0.35em;
    height: 0.6em;
    border-right: 0.18em solid var(--tick-color);
    border-bottom: 0.18em solid var(--tick-color);
    transition: all 0.15s;
    box-sizing: border-box;
    box-shadow: var(--o-shadow);
}

.o-checkbox.checked::after {
    transform: translate(-50%, -50%) rotate(38deg) scale(1);
}

.o-checkbox.o-switch {
    width: 2em;
    border-radius: 1em;
}

.o-checkbox.o-switch::after {
    width: 0.7em;
    height: 0.7em;
    border-radius: 50%;
    border: none;
    background-color: var(--switch-thumb);
    top: 50%;
    left: calc(0% + 0.1em);
    transform: translateY(-50%);
}

.o-checkbox.o-switch.checked::after {
    left: calc(100% - 0.8em);
    background-color: var(--switch-thumb-checked);
}

.o-checkbox.checked.disabled {
    background-color: var(--o-primary-light);
}

.o-checkbox-label {
    display: inline-block;
    margin-left: 0.75em;
    cursor: pointer;
    line-height: 1;
}

.o-checkbox-wrapper.reverse {
    flex-direction: row-reverse;
}

.o-checkbox-wrapper.reverse .o-checkbox-label {
    margin-right: 0.75em;
    margin-left: 0;
}
</style>
