<template>
  <div>
    <Pie :data="chartData" :options="chartOptions" />
    <div class="text-center mt-4 font-semibold text-lg">
      Total Income: {{ props.initialIncome }} <br />
      Total Expenses: {{ totalExpenses }} <br />
      Remaining: {{ remainingIncome }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js'
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  tableName: string
  initialIncome: number
  columns: { name: string; amount: number; type: 'income' | 'expense' }[]
}>()

const totalExpenses = computed(() => {
  return props.columns
    .filter(c => c.type === 'expense')
    .reduce((sum, c) => sum + c.amount, 0)
})

const remainingIncome = computed(() => {
  const remaining = props.initialIncome - totalExpenses.value
  return remaining > 0 ? remaining : 0
})

const chartData = computed(() => {
  if (totalExpenses.value === 0) {
    return {
      labels: ['Income'],
      datasets: [
        {
          data: [props.initialIncome],
          backgroundColor: ['#22c55e'],
          borderWidth: 1,
        },
      ],
    }
  }

  return {
    labels: ['Remaining Income', 'Expenses'],
    datasets: [
      {
        data: [remainingIncome.value, totalExpenses.value],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'right' as const },
    title: { display: true, text: 'Income vs Expenses' },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || ''
          const value = context.parsed || 0
          return `${label}: ${value}`
        },
      },
    },
  },
}
</script>
