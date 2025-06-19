<template>
  <div class="p-6 flex gap-6">
    <div class="w-2/3">
      <h2 class="text-3xl font-bold mb-6">Edit Table</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block mb-2 font-semibold">Table Name</label>
          <input
            v-model="tableName"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label class="block mb-2 font-semibold">Initial Income</label>
          <input
            v-model.number="initialIncome"
            type="number"
            class="w-full border border-gray-300 rounded px-3 py-2"
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
          Save Changes
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IncomeExpensePie from '../components/IncomeExpensePie.vue'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

const validColumns = computed(() =>
  columns.filter(
    (c): c is { name: string; amount: number; type: 'income' | 'expense' } =>
      c.type === 'income' || c.type === 'expense'
  )
)
const tableId = route.params.id as string

const tableName = ref('')
const initialIncome = ref(0)

interface Column {
  name: string
  amount: number
  type: 'income' | 'expense' | ''
}

const columns = reactive<Column[]>([])

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('tables') || '[]')
  const table = stored.find((t: any) => t.id === tableId)

  if (table) {
    tableName.value = table.name
    initialIncome.value = table.initialIncome
    columns.splice(0, columns.length, ...table.columns)
  } else {
    alert('Table not found')
    router.push('/tables')
  }
})

const addColumn = () => {
  columns.push({ name: '', amount: 0, type: '' })
}

const removeColumn = (index: number) => {
  columns.splice(index, 1)
}

const mutation = useMutation({
  mutationFn: async (updatedTable: any) => {
    const stored = JSON.parse(localStorage.getItem('tables') || '[]')
    const updated = stored.map((t: any) =>
      t.id === tableId ? updatedTable : t
    )
    localStorage.setItem('tables', JSON.stringify(updated))
    return updatedTable
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tables'] })
    alert('Table updated!')
    router.push('/tables')
  },
})

const handleSubmit = () => {
  if (!tableName.value || columns.length === 0) return

  const updatedTable = {
    id: tableId,
    name: tableName.value,
    initialIncome: initialIncome.value,
    columns: JSON.parse(JSON.stringify(columns)),
    updatedAt: new Date().toISOString(),
  }

  mutation.mutate(updatedTable)
}
</script>
