<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';
import type { Service } from '../types/Service';

const services = ref<Service[]>([]);

onMounted(async () => {
    try{
        const res = await apiClient.get<Service[]>('/Services');
        services.value = res.data;
    } catch (err) { console.error(err); }
});

</script>

<template>
    <div style="padding: 20px;">
        <h1>Available Services</h1>
        <div v-for="s in services" :key="s.id" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
            <h3>{{ s.name }} - <span style="float: right;"> ${{ s.basePrice }} </span></h3>
            <p>{{ s.description }}</p>
        </div>
    </div>
</template>