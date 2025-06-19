<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-700">
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
      @click="goToCreate"
    >
      Create New Table
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goToCreate = () => router.push('/create')
</script>
