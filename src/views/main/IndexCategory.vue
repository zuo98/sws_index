<script setup>
import { defineComponent, ref } from 'vue'
import indexTree from '@/assets/json/indexTree.json'
import IndexDetail from '@/components/IndexDetail.vue'

defineComponent({ name: 'IndexCategory' })

const indexTreeData = ref(indexTree)

const defaultProps = {
  children: 'child',
  label: (data) => {
    return `${data.indexName}(${data.industryCode})`
  }
}

const indexCode = ref('801010')

const handleNodeClick = (node) => {
  indexCode.value = node.indexCode
}
</script>
<template>
  <div class="flex">
    <el-tree
      :data="indexTreeData"
      :props="defaultProps"
      accordion
      class="w-[250px] h-[850px] overflow-y-auto p-3"
      @node-click="handleNodeClick"
    />
    <div class="grow">
      <index-detail :indexCode="indexCode"></index-detail>
    </div>
  </div>
</template>
