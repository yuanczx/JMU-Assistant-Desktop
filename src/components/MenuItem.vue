<template>
  <el-card class="item" body-style="display:flex;flex-direction:column;" shadow="0">
    <img :src="src" alt="CourseItem icon" style="height: 100px">
    <label style="padding-top: 10px;text-align: center;">{{ label }}</label>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string,
  src: string,
  alt: string
}>()
</script>

<style scoped>
label {
  font-size: 20px;
  color: #707070;
  letter-spacing: 3px;
}
</style>