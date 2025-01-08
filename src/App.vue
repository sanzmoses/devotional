<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Toast from 'primevue/toast'
</script>

<template>
  <Toast />
  <RouterView />
</template>

<style scoped>
.wrapper {
  background-color: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
}

nav a.router-link-active {
  color: var(--primary-color);
}
</style>
