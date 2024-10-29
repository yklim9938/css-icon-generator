<template>
    <div class="made-by z-[3]">Made by <a href="https://github.com/yklim9938" class="underline text-primary" target="_blank">YK Lim</a></div>
</template>

<style scoped>
.made-by {
    position: absolute;
    bottom: 16px;
    font-size: 14px;
    left: 50%;
    transform: translateX(-50%);
    display: none;
}

@media screen and (min-height: 614px) {
    .made-by {
        display: block
    }
}

</style>