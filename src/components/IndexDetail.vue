<script setup>
import { computed, defineComponent, ref } from 'vue'
import IndexCard from '@/components/IndexCard.vue'
import IndexDayKChart from '@/components/IndexDayKChart.vue'
import IndexTimeChart from '@/components/IndexTimeChart.vue'
import IndexPosition from '@/components/IndexPosition.vue'

defineComponent({ name: 'IndexDetail' })

const props = defineProps({
  indexCode: {
    type: String,
    required: false,
    default: '801010'
  }
})
const indexCode = computed(() => props.indexCode)

const activeTabName = ref('day')
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <index-card :code="indexCode"></index-card>
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="Time" name="time"></el-tab-pane>
      <el-tab-pane label="Day-K" name="day"></el-tab-pane>
      <el-tab-pane label="Position" name="position"></el-tab-pane>
    </el-tabs>
    <index-time-chart
      v-if="activeTabName == 'time'"
      class="w-full h-[700px]"
      :code="indexCode"
    ></index-time-chart>
    <index-day-k-chart
      v-if="activeTabName == 'day'"
      class="w-full h-[700px]"
      :code="indexCode"
    ></index-day-k-chart>
    <index-position
      v-if="activeTabName == 'position'"
      class="w-full h-[700px]"
      :code="indexCode"
    ></index-position>
  </div>
</template>
