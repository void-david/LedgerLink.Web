<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import apiClient from '../api/axios';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try{
      // Call the API
      const response = await apiClient.post('/Auth/login', {
        email: email.value,
        password: password.value
      });

      // Save token to store (sessionStorage)
      authStore.login(response.data.token, response.data.email, response.data.role);
      
      // Save role to sessionStorage
      sessionStorage.setItem('userRole', response.data.role);

      // ROUTING LOGIC based on the role we just received
      if (response.data.role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard'); // Redirects clients to their portal
      }
  } catch (err){
      error.value = 'Invalid email or password';
  }
};
</script>

<template>
    <div class="login-container">
      <div class="login-card">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required placeholder="example@ledgerlink.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="password" type="password" required />
          </div>
          <button type="submit" class="btn-primary">Login</button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
</template>

<style scoped>
.login-container{ display: flex; justify-content: center; align-items: center; height: 80vh; }
.login-card{ background: #1e1e1e; padding: 2rem; border-radius: 8px; width: 300px; border: 1px solid #333; }
.form-group{ margin-bottom: 1rem; }
label{ display: block; margin-bottom: 0.5rem; color: #ccc; }
input{ width: 94%; padding: 0.5rem; background: #2d2d2d; border: 1px solid #444; color: white; }
.btn-primary{ width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; cursor: pointer; margin-top: 10px;  }
.error{ color: #ff6b6b; margin-top: 1rem; text-align: center; }
</style>