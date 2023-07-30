<script setup>
import axios from 'axios'
import { defineComponent, defineProps } from 'vue'
import { usePage } from '@/composition/usePage.js'
import { dayjs } from 'element-plus'

defineComponent({ name: 'IndexPosition' })

const props = defineProps({
  code: {
    type: String,
    required: false,
    default: '801010'
  }
})

const getListApi = (opts) => {
  return axios.get(
    `/sws/index_publish/details/component_stocks/?swindexcode=${opts.indexCode}&page=${opts.pageNum}&page_size=${opts.pageSize}`
  )
}

const { page, tableData } = usePage({
  searchForm: { indexCode: props.code },
  getListApi: getListApi
})
</script>
<template>
  <div class="grid grid-cols-6 gap-4 mt-4">
    <el-table class="col-span-6" :data="tableData">
      <el-table-column prop="stockcode" label="证券代码" />
      <el-table-column prop="stockname" label="证券名称" />
      <el-table-column prop="newweight" label="最新权重(%)" />
      <el-table-column label="计入时间">
        <template #default="scope">
          {{ dayjs(scope.row.beginningdate).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="col-end-7 col-span-3"
      background
      layout="prev, pager, next"
      v-model:current-page="page.pageNum"
      v-model:page-size="page.pageSize"
      :total="page.total"
    />
  </div>
</template>

<style lang="scss" scoped></style>
