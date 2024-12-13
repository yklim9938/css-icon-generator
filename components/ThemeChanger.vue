<template>
    <label class="flex items-center cursor-pointer gap-2">
        <i class="icon-light text-xl" :class="{'text-primary' : !darkTheme}"></i>
        <input type="checkbox" value="dark" class="toggle toggle-primary" v-model="darkTheme" />
        <i class="icon-dark text-xl" :class="{'text-primary' : darkTheme}"></i>
    </label>
</template>

<script setup>
const darkTheme = ref(true)

onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
        if (window.matchMedia && !(window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            darkTheme.value = false
        }
    }
    else {
        if (savedTheme == 'light') {
            darkTheme.value = false
        }
    }
    document.documentElement.dataset.theme = darkTheme.value ? 'dark' : 'light'
})

watch(darkTheme, (isDark) => {
    if (isDark) {
        document.documentElement.dataset.theme = 'dark'
        localStorage.setItem('theme', 'dark')
    }
    else {
        document.documentElement.dataset.theme = 'light'
        localStorage.setItem('theme', 'light')
    }
})
</script>