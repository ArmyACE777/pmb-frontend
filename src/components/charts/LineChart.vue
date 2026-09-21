<template>
  <div class="relative w-full h-full">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const canvasRef = ref(null);
let chartInstance = null;

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12,
        padding: 12,
        font: { family: 'Sora, sans-serif', size: 11, weight: '600' },
        color: '#475569',
      },
    },
    tooltip: {
      backgroundColor: '#0F172A',
      titleFont: { family: 'Sora, sans-serif', size: 12, weight: 'bold' },
      bodyFont: { family: 'sans-serif', size: 11 },
      padding: 10,
      cornerRadius: 10,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { family: 'sans-serif', size: 10 },
        color: '#64748B',
      },
    },
    y: {
      grid: {
        color: '#F1F5F9',
      },
      ticks: {
        font: { family: 'sans-serif', size: 10 },
        color: '#64748B',
        precision: 0,
      },
      beginAtZero: true,
    },
  },
};

const renderChart = () => {
  if (!canvasRef.value) return;
  if (chartInstance) {
    chartInstance.destroy();
  }

  const mergedOptions = {
    ...defaultOptions,
    ...props.options,
    plugins: {
      ...defaultOptions.plugins,
      ...(props.options.plugins || {}),
    },
    scales: {
      ...defaultOptions.scales,
      ...(props.options.scales || {}),
    },
  };

  chartInstance = new Chart(canvasRef.value, {
    type: 'line',
    data: props.chartData,
    options: mergedOptions,
  });
};

onMounted(() => {
  renderChart();
});

watch(
  () => props.chartData,
  () => {
    if (chartInstance) {
      chartInstance.data = props.chartData;
      chartInstance.update();
    } else {
      renderChart();
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>
