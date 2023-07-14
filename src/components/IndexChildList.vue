<script setup>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useIndexType } from '@/composables/useIndexType'
import IndexCube from '@/components/IndexCube.vue'
import indexJson from '../assets/json/index.json'
import dayjs from 'dayjs'

defineComponent({ name: 'IndexChildList' })
const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
const indexName = computed(() => {
  return props.name
})

const BUS_TYPE_TWO = '二级行业'
const indexBus = ref(indexJson)

const loading = ref(true)
const indexTwoBusList = ref([])
const { getIndexCurrentByType } = useIndexType()
const fetchData = async () => {
  loading.value = true
  indexTwoBusList.value = await getIndexCurrentByType(BUS_TYPE_TWO).then(
    ({ data }) => data?.results || []
  )
  loading.value = false
}

watch(
  () => indexName.value,
  () => {
    fetchData()
  }
)

const interval = ref(null)
onMounted(() => {
  fetchData()
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

const childIndex = computed(() => {
  const childIndexNameList = indexBus.value
    .find((index) => index.name == indexName.value)
    ?.child?.map((i) => i.name)
  return indexTwoBusList.value.filter((index) => childIndexNameList.includes(index.swindexname))
})
</script>
<template>
  <div class="flex flex-wrap justify-center my-5" v-loading="loading">
    <index-cube
      v-for="index in childIndex"
      :key="index.swindexcode"
      :data="index"
      class="m-2"
    ></index-cube>
  </div>
</template>