<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';
import type { Client } from '../types/Client';

// State
const clients = ref<Client[]>([]);
const isEditing = ref(false);
const message = ref('');

// Empty form
const form = ref({ id: 0, name: '', rfc: '', contactEmail: '', phoneNumber: '' });

// Fetch data
const loadClients = async () => {
  try{
    const res = await apiClient.get<Client[]>('/Clients');
    clients.value = res.data;
  } catch (err) {console.log(err);}
};

// Handle Submit 
const saveClient = async () => {
  try {
    if (isEditing.value){
      // TODO: Update backend logic
    } else {
      // Post
      await apiClient.post('/Clients', form.value);
      message.value = 'Client created successfully';
    }
    resetForm();
    loadClients();
  } catch (err) {
    console.log(err);
    message.value = 'Operation failed. Check console';
  }
}

const resetForm = () => {
  form.value = { id: 0, name: '', rfc: '', contactEmail: '', phoneNumber: '' };
  isEditing.value = false;
  setTimeout(() => message.value = '', 3000);
}

onMounted(loadClients);

</script>

<template>
  <div class="admin-container">
    <div class="header">
      <h1>Client Management</h1>
    </div>

    <div v-if="message" class="alert">{{ message }}</div>
    
    <div class="dashboard-grid">
      <div class="card form-card">
        <h2>Add New Client</h2>
        <form @submit.prevent="saveClient">

          <div class="form-group">
            <label>Company/Client Name</label>
            <input v-model="form.name" required placeholder="e.g. Taqueria el norte"/>
          </div>

          <div class="form-group">
            <label>RFC</label>
            <input v-model="form.rfc" required placeholder="XAXX010101000"/>
          </div>

          <div class="form-group">
            <label>Contact Email</label>
            <input v-model="form.contactEmail" type="email" required placeholder="contacto@gmail.com"/>
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="form.phoneNumber" required placeholder="55 1234 5678"/>
          </div>

          <button type="submit" class="btn btn-primary">Create Client</button>
        </form>
      </div>

      <div class="card list-card">
        <h2>Client Directory</h2>
        <table>
          <thead>
            <tr>
              <th>Name / RFC</th>
              <th>Contact Info</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clients" :key="c.id">
              <td>
                <div class="service-name">{{ c.name }}</div>
                <small>{{ c.rfc }}</small>
              </td>
              <td>
                <div>{{ c.contactEmail }}</div>
                <small>{{ c.phoneNumber }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Dark mode styling */
  .admin-container{
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    color: #e0e0e0;
  }

  .header { margin-bottom: 2rem; border-bottom: 1px solid #333; padding-bottom: 1rem; }
  .subtitle { color: #888; }

  .dashboard-grid{
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2rem;
  }

  .card{
    background: #1e1e1e;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #333;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .form-group { margin-bottom: 1rem; }
  label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #bbb; }
  input, textarea {
    width: 94%;
    padding: 0.75rem;
    background: #2d2d2d;
    border: 1px solid #444;
    color: white;
    border-radius: 4px;
  }
  input:focus, textarea:focus { outline: 2px solid #007bff; border-color: transparent; }

  .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;}
  .btn-primary { background: #007bff; color: white; width: 100%; }
  .btn-primary:hover { background: #0056b3; }
  .btn-secondary { background: #444; color: white; margin-left: 10px; }

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