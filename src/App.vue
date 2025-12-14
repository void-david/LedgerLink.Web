<script setup lang="ts">
  // Logic handled by the views
</script>

<template>
  <div class="app-container">
    <nav style="background: #333; padding: 1rem; margin-bottom: 20px;">
      <router-link to="/" style="color: white; margin-right: 15px; text-decoration: none;">Public Home</router-link>
      <router-link to="/admin" style="color: white; text-decoration: none;">Admin Dashboard</router-link>
    </nav>

    <RouterView />
  </div>
</template>

<style>
  body {margin: 0; font-family: sans-serif;}
</style>