<script setup>
import { ref } from 'vue'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import { Document, Menu as IconMenu, Setting } from '@element-plus/icons-vue'

defineComponent({ name: 'SwsIndex' })

const router = useRouter()

const headerTitle = ref('申万行业指数')

const isCollapse = ref(true)

const menuDic = ref([
  {
    menuName: 'overview',
    path: '/main/overview'
  },
  {
    menuName: 'category',
    path: '/main/category'
  },
  {
    menuName: 'setting',
    path: '/main/setting'
  }
])

const clickItem = (event) => {
  console.log('event: ', event)
  const path = menuDic.value.find((v) => v.menuName == event)?.path
  router.push({
    path: path
  })
}
</script>

<template>
  <div class="h-[70px] w-full bg-slate-400 text-center">
    <span class="text-5xl font-sans font-bold text-gray-600 leading-[70px]">{{ headerTitle }}</span>
  </div>
  <div class="w-full flex" style="">
    <el-menu default-active="overview" class="w-[200px]" :collapse="isCollapse" @select="clickItem">
      <el-menu-item index="overview">
        <el-icon><icon-menu /></el-icon>
        <template #title>Overview</template>
      </el-menu-item>
      <el-menu-item index="category">
        <el-icon><document /></el-icon>
        <template #title>Category</template>
      </el-menu-item>
      <el-menu-item index="settings" disabled>
        <el-icon><setting /></el-icon>
        <template #title>Settings</template>
      </el-menu-item>
    </el-menu>
    <router-view class="w-full"></router-view>
  </div>
</template>
