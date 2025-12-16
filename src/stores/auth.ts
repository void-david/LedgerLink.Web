import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore('auth', () =>{
    // Initialize from LocalStorage so we stay loged in on refresh
    const token = ref(localStorage.getItem('token') || '');
    const userEmail = ref(localStorage.getItem('userEmail') || '');

    const isAutheticated = computed(() => !!token.value);

    function login(newToken: string, email: string){
        token.value = newToken;
        userEmail.value = email;
        // Save to browser local storage
        localStorage.setItem('token', newToken);
        localStorage.setItem('userEmail', email);
    }

    function logout(){
        token.value = '';
        userEmail.value = '';
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
    }

    return { token, userEmail, isAutheticated, login, logout };
});