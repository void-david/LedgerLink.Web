import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore('auth', () =>{
    // Initialize from sessionStorage so we stay loged in on refresh
    const token = ref(sessionStorage.getItem('token') || '');
    const userEmail = ref(sessionStorage.getItem('userEmail') || '');

    const role = ref(sessionStorage.getItem('userRole') || '');

    const isAutheticated = computed(() => !!token.value);
    const isAdmin = computed(() => role.value === 'Admin');
    const isClient = computed(() => role.value === 'Client');

    function login(newToken: string, email: string, newRole: string){
        token.value = newToken;
        userEmail.value = email;
        role.value = newRole;
        // Save to browser local storage
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userRole', newRole);
    }

    function logout(){
        token.value = '';
        userEmail.value = '';
        role.value = '';

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userRole');
    }

    return { token, userEmail, role, isAutheticated, isAdmin, isClient, login, logout };
});