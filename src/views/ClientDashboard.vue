<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';
import type { Service } from '../types/Service';
import type { ServiceRequest } from '../types/ServiceRequest';

// State 
const availableServices = ref<Service[]>([]);
const myRequests = ref<ServiceRequest[]>([]);
const selectedServiceId = ref<number | null>(null);
const notes = ref('');
const message = ref('');

// Load Data
const loadData = async () => {
    const servicesRes = await apiClient.get<Service[]>('/Services');
    availableServices.value = servicesRes.data;

    const requestsRes = await apiClient.get<ServiceRequest[]>('/Requests/my-requests');
    myRequests.value = requestsRes.data;
};

// Submit Request
const submitRequest = async () => {
    if (!selectedServiceId.value) return;

    try {
        await apiClient.post('/Requests', {
            serviceId: selectedServiceId.value,
            notes: notes.value
        });
        
        message.value = 'Request submitted!';
        notes.value = '';
        selectedServiceId.value = null;
        loadData(); // Refresh list
    } catch (err) {
        message.value = 'Error submitting request.';
    }
};

onMounted(loadData);
</script>

<template>
    <div class="dashboard-container">
        <div class="header">
            <h1>My portal</h1>
            <p>Request new services and track status.</p>
        </div>

        <div class="grid">
            <div class="card">
                <h2>Book a Service</h2>
                <form @submit.prevent="submitRequest">
                    <div class="form-group">
                        <label>Select Service</label>
                        <select v-model="selectedServiceId" required>
                            <option disabled value="">-- Choose --</option>
                            <option v-for="s in availableServices" :key="s.id" :value="s.id" >
                                {{ s.name }} (${{ s.basePrice }})
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Notes / Context</label>
                        <textarea v-model="notes" placeholder="Describe your needs..." rows="3"></textarea>
                    </div>

                    <button type="submit" class="btn-primary">Submit Request</button>
                    <p v-if="message" class="status-msg">{{ message }}</p>
                </form>
            </div>

            <div class="card">
                <h2>History</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in myRequests" :key="r.id">
                            <td>{{ r.serviceName }}</td>
                            <td>{{ new Date(r.createdAt).toLocaleDateString() }}</td>
                            <td>
                                <span :class="['badge', r.status.toLowerCase()]">{{ r.status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
.pending { background: #ffc107; color: #000; }
.completed { background: #28a745; color: #fff; }
.dashboard-container { padding: 2rem; color: #fff; }
.grid { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
.card { background: #1e1e1e; padding: 1.5rem; border-radius: 8px; border: 1px solid #333; }
select, textarea { width: 100%; padding: 0.5rem; background: #2d2d2d; color: white; border: 1px solid #444; margin-bottom: 1rem; }
.btn-primary { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; cursor: pointer; }
.data-table { width: 100%; text-align: left; border-collapse: collapse; }
.data-table td { padding: 0.5rem; border-bottom: 1px solid #333; } 
</style>