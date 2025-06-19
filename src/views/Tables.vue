<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold mb-6">All Tables</h2>

    <ul class="space-y-4">
      <li
        v-for="table in tables"
        :key="table.id"
        class="border p-4 rounded shadow hover:bg-gray-100 transition"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-lg font-semibold">{{ table.name }}</p>
            <p class="text-sm text-gray-500">
              Created: {{ formatDate(table.createdAt) }}
            </p>
          </div>
          <router-link
            :to="`/tables/${table.id}/edit`"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const tables = computed(() => {
  const data = localStorage.getItem('tables')
  return data ? JSON.parse(data) : []
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
</script>
