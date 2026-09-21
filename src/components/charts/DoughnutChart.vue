<template>
  <div class="relative w-full h-full flex flex-col items-center justify-center">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

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
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 14,
        font: {
          family: 'Sora, Inter, sans-serif',
          size: 11,
          weight: '600',
        },
        color: '#475569',
      },
    },
    tooltip: {
      backgroundColor: '#0F172A',
      titleFont: { family: 'Sora, sans-serif', size: 12, weight: 'bold' },
      bodyFont: { family: 'sans-serif', size: 11 },
      padding: 10,
      cornerRadius: 10,
      displayColors: true,
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
  };

  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
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
