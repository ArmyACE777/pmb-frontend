<template>
  <div class="relative w-full h-full">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
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
  horizontal: {
    type: Boolean,
    default: false,
  },
});

const canvasRef = ref(null);
let chartInstance = null;

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
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
    indexAxis: props.horizontal ? 'y' : 'x',
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
    type: 'bar',
    data: props.chartData,
    options: mergedOptions,
  });
};

onMounted(() => {
  renderChart();
});

watch(
  () => [props.chartData, props.horizontal],
  () => {
    if (chartInstance) {
      chartInstance.data = props.chartData;
      chartInstance.options.indexAxis = props.horizontal ? 'y' : 'x';
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
