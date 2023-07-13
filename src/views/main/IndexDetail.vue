<script setup>
import { computed, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { useIndexType } from '@/composables/useIndexType'
import { useIndex } from '@/composables/useIndex'
import { useRoute } from 'vue-router'
import IndexCard from '@/components/IndexCard.vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import indexJson from '../../assets/json/index.json'
defineComponent({ name: 'IndexDetail' })
const route = useRoute()
const indexBus = ref(indexJson)
const indexCode = computed(() => {
  return route.query.indexCode
})
const indexName = computed(() => {
  return route.query.indexName
})
const indexTwoBusList = ref([])
const hasChild = computed(() => {
  return indexCode.value.endsWith('0')
})
const childIndex = computed(() => {
  if (hasChild.value) {
    const childIndexNameList = indexBus.value
      .find((index) => index.name == indexName.value)
      ?.child?.map((i) => i.name)
    console.log('childIndexNameList: ', childIndexNameList)
    return indexTwoBusList.value.filter((index) => childIndexNameList.includes(index.swindexname))
  } else {
    return []
  }
})
const { getIndexCurrentByType } = useIndexType()
const { getIndexCurrentData, getIndexTimelinesData, getIndexTimelinesByType } = useIndex({
  indexCode: indexCode.value
})

const currentData = ref({})
const timelinesData = ref([])
const timelinesDay = ref([])
const interval = ref(null)

const indeXTitle = computed(() => {
  return `${currentData.value?.l2} (${currentData.value?.l1})`
})

const fetchDataUpdate = async () => {
  ;[currentData.value, timelinesData.value] = await Promise.all([
    getIndexCurrentData().then(({ data }) => data?.[0] || {}),
    getIndexTimelinesData().then(({ data }) => data || [])
  ])
  hasChild.value &&
    getIndexCurrentByType('二级行业').then(({ data }) => {
      indexTwoBusList.value = data?.results || []
    })
}

const fetchData = async () => {
  fetchDataUpdate()
  timelinesDay.value = await getIndexTimelinesByType('DAY').then(({ data }) => data || [])
}

const activeTabName = ref('time')
const echartInstance = computed(() => {
  return echarts.init(document.getElementById('echart'))
})

const formatTimeData = (timelinesData, base = 0) => {
  let categoryData = []
  let values = []
  let baseLine = Array.from({ length: timelinesData.length }, () => {
    return base
  })
  for (let i = 0; i < timelinesData.length; i++) {
    const item = timelinesData[i]
    categoryData.push(item.trading_time)
    values.push(item.l8)
  }
  return {
    categoryData: categoryData,
    values: values,
    baseLine: baseLine
  }
}
const chartTimeOption = computed(() => {
  const data = formatTimeData(timelinesData.value, currentData.value.l3)

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

const initChart = (activeTab) => {
  switch (activeTab) {
    case 'time':
      initChartTime()
      break
    case 'day':
      initChartDay()
      break
    default:
      break
  }
}
const handleChange = (TabPaneName) => {
  initChart(TabPaneName)
}

onMounted(async () => {
  await fetchData()
  initChart(activeTabName.value)
  interval.value = setInterval(async () => {
    const hour = dayjs().hour()
    if (hour >= 9 && hour < 15) {
      await fetchDataUpdate()
      activeTabName.value == 'time' && initChart(activeTabName.value)
    } else {
      clearInterval(interval.value)
    }
  }, 5000)
})
onBeforeUnmount(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="m-2 flex items-end gap-5">
      <span class="text-2xl font-medium">{{ indeXTitle }}</span>
    </div>
    <index-card :data="currentData"></index-card>
    <el-tabs v-model="activeTabName" type="card" @tab-change="handleChange">
      <el-tab-pane label="Time" name="time"></el-tab-pane>
      <el-tab-pane label="Day" name="day"></el-tab-pane>
    </el-tabs>
    <div id="echart" class="w-full h-[800px]"></div>
    <div class="flex flex-wrap justify-center my-5 w-4/5">
      <index-cube
        v-for="index in childIndex"
        :key="index.swindexcode"
        :data="index"
        class="m-2"
      ></index-cube>
    </div>
  </div>
</template>
