<template>
  <div class="w-full h-full">
    <div v-if="routeName == 'detail'" class="absolute top-6 left-6">
      <el-button :icon="ArrowLeft" size="large" plain @click="backToHome"
        ><span>返回首页</span></el-button
      >
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

defineComponent({ name: 'SwsIndex' })
const route = useRoute()
const routeName = computed(() => {
  return route.name
})
const router = useRouter()
const backToHome = () => {
  router.push({
    path: '/main/list'
  })
}
</script>
