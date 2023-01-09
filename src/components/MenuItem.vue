<template>
  <el-card class="item" body-style="display:flex;flex-direction:column;" shadow="0">
    <img :src="src" alt="Course icon" style="height: 100px">
    <label id="label" style="padding-top: 10px;text-align: center;">{{label}}</label>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string,
  src: string,
  alt:string
}>()
</script>

<style scoped>
#label{
  /*font-weight: bold;*/
  font-size: 20px;
  color: #707070;
  letter-spacing: 3px;
  /*font-family: 得意黑,serif;*/
}
</style>