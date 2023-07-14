<script setup>
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import IndexCard from '@/components/IndexCard.vue'
import IndexDayKChart from '@/components/IndexDayKChart.vue'
import IndexTimeChart from '@/components/IndexTimeChart.vue'
import IndexChildList from '@/components/IndexChildList.vue'

defineComponent({ name: 'IndexDetail' })

const route = useRoute()

const indexCode = computed(() => route.query.indexCode)
const indexName = computed(() => route.query.indexName)

const hasChild = computed(() => {
  return indexCode.value.endsWith('0')
})

const activeTabName = ref('time')
</script>

<template>
  <div class="flex flex-col items-center">
    <index-card :code="indexCode"></index-card>
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="Time" name="time"></el-tab-pane>
      <el-tab-pane label="Day" name="day"></el-tab-pane>
    </el-tabs>
    <index-time-chart
      v-if="activeTabName == 'time'"
      class="w-full h-[800px]"
      :code="indexCode"
    ></index-time-chart>
    <index-day-k-chart
      v-if="activeTabName == 'day'"
      class="w-full h-[800px]"
      :code="indexCode"
    ></index-day-k-chart>
    <index-child-list :name="indexName" class="w-4/5" v-if="hasChild"></index-child-list>
  </div>
</template>
