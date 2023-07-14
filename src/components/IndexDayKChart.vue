<script setup>
import { defineComponent, computed, onMounted, ref, watch } from 'vue'
import { useIndex } from '../composables/useIndex'
import * as echarts from 'echarts'

defineComponent({ name: 'IndexDayKChart' })
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
const timelinesDay = ref([])
const { getIndexTimelinesByType } = useIndex({
  indexCode: indexCode.value
})
const fetchData = async () => {
  loading.value = true
  timelinesDay.value = await getIndexTimelinesByType('DAY', indexCode.value).then(
    ({ data }) => data || []
  )
  loading.value = false
}

const echartInstance = computed(() => {
  return echarts.init(document.getElementById('echarts'))
})

const formatDayData = (timelinesDay) => {
  let categoryData = []
  let values = []
  let volumes = []
  for (let i = 0; i < timelinesDay.length; i++) {
    const item = timelinesDay[i]
    categoryData.push(item.bargaindate)
    values.push([
      item.openindex,
      item.closeindex,
      item.minindex,
      item.maxindex,
      item.hike,
      item.markup
    ])
    volumes.push([i, item.bargainamount, item.openindex > item.closeindex ? 1 : -1])
  }
  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes
  }
}
const calculateMA = (dayCount, data) => {
  var result = []
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    var sum = 0
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1]
    }
    result.push(+(sum / dayCount).toFixed(3))
  }
  return result
}

const upColor = '#00da3c'
const downColor = '#ec0000'

const chartDayOption = computed(() => {
  const data = formatDayData(timelinesDay.value)
  return {
    animation: false,
    title: {
      text: 'Day K-Line',
      left: '10%'
    },
    legend: {
      bottom: 10,
      left: 'center',
      data: ['index', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000'
      },
      position: function (pos, params, el, elRect, size) {
        const obj = {
          top: 10
        }
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
        return obj
      }
      // extraCssText: 'width: 170px'
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
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
    brush: {
      xAxisIndex: 'all',
      brushLink: 'all',
      outOfBrush: {
        colorAlpha: 0.1
      }
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: downColor
        },
        {
          value: -1,
          color: upColor
        }
      ]
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '50%'
      },
      {
        left: '10%',
        right: '8%',
        top: '63%',
        height: '16%'
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 98,
        end: 100
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: 98,
        end: 100
      }
    ],
    series: [
      {
        name: 'index',
        type: 'candlestick',
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes
      }
    ]
  }
})

const initChartDay = () => {
  echartInstance.value.setOption(chartDayOption.value, true)
}

watch(
  () => indexCode.value,
  async () => {
    await fetchData()
    initChartDay()
  }
)

onMounted(async () => {
  await fetchData()
  initChartDay()
})
</script>
<template>
  <div id="echarts" v-loading="loading"></div>
</template>