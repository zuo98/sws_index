<script setup>
import { computed, defineComponent } from 'vue'

defineComponent({ name: 'IndexCard' })
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => {
      return {
        l3: '0', //昨收
        l4: '0', //今开
        l5: '0', //成交额
        l6: '0', //最高佳
        l7: '0', //最低价
        l8: '0', //最新价
        l11: '0', //成交量
        swindexcode: '', //指数代码
        swindexname: '' //指数名称
      }
    }
  }
})

const currentData = computed(() => {
  return props.data
})

const indexDelta = computed(() => {
  return Number(currentData.value.l8) - Number(currentData.value.l3)
})

const indexDeltaRate = computed(() => {
  return (Number(indexDelta.value) / Number(currentData.value.l3)) * 100
})

const textColor = computed(() => {
  return indexDelta.value > 0 ? 'red' : 'LimeGreen'
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
  <el-card shadow="hover" class="w-3/5">
    <template #header>
      <div class="px-8 flex items-end gap-5">
        <span class="text-2xl font-medium" :style="{ color: textColor }">{{ currentData.l8 }}</span>
        <span :style="{ color: textColor }">{{ Number(indexDelta).toFixed(2) }}</span>
        <span :style="{ color: textColor }">{{ `${Number(indexDeltaRate).toFixed(2)}%` }}</span>
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