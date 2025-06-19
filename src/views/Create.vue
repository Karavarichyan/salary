<template>
  <div class="p-6 flex gap-6">
    <div class="w-2/3">
      <h2 class="text-3xl font-bold mb-6">Create Monthly Table</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block mb-2 font-semibold">Table Name</label>
          <input
            v-model="tableName"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. May 2025"
            required
          />
        </div>

        <div>
          <label class="block mb-2 font-semibold">Initial Income</label>
          <input
            v-model.number="initialIncome"
            type="number"
            class="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. 1000"
            required
          />
        </div>

        <button
          type="button"
          @click="addColumn"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Column
        </button>

        <div
          v-for="(column, index) in columns"
          :key="index"
          class="border p-4 rounded mt-4"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold">Column {{ index + 1 }}</h3>
            <button
              type="button"
              @click="removeColumn(index)"
              class="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <input
            v-model="column.name"
            type="text"
            placeholder="Column Name"
            class="w-full mb-2 border px-3 py-2 rounded"
            required
          />

          <input
            v-model.number="column.amount"
            type="number"
            placeholder="Amount"
            class="w-full mb-2 border px-3 py-2 rounded"
            required
          />

          <select
            v-model="column.type"
            class="w-full border px-3 py-2 rounded"
            required
          >
            <option disabled value="">Select type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mt-4"
        >
          Save Table
        </button>
      </form>
    </div>

    <div class="w-1/3">
      <IncomeExpensePie
        v-if="columns.length > 0"
        :columns="validColumns"
        :tableName="tableName"
        :initialIncome="initialIncome"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { v4 as uuidv4 } from 'uuid'
import { computed, reactive, ref } from 'vue'
import IncomeExpensePie from '../components/IncomeExpensePie.vue'

interface Column {
  name: string
  amount: number
  type: 'income' | 'expense' | ''
}

const tableName = ref('')
const initialIncome = ref(0)
const columns = reactive<Column[]>([])

const validColumns = computed(() =>
  columns.filter(
    (c): c is { name: string; amount: number; type: 'income' | 'expense' } =>
      c.type === 'income' || c.type === 'expense'
  )
)

const addColumn = () => {
  columns.push({ name: '', amount: 0, type: '' })
}

const removeColumn = (index: number) => {
  columns.splice(index, 1)
}

const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: async (newTable: any) => {
    const existing = JSON.parse(localStorage.getItem('tables') || '[]')
    existing.push(newTable)
    localStorage.setItem('tables', JSON.stringify(existing))
    return newTable
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tables'] })
    alert('Table saved successfully!')
  },
})

const handleSubmit = () => {
  if (!tableName.value || columns.length === 0) return

  const newTable = {
    id: uuidv4(),
    name: tableName.value,
    initialIncome: initialIncome.value,
    columns: JSON.parse(JSON.stringify(columns)),
    createdAt: new Date().toISOString(),
  }

  mutation.mutate(newTable)

  tableName.value = ''
  initialIncome.value = 0
  columns.splice(0)
}
</script>
