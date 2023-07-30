<script setup>
import { computed, defineComponent } from 'vue'
import { INDEX_COLOR } from '@/constants/dictionary'

defineComponent({ name: 'IndexCube' })
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

const indexData = computed(() => {
  return props.data
})

const textColor = computed(() => {
  const delta = Number(indexData.value.l8) - Number(indexData.value.l3)
  return delta >= 0 ? INDEX_COLOR.UP : INDEX_COLOR.DOWN
})
</script>

<template>
  <div
    class="w-[200px] h-[70px] border-2 rounded-2xl p-2 border-gray-200 text-center cursor-pointer"
  >
    <span class="text-slate-600 font-normal">{{ indexData.swindexname }}</span>
    <span class="text-slate-600 font-normal">{{ `(${indexData.swindexcode})` }}</span
    ><br />
    <span class="text-slate-600 font-medium">{{ indexData.l8 }}</span>
    <span class="font-medium" :style="{ color: textColor }">{{
      `(${(((indexData.l8 - indexData.l3) * 100) / indexData.l3).toFixed(2)})`
    }}</span>
  </div>
</template>
