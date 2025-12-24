<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="logo">LedgerLink</div>

      <div class="nav-links">
        <router-link to="/">Home</router-link>

        <template v-if="!authStore.isAutheticated">
          <router-link to="/login">Login</router-link>
          <router-link to="/register" class="btn-register">Register</router-link>
        </template>

        <template v-if="authStore.isClient">
          <router-link to="/dashboard">My Portal</router-link>
        </template>

        <template v-if="authStore.isAdmin">
          <router-link to="/admin">Requests</router-link>
          <router-link to="/clients">Clients DB</router-link>
        </template>

        <button v-if="authStore.isAutheticated" @click="handleLogout" class="btn-logout">
          Logout
        </button>
      </div>
    </nav>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Base Layout */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar Styling */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: #fff;
  letter-spacing: 1px;
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: #ccc;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: #fff;
}

/* Buttons */
.btn-register {
  background: #007bff;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  transition: background 0.2s;
}

.btn-register:hover {
  background: #0056b3;
}

.btn-logout {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #dc3545;
  color: white;
}

.content {
  padding: 2rem;
  flex: 1;
}


</style>

<style>
/* Global Resets */
body { margin: 0; font-family: 'Inter', sans-serif; background-color: #121212; color: white; }
</style>