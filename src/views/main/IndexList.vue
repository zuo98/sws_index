<script setup>
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useIndexType } from '@/composables/useIndexType'
import IndexCube from '@/components/IndexCube.vue'

defineComponent({ name: 'IndexList' })

const { getIndexCurrentByType } = useIndexType()

const indexType = [
  {
    value: '市场表征',
    key: 0
  },
  {
    value: '一级行业',
    key: 1
  },

  {
    value: '风格指数',
    key: 3
  }
];
const type = ref('市场表征')
const indexCurrentList = ref([])
const interval = ref(null)

const fetchData = () => {
  getIndexCurrentByType(type.value).then(({ data }) => {
    indexCurrentList.value = data.results
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
  <div class="flex flex-col items-center pt-20">
    <el-select v-model="type" placeholder="Select" size="large" @change="fetchData">
      <el-option v-for="item in indexType" :key="item.key" :label="item.value" :value="item.value" />
    </el-select>
    <div class="flex flex-wrap justify-center my-5 w-4/5">
      <index-cube v-for="index in indexCurrentList" :key="index.swindexcode" :data="index" class="m-2"></index-cube>
    </div>
  </div>
</template>
