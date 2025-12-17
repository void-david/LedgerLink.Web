import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import LoginView from '../views/LoginView.vue';
import { useAuthStore } from '../stores/auth';
import ClientsView from '../views/ClientsView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView }, // Add Login
    { path: '/admin', name: 'admin', component: AdminDashboard, meta: { requiresAuth: true } }, // Mark as protected
    { path: '/clients', name: 'clients', component: ClientsView, meta: { requiresAuth: true } }
]
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAutheticated) {
        next('/login'); // Redirect to login if not authenticated
    } else {
        next();
    }

});

export default router;
