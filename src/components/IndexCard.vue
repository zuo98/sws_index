<script setup>
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useIndex } from '@/composables/useIndex'
import dayjs from 'dayjs'
import { INDEX_COLOR } from '@/constants/dictionary'
defineComponent({ name: 'IndexCard' })
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
const currentData = ref({})
const { getIndexCurrentData } = useIndex({
  indexCode: indexCode.value
})
const fetchData = async () => {
  currentData.value = {}
  loading.value = true
  currentData.value = await getIndexCurrentData(indexCode.value).then(({ data }) => data?.[0] || {})
  loading.value = false
}

watch(
  () => indexCode.value,
  () => {
    fetchData()
  }
)
const interval = ref(null)
onMounted(async () => {
  await fetchData()
  interval.value = setInterval(async () => {
    const hour = dayjs().hour()
    if (hour >= 9 && hour < 15) {
      await fetchData()
    } else {
      clearInterval(interval.value)
    }
  }, 60000)
})
onBeforeUnmount(() => {
  clearInterval(interval.value)
})

const indexTitle = computed(() => {
  return `${currentData.value.l2} (${currentData.value.l1})`
})

const indexDelta = computed(() => {
  return Number(currentData.value.l8) - Number(currentData.value.l3)
})

const indexDeltaRate = computed(() => {
  return (Number(indexDelta.value) / Number(currentData.value.l3)) * 100
})

const textColor = computed(() => {
  return indexDelta.value > 0 ? INDEX_COLOR.UP : INDEX_COLOR.DOWN
})

const currentFormat = computed(() => {
  return [
    {
      label: '今开',
      value: Number(currentData.value.l4)
    },
    {
      label: '最高',
      value: Number(currentData.value.l6)
    },
    {
      label: '成交量（百万股）',
      value: Number(currentData.value.l11)
    },
    {
      label: '指数涨幅',
      value: Number(indexDeltaRate.value)
    },
    {
      label: '昨收',
      value: Number(currentData.value.l3)
    },
    {
      label: '最低',
      value: Number(currentData.value.l7)
    },
    {
      label: '成交额（百万元）',
      value: Number(currentData.value.l5)
    }
  ]
})
</script>

<template>
  <el-card shadow="hover" class="w-3/5" v-loading="loading">
    <template #header>
      <div class="flex items-end px-6">
        <span class="text-3xl font-medium">{{ indexTitle }}</span>
        <div class="px-8 flex items-end gap-5">
          <span class="text-2xl font-medium" :style="{ color: textColor }">{{
            currentData.l8
          }}</span>
          <span :style="{ color: textColor }">{{ Number(indexDelta).toFixed(2) }}</span>
          <span :style="{ color: textColor }">{{ `${Number(indexDeltaRate).toFixed(2)}%` }}</span>
        </div>
      </div>
    </template>
    <div class="grid gap-x-8 gap-y-2 grid-cols-4 px-6">
      <div v-for="item in currentFormat" :key="item.label" class="text-left">
        <span>{{ `${item.label}: ` }}</span>
        <span>{{ item.value.toFixed(2) }}</span>
      </div>
    </div>
  </el-card>
</template>
