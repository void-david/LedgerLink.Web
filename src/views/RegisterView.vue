<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/axios';

const form = ref({ email: '', password: '', fullName: '' });
const error = ref('');
const router = useRouter();

const handleRegister = async () => {
    try{
        await apiClient.post('/Auth/register', form.value);
        // After success, go to login
        router.push('/login');
    } catch (err: any){
        error.value = err.response?.data || 'Registration failed';
    }
}
</script>

<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Create Account</h2>
            <p class="subtitle">Join LedgerLink to manage your taxes.</p>

            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label>Full Name</label>
                    <input v-model="form.fullName" required placeholder="John Doe" />
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input v-model="form.email" type="email" required placeholder="you@gmail.com" />
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input v-model="form.password" type="password" required />
                </div>

                <button type="submit" class="btn-primary">Sign Up</button>
            </form>

            <p class="footer-link">
                Already have an account? <router-link to="/login">Login here</router-link>
            </p>
            <p v-if="error" class="error">{{ error }}</p>
        </div>
    </div>
</template>

<style scoped>
/* Reuse your Login styles here for consistency */
.auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
.auth-card { background: #1e1e1e; padding: 2rem; border-radius: 12px; width: 100%; max-width: 350px; border: 1px solid #333; }
.subtitle { color: #888; margin-bottom: 1.5rem; font-size: 0.9rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; color: #ccc; font-size: 0.85rem; }
input { width: 94%; padding: 0.75rem; background: #2d2d2d; border: 1px solid #444; color: white; border-radius: 6px; }
input:focus { outline: 2px solid #007bff; border-color: transparent; }
.btn-primary { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 1rem; }
.btn-primary:hover { background: #0056b3; }
.footer-link { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: #888; }
.footer-link a { color: #007bff; text-decoration: none; }
.error { color: #ff6b6b; margin-top: 1rem; text-align: center; font-size: 0.9rem; }
</style>