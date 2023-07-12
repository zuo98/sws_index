<script setup>
import { computed, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { useIndex } from '@/composables/useIndex'
import { useRoute } from 'vue-router'
import { ElDescriptions } from 'element-plus'
defineComponent({ name: 'IndexDetail' })
const route = useRoute()
const indexCode = computed(() => {
  return route.query.indexCode
})
const { getIndexCurrentData, getIndexTimelinesData } = useIndex({ indexCode: indexCode.value })

const timelinesData = ref([])
const currentData = ref({})
const interval = ref(null)

const indeXTitle = computed(() => {
  return `${currentData.value?.l2} (${currentData.value?.l1})`
})

const indexDelta = computed(() => {
  return `${Number(currentData.value.l8) - Number(currentData.value.l3)}`
})

const indexDeltaRate = computed(() => {
  return `${(Number(indexDelta.value) / Number(currentData.value.l3)) * 100}`
})

const textColor = computed(() => {
  return Number(indexDelta) >= 0 ? 'red' : 'LimeGreen'
})

const fetchData = () => {
  getIndexCurrentData().then(({ data }) => {
    currentData.value = data?.[0] || {}
  })
  getIndexTimelinesData().then(({ data }) => {
    timelinesData.value = data || []
  })
}
onMounted(() => {
  fetchData()
  interval.value = setInterval(fetchData, 5000)
})
onBeforeUnmount(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="m-2 flex items-end gap-5">
      <span class="text-2xl font-medium">{{ indeXTitle }}</span>
      <span class="text-2xl font-medium" :style="{ color: textColor }">{{ currentData.l8 }}</span>
      <span :style="{ color: textColor }">{{ Number(indexDelta).toFixed(2) }}</span>
      <span :style="{ color: textColor }">{{ `${Number(indexDeltaRate).toFixed(2)}%` }}</span>
    </div>
    <ElDescriptions :column="4" size="large" border class="p-5 rounded-lg bg-slate-100">
      <ElDescriptionsItem label="今开" :min-width="80" label-align="right" align="center" class="py-1 px-3">{{
        currentData.l4
      }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="最高" :width="80" label-align="right" align="center">{{ currentData.l6 }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="成交量(百万股)" :width="120" label-align="right" align="center">{{ currentData.l11 }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="指数涨幅" label-align="right" align="center">{{
        `${Number(indexDeltaRate).toFixed(2)}%` }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="昨收" :width="80" label-align="right" align="center">{{ currentData.l3 }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="最低" :width="80" label-align="right" align="center">{{ currentData.l7 }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="成交额(百万元)" :width="120" label-align="right" align="center">{{ currentData.l5 }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>
