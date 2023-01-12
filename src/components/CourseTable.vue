<template>

  <el-table :data="tableData" border>
    <el-table-column label="节次/时间" width="100">
      <template v-slot:default="{column,$index}">
        <el-row justify="center" align="middle">
          {{ courseTime[$index] }}
        </el-row>
      </template>
    </el-table-column>

    <el-table-column v-for="dayIndex in days">
      <template #header>
        <el-row justify="center" align="middle">
          {{ week[dayIndex - 1] }}
        </el-row>
      </template>
      <template v-slot:default="{column,$index}">
        <el-row v-if="courseTable[dayIndex-1][$index].name!==''"
                class="course"
                justify="center"
                align="middle"
        style="height: 95px">
          <el-col>
            {{ courseTable[dayIndex - 1][$index].name }}
          </el-col>
          <el-col>
            <el-tag size="small" round>
              {{ courseTable[dayIndex - 1][$index].teachers[0] }}
            </el-tag>
          </el-col>
          <el-col>
            <el-tag class="room" round>
              {{ courseTable[dayIndex - 1][$index].room }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row v-else>
          <div style="height: 95px"/>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">

import {inject, ref, Ref, UnwrapRef, watchEffect} from "vue";

const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const courseTime = ['第一节', '第二节', '第三节', '第四节', '第五节']
const tableData = [1, 2, 3, 4, 5,]
const courseTable = inject('courseTable')
const showWeekend: Ref<UnwrapRef<boolean>> = inject('showWeekend')
const days = ref(7)
watchEffect(() => {
  if (showWeekend.value) {
    days.value = 7
  } else {
    days.value = 5
  }
})

</script>
<style scoped>
.course {
  text-align: center;
  margin: 5px;
}

.room {
  max-width: 70px;
  margin: 5px;
}
</style>