import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore('auth', () =>{
    // Initialize from sessionStorage so we stay loged in on refresh
    const token = ref(sessionStorage.getItem('token') || '');
    const userEmail = ref(sessionStorage.getItem('userEmail') || '');

    const isAutheticated = computed(() => !!token.value);

    function login(newToken: string, email: string){
        token.value = newToken;
        userEmail.value = email;
        // Save to browser local storage
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('userEmail', email);
    }

    function logout(){
        token.value = '';
        userEmail.value = '';
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userEmail');
    }

    return { token, userEmail, isAutheticated, login, logout };
});