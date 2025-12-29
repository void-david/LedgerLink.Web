<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';
import type { Service } from '../types/Service';
import type { ServiceRequest } from '../types/ServiceRequest';

// State
const services = ref<Service[]>([]);
const requests = ref<ServiceRequest[]>([]);
const isEditing = ref(false);
const form = ref({ id: 0, name: '', description: '', basePrice: 0 });
const message = ref('');
const selectedRequest = ref<ServiceRequest | null>(null);
const showModal = ref(false);

const openRequest = (req: ServiceRequest) => {
  selectedRequest.value = req;
  showModal.value = true;
}

// Download files logic
const downloadFile = async(docId: number, fileName: string) => {
  try {
    // Request the file as Blob (Binary Large Object)
    const response = await apiClient.get(`/Documents/${docId}`, {
      responseType: 'blob'
    });

    // Create a temporary link to trigger browser's download process
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Force the filename
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Download failed", err);
    alert("Failed to download the file.");
  }
};

// Fetch Data (Services)
const loadServices = async () => {
  const res = await apiClient.get<Service[]>('/Services');
  services.value = res.data;
};

// Fetch Requests
const loadRequests = async () => {
  try {
    const res = await apiClient.get<ServiceRequest[]>('/Requests');
    requests.value = res.data;
  } catch (err) {
    console.log("Error loading requests", err);
  }
};

// Update status of a request
const updateStatus = async (id: number, newStatus: number) => {
  try {
    await apiClient.put(`/Requests/${id}/status`, { id, newStatus });
    loadRequests();

    // Close modal if open to refresh state or reload the data
    if (selectedRequest.value?.id === id){
      // Update the local selected request status immediately for ui feedback
      selectedRequest.value.status = newStatus === 1 ? 'InReview' : 'Completed';
    }

  } catch (err) {
    console.log(err);
    alert("Failed to update status");
  }
};


// Handle Submit (Create OR Update)
const saveService = async () => {
  try{
    if (isEditing.value){
      await apiClient.put(`/Services/${form.value.id}`, form.value);
      message.value = 'Updated successfully!';
    } else {
      await apiClient.post('/Services', form.value);
      message.value = 'Created successfully!';
    }
    resetForm();
    loadServices(); // Refresh list
  } catch (err) {
    console.error(err);
    message.value = 'Operation failed.';
  }
};

// Handle Delete
const deleteService = async (id: number) => {
  if (!confirm('Are you sure you want to delete this service?')) return;
  try {
    await apiClient.delete(`/Services/${id}`);
    loadServices();
  } catch (err) { console.error(err); }
};

// Handle Edit Click
const editService = (service: Service) => {
  form.value = { ...service }; // Copy data to form
  isEditing.value = true;
};

// Utility
const resetForm = () => {
  form.value = { id: 0, name: '', description: '', basePrice: 0 };
  isEditing.value = false;
  setTimeout(() => message.value = '', 3000);
};

onMounted(() => {
  loadServices();
  loadRequests();
});
 
</script>

<template>
  <div class="admin-container">
    <div class="header">
      <h1>Admin Dashboard</h1>
      <p class="subtitle">Manage your accounting services</p>
    </div>

    <div v-if="message" class="alert">{{ message }}</div>

    <div class="card" style="margin-bottom: 2rem;">
      <h2>Incoming Requests</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in requests" :key="r.id">
            <td @click="openRequest(r)" style="cursor: pointer; color: #007bff; text-decoration: underline;">
              {{ r.clientName }}
            </td>
            <td>{{ r.serviceName }}</td>
            <td>{{ new Date(r.createdAt).toLocaleDateString() }}</td>
            <td>
              <span :class="['badge', r.status.toLowerCase()]">{{ r.status }}</span>
            </td>
            <td>
              <button v-if="r.status === 'Pending'" @click="updateStatus(r.id, 1)" class="btn-sm">Review</button>
              <button v-if="r.status === 'InReview'" @click="updateStatus(r.id, 2)" class="btn-sm success">Complete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="requests.length === 0" style="color: #888; margin-top: 10px;">No pending requests.</p> 
    </div>

    <div class="dashboard-grid">
      <div class="card form-card">
        <h2>{{ isEditing ? 'Edit Service' : 'Add New Service' }}</h2>
        <form @submit.prevent="saveService">
          <div class="form-group">
            <label>Service Name</label>
            <input v-model="form.name" placeholder="e.g. Tax Audit"/>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" required rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Price ($)</label>
            <input type="number" v-model="form.basePrice" required min="0" step="0.01">            
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Update Service' : 'Create Service' }}
            </button>
            <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div class="card list-card">
        <h2>Existing Services</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in services" :key="s.id">
              <td>
                <div class="service-name">{{ s.name }}</div>
                <small>{{ s.description }}</small>
              </td>
              <td>${{ s.basePrice }}</td>
              <td class="actions">
                <button @click="editService(s)" class="btn-icon edit">✎</button>
                <button @click="deleteService(s.id)" class="btn-icon delete">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal-content">
      <h2>Request Details</h2>
      <div v-if="selectedRequest">
        <p><strong>Client:</strong> {{ selectedRequest.clientName }}</p>
        <p><strong>Service:</strong> {{ selectedRequest.serviceName }}</p>
        <p><strong>Date:</strong> {{ new Date(selectedRequest.createdAt).toLocaleString() }}</p>

        <hr />

        <h3>Client Notes:</h3>
        <p class="notes-box">{{ selectedRequest.notes || "No notes provided." }}</p>

        <hr />

        <h3>Attached Documents:</h3>
        <div v-if="selectedRequest.documents && selectedRequest.documents.length > 0">
          <ul class="doc-list">
            <li v-for="doc in selectedRequest.documents" :key="doc.id">
              <span>📄 {{ doc.fileName }}</span>
              <button @click="downloadFile(doc.id, doc.fileName)" class="btn-download">Download</button>
            </li>
          </ul>
        </div>
        <p v-else class="no-docs">No documents attached.</p>

        <hr />

        <h3>Manage Status:</h3>
        <div class="status-actions">
          <button @click="updateStatus(selectedRequest.id, 0)" class="btn-sm pending">Mark Pending</button>
          <button @click="updateStatus(selectedRequest.id, 1)" class="btn-sm review">Mark In Review</button>
          <button @click="updateStatus(selectedRequest.id, 2)" class="btn-sm success">Mark Completed</button>
        </div>

        <button class="btn-close" @click="showModal = false">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Modal Styles */
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .modal-content { background: #1e1e1e; padding: 2rem; border-radius: 8px; width: 500px; max-width: 90%; border: 1px solid #444; color: white; }
  
  .notes-box { background: #2d2d2d; padding: 1rem; border-radius: 4px; font-style: italic; color: #ccc; margin-bottom: 1rem; }
  
  /* Document List Styles */
  .doc-list { list-style: none; padding: 0; margin-bottom: 1rem; }
  .doc-list li { display: flex; justify-content: space-between; align-items: center; background: #2d2d2d; padding: 0.5rem; margin-bottom: 0.5rem; border-radius: 4px; border: 1px solid #444; }
  .btn-download { background: #17a2b8; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
  .btn-download:hover { background: #138496; }
  .no-docs { color: #888; font-style: italic; margin-bottom: 1rem; }

  .status-actions { display: flex; gap: 10px; margin-bottom: 20px; }
  .btn-close { width: 100%; padding: 10px; background: #444; border: none; color: white; cursor: pointer; }
  .btn-close:hover { background: #555; }

  /* Main Container */
  .admin-container{ max-width: 1200px; margin: 0 auto; padding: 2rem; color: #e0e0e0; }
  .header { margin-bottom: 2rem; border-bottom: 1px solid #333; padding-bottom: 1rem; }
  .subtitle { color: #888; }

  /* Dashboard Grid */
  .dashboard-grid{ display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; }
  .card{ background: #1e1e1e; padding: 1.5rem; border-radius: 8px; border: 1px solid #333; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); }

  /* Status Badges */
  .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
  .pending { background: #ffc107; color: black; }
  .inreview { background: #17a2b8; color: white; }
  .completed { background: #28a745; color: white; }
  
  /* Buttons */
  .btn-sm { padding: 5px 10px; font-size: 0.8rem; margin-right: 5px; cursor: pointer; border-radius: 4px; border:none; background: #007bff; color: white; }
  .btn-sm.success { background-color: #28a745; }
  .btn-sm.pending { background-color: #ffc107; color: black; }
  .btn-sm.review { background-color: #17a2b8; }

  /* Forms */
  .form-group { margin-bottom: 1rem; }
  label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #bbb; }
  input, textarea { width: 94%; padding: 0.75rem; background: #2d2d2d; border: 1px solid #444; color: white; border-radius: 4px; }
  input:focus, textarea:focus { outline: 2px solid #007bff; border-color: transparent; }

  .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;}
  .btn-primary { background: #007bff; color: white; width: 100%; }
  .btn-primary:hover { background: #0056b3; }
  .btn-secondary { background: #444; color: white; margin-left: 10px; }

  /* Tables */
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { text-align: left;  border-bottom: 1px solid #444; padding: 0.5rem; color: #888; }
  .data-table td { padding: 0.75rem 0.5rem; border-bottom: 1px solid #2a2a2a; }
  .service-name { font-weight: bold; color: #fff; }

  .actions { display: flex; gap: 0.5rem; }
  .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
  .edit { color: #ffc107; }
  .delete { color: #dc3545; }
  .alert { background: #28a745; color: white; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }

  @media (max-width: 768px){
    .dashboard-grid { grid-template-columns: 1fr; }
  }
</style>