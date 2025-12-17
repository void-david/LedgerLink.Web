<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';
import type { Client } from '../types/Client';

// State
const clients = ref<Client[]>([]);
const isEditing = ref(false);
const form = ref({ id: 0, name: '', rfc: '', email: '' });
const message = ref('');

// Fetch Data
const loadClients = async () => {
  const res = await apiClient.get<Client[]>('/Clients');
  clients.value = res.data;
};

// Handle Submit (Create OR Update)
const saveClient = async () => {
  try{
    if (isEditing.value){
      await apiClient.put(`/Clients/${form.value.id}`, form.value);
      message.value = 'Updated successfully!';
    } else {
      await apiClient.post('/Clients', form.value );
      message.value = 'Created successfully!';
    }
    resetForm();
    loadClients(); // Refresh list
  } catch (err) {
    console.error(err);
    message.value = 'Operation failed.';
  }
};

// Handle Delete
const deleteClient = async (id: number) => {
  if (!confirm('Are you sure you want to delete this client?')) return;
  try {
    await apiClient.delete(`/Clients/${id}`);
    loadClients();
  } catch (err) { console.error(err); }
};

// Handle Edit Click
const editClient = (client: Client) => {
  form.value = { ...client }; // Copy data to form
  isEditing.value = true;
};

// Utility
const resetForm = () => {
  form.value = { id: 0, name: '', rfc: '', email: '' };
  isEditing.value = false;
  setTimeout(() => message.value = '', 3000);
};

onMounted(loadClients);
 
</script>

<template>
  <div class="admin-container">
    <div class="header">
      <h1>Admin Create Client Dashboard</h1>
      <p class="subtitle">Manage your Clients</p>
    </div>

    <div v-if="message" class="alert">{{ message }}</div>

    <div class="dashboard-grid">
      <div class="card form-card">
        <h2>{{ isEditing ? 'Edit Client' : 'Add New Client' }}</h2>
        <form @submit.prevent="saveClient">
          <div class="form-group">
            <label>Client Name</label>
            <input v-model="form.name" placeholder="e.g. Fulano Lopez"/>
          </div>

          <div class="form-group">
            <label>Rfc</label>
            <textarea v-model="form.rfc"></textarea>
          </div>

          <div class="form-group">
            <label>Client Email</label>
            <textarea v-model="form.email"></textarea>          
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Update Client' : 'Create Client' }}
            </button>
            <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div class="card list-card">
        <h2>Existing Clients</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Rfc</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clients" :key="c.id">
              <td>
                <div class="service-name">{{ c.name }}</div>
                <small>{{ c.email }}</small>
              </td>
              <td>${{ c.rfc }}</td>
              <td class="actions">
                <button @click="editClient(c)" class="btn-icon edit">✎</button>
                <button @click="deleteClient(c.id)" class="btn-icon delete">🗑</button>
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