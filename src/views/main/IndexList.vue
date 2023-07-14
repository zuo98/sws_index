<script setup>
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useIndexType } from '@/composables/useIndexType'
import IndexCube from '@/components/IndexCube.vue'
import dayjs from 'dayjs'

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
    value: '二级行业',
    key: 11
  },

  {
    value: '风格指数',
    key: 3
  }
]
const loading = ref(true)
const type = ref('市场表征')
const indexCurrentList = ref([])
const interval = ref(null)

const fetchData = async () => {
  indexCurrentList.value = []
  loading.value = true
  await getIndexCurrentByType(type.value).then(({ data }) => {
    indexCurrentList.value = data?.results || []
  })
  loading.value = false
}
onMounted(() => {
  fetchData()
  interval.value = setInterval(() => {
    const hour = dayjs().hour()
    if (hour >= 9 && hour < 15) {
      fetchData()
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
  <div class="flex flex-col items-center pt-20">
    <el-select v-model="type" placeholder="Select" size="large" @change="fetchData">
      <el-option
        v-for="item in indexType"
        :key="item.key"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
    <div class="flex flex-wrap justify-center my-5 w-4/5 min-h-[180px]" v-loading="loading">
      <index-cube
        v-for="index in indexCurrentList"
        :key="index.swindexcode"
        :data="index"
        class="m-2"
      ></index-cube>
    </div>
  </div>
</template>
