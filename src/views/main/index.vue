<script setup>
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useIndexType } from '@/composables/useIndexType'
import IndexCube from '../../components/IndexCube.vue'

defineComponent({ name: 'ProjectItem' })

const { getIndexCurrentByType } = useIndexType()

// const indexType = [
//   {
//     value: '市场表征',
//     key: 0
//   },
//   {
//     value: '一级行业',
//     key: 1
//   },

//   {
//     value: '风格指数',
//     key: 3
//   }
// ]

const indexOver = ref([])
const indexOne = ref([])
const indexStyle = ref([])
const interval = ref(null)

const fetchData = () => {
  getIndexCurrentByType('市场表征').then(({ data }) => {
    console.log('data: ', data)
    indexOver.value = data.results
  })

  getIndexCurrentByType('一级行业').then(({ data }) => {
    console.log('data: ', data)
    indexOne.value = data.results
  })
  getIndexCurrentByType('风格指数').then(({ data }) => {
    console.log('data: ', data)
    indexStyle.value = data.results
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
  <div class="px-2 py-3"><span class="text-xl font-medium">市场表征:</span></div>
  <div class="px-5 flex flex-wrap gap-5">
    <index-cube v-for="index in indexOver" :key="index.swindexcode" :data="index"></index-cube>
  </div>
  <div class="px-2 py-3"><span class="text-xl font-medium">一级行业:</span></div>
  <div class="px-5 flex flex-wrap gap-5">
    <index-cube v-for="index in indexOne" :key="index.swindexcode" :data="index"></index-cube>
  </div>
  <div class="px-2 py-3"><span class="text-xl font-medium">风格指数:</span></div>
  <div class="px-5 flex flex-wrap gap-5">
    <index-cube v-for="index in indexStyle" :key="index.swindexcode" :data="index"></index-cube>
  </div>
</template>
