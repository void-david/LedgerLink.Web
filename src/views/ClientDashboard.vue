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
const selectedFile = ref<File | null>(null);

// Load Data
const loadData = async () => {
    try {
        const servicesRes = await apiClient.get<Service[]>('/Services');
        availableServices.value = servicesRes.data;

        const requestsRes = await apiClient.get<ServiceRequest[]>('/Requests/my-requests');
        myRequests.value = requestsRes.data;
    } catch (err) {
        console.error("Failed to load data", err);
    }
};

// Handle file selection
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0){
        selectedFile.value = target.files[0] || null;
    }
};

// Submit Request
const submitRequest = async () => {
    if (!selectedServiceId.value) return;

    try {
        message.value = 'Submitting...';

        // Step 1: Create the service request
        const res = await apiClient.post<number>('/Requests',{
            serviceId: selectedServiceId.value,
            notes: notes.value
        });

        const newRequestId = res.data;

        // Step 2: Upload file
        if (selectedFile.value) {
            const formData = new FormData();
            formData.append('serviceRequestId', newRequestId.toString());
            formData.append('file', selectedFile.value);

            await apiClient.post('/Documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        message.value = 'Request submitted successfully!';

        // Reset Form
        notes.value = '';
        selectedServiceId.value = null;
        selectedFile.value = null;

        // Reset file input visually
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        loadData();
    } catch (err) {
        console.error(err);
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

                    <div class="form-group">
                        <label>Attach Documents (PDF/XML)</label>
                        <input 
                            type="file"
                            @change="handleFileChange"
                            accept=".pdf,.xml,.png,.jpg"
                            class="file-input"
                        />
                        <small style="color: #aaa; display: block; margin-top: 5px;">
                            Optional. Max 10MB.
                        </small>
                    </div>

                    <button type="submit" class="btn-primary" :disabled="!selectedServiceId">
                        Submit Request
                    </button>
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
                <p v-if="myRequests.length === 0" style="color: #888; margin-top: 1rem;">No history found.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
.pending { background: #ffc107; color: #000; }
.inreview { background: #17a2b8; color: #fff; }
.completed { background: #28a745; color: #fff; }

.dashboard-container { padding: 2rem; color: #fff; }
.grid { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
.card { background: #1e1e1e; padding: 1.5rem; border-radius: 8px; border: 1px solid #333; }

.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #ccc; }

select { width: 100%; padding: 0.5rem; background: #2d2d2d; color: white; border: 1px solid #444; }
textarea { width: 95%; padding: 0.5rem; background: #2d2d2d; color: white; border: 1px solid #444; }

/* File Input Styling */
.file-input {
    width: 100%;
    padding: 0.5rem;
    background: #2d2d2d;
    border: 1px dashed #555;
    color: #ccc;
    cursor: pointer;
}

.btn-primary { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold; }
.btn-primary:disabled { background: #555; cursor: not-allowed; }
.btn-primary:hover:not(:disabled) { background: #0056b3; }

.status-msg { margin-top: 10px; font-weight: bold; color: #28a745; }

.data-table { width: 100%; text-align: left; border-collapse: collapse; }
.data-table th { border-bottom: 1px solid #444; padding: 0.5rem; color: #888; }
.data-table td { padding: 0.5rem; border-bottom: 1px solid #333; } 

@media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; }
}
</style>