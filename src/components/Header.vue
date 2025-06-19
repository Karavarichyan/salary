<template>
  <header class="w-full bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
    <h1 class="text-xl font-semibold"> Dynamic Tables</h1>
    <nav class="flex space-x-4">
      <router-link
        to="/"
        class="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Home
      </router-link>
      <router-link
        to="/tables"
        class="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Show All Tables
      </router-link>
    </nav>
  </header>
</template>

<script setup>
</script>
