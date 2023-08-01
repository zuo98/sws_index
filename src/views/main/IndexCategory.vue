<script setup>
import { defineComponent, ref, watch, onMounted, computed } from 'vue'
import indexTree from '@/assets/json/indexTree.json'
import IndexDetail from '@/components/IndexDetail.vue'
import { useIndexType } from '@/composables/useIndexType'
import { INDEX_COLOR } from '@/constants/dictionary.js'

defineComponent({ name: 'IndexCategory' })

const { getIndexCurrentByType } = useIndexType()
// delat:(Number(v.l8)-Number(v.l4))*100/Number(v.l4),

const currentData = ref([])
const fetchData = () => {
  currentData.value = []
  getIndexCurrentByType('一级行业').then(({ data }) => {
    currentData.value.push(...(data?.results || []))
  })
  getIndexCurrentByType('二级行业').then(({ data }) => {
    currentData.value.push(...(data?.results || []))
  })
  console.log('currentData: ', currentData.value)
}

const indexTreeData = computed(() => {
  return indexTree.map((v) => {
    let child = []
    if (v.child.length > 0) {
      child = v.child.map((node) => {
        const current = currentData.value.find((item) => item.swindexcode == node.indexCode)
        const delta = Number(
          (((Number(current?.l8) - Number(current?.l4)) * 100) / Number(current?.l4)).toFixed(2)
        )
        return {
          ...node,
          delta: delta ? delta : 0
        }
      })
    }

    const current = currentData.value.find((item) => item.swindexcode == v.indexCode)
    const delta = Number(
      (((Number(current?.l8) - Number(current?.l4)) * 100) / Number(current?.l4)).toFixed(2)
    )
    return {
      ...v,
      delta: delta ? delta : 0,
      child: child
    }
  })
})

const defaultProps = {
  children: 'child'
  // label: (data) => {
  //   return `${data.indexName}(${data.industryCode})`
  // }
}

const indexCode = ref('801010')

const handleNodeClick = (node) => {
  indexCode.value = node.indexCode
}

const filterText = ref('')
const treeRef = ref()

watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.indexName.includes(value) || data.indexCode.includes(value)
}

const renderContent = (h, { data }) => {
  const isUp = data.delta >= 0
  return h(
    'span',
    {},
    data.delta == 0
      ? [h('span', {}, data.indexName)]
      : [
          h('span', {}, `${data.indexName}`),
          h(
            'span',
            { style: { color: isUp ? INDEX_COLOR.UP : INDEX_COLOR.DOWN } },
            `（${data.delta}）`
          )
        ]
  )
}
onMounted(() => {
  fetchData()
})
</script>
<template>
  <div class="flex">
    <div class="w-[250px] overflow-y-auto p-3">
      <el-input v-model="filterText" placeholder="Filter keyword" />
      <el-tree
        ref="treeRef"
        class="h-[800px] overflow-y-auto"
        accordion
        :data="indexTreeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="grow">
      <index-detail :indexCode="indexCode"></index-detail>
    </div>
  </div>
</template>
