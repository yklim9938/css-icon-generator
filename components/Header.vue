<template>
     <h1 class="text-center pt-4 text-3xl sm:text-4xl font-bold text-primary">CSS Icons Generator</h1>
    <div class="grid sm:grid-cols-2 mx-auto  max-w-[600px] mt-6">
        <NuxtLink to="/" class="tab-link">Upload svg and png files</NuxtLink>
        <NuxtLink to="/data-uri" class="tab-link">Convert svg code to Data URI</NuxtLink>
    </div>
    <h2 class="text-center mt-8 font-medium text-sm sm:text-base"><slot /></h2>
</template>

<style scoped>
.tab-link {
  text-align: center;
  font-size: 0.87rem;
  padding: 0.625em 1em;
  border: 1px solid var(--line);
}

.tab-link:first-child {
  border-radius: 4px 0 0 4px;
}

.tab-link:last-child {
  border-radius: 0 4px 4px 0;
}


.tab-link.router-link-exact-active {
  background-color: var(--primary);
  color: white;
  border: 1px solid var(--primary);
}
</style>