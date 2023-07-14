<script setup>
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useIndex } from '@/composables/useIndex'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

defineComponent({ name: 'IndexTimeChart' })
const props = defineProps({
  code: {
    type: String,
    required: true
  }
})
const indexCode = computed(() => {
  return props.code
})

const loading = ref(true)
const timelinesData = ref([])
const { getIndexTimelinesData } = useIndex({
  indexCode: indexCode.value
})

const fetchData = async () => {
  loading.value = true
  timelinesData.value = await getIndexTimelinesData(indexCode.value).then(({ data }) => data || [])
  loading.value = false
}
const echartInstance = computed(() => {
  return echarts.init(document.getElementById('echarts'))
})

const formatTimeData = (timelinesData) => {
  let categoryData = []
  let values = []
  for (let i = 0; i < timelinesData.length; i++) {
    const item = timelinesData[i]
    categoryData.push(item.trading_time)
    values.push(item.l8)
  }
  return {
    categoryData: categoryData,
    values: values
  }
}
const chartTimeOption = computed(() => {
  const data = formatTimeData(timelinesData.value)

  return {
    title: {
      text: 'Time Line',
      left: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      bottom: 10,
      left: 'center',
      data: ['Index']
    },
    grid: {
      left: '10%',
      right: '8%',
      bottom: '8%',
      containLabel: true
    },
    toolbox: {
      right: '8%',
      feature: {
        saveAsImage: {},
        dataZoom: {
          yAxisIndex: false
        },
        brush: {
          type: ['lineX', 'clear']
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.categoryData
    },
    yAxis: {
      type: 'value',
      scale: true
    },
    series: [
      {
        name: 'Index',
        type: 'line',
        showSymbol: false,
        data: data.values
      }
    ]
  }
})

const initChartTime = () => {
  echartInstance.value.setOption(chartTimeOption.value, true)
}

watch(
  () => indexCode.value,
  async () => {
    await fetchData()
    initChartTime()
  }
)

const interval = ref(null)
onMounted(async () => {
  await fetchData()
  initChartTime()
  interval.value = setInterval(async () => {
    const hour = dayjs().hour()
    if (hour >= 9 && hour < 15) {
      await fetchData()
      initChartTime()
    } else {
      clearInterval(interval.value)
    }
  }, 60000)
})
onBeforeUnmount(() => {
  clearInterval(interval.value)
})
</script>
<template>
  <div id="echarts" v-loading="loading"></div>
</template>
