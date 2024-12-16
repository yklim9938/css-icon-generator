<template>
    <div class="px-4">
        <h1 class="mt-3 text-primary font-bold text-xl sm:text-4xl text-center">CSS Icons Generator</h1>
        <div class="mt-8 mx-auto max-w-[600px]">
            <div role="tablist" class="tabs tabs-boxed">
                <a role="tab" class="tab min-h-8 h-full py-[6px]" :class="{'tab-active' : currentTab == 1}" @click="currentTab=1">Upload svg and png files</a>
                <a role="tab" class="tab min-h-8 h-full py-[6px]" :class="{'tab-active' : currentTab == 2}" @click="currentTab=2">Convert svg code to Data URI</a>
            </div>
            <div class="mt-8">
                   <Upload v-if="currentTab == 1" />                
                   <Convert v-if="currentTab == 2" />                
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const currentTab = ref(1)
</script>
