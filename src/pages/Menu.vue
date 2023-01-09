<template>
  <div style="display: flex;justify-content: center;width: 100%">
    <el-row style="max-width: 800px;justify-content: center; min-width: 500px;width: 100%">

      <el-col class="padding" :span="12">
        <MenuItem @click="clickCourse" src="/icon_course.svg" alt="course icon" label="课程表"/>
      </el-col>

      <el-col class="padding" :span="12">
        <MenuItem @click="clickScore" src="/icon_score.svg" alt="score icon" label="成绩单"/>
      </el-col>

    </el-row>
  </div>
</template>

<script setup lang="ts">
import {useRouter, useRoute} from "vue-router";
import MenuItem from "@/components/MenuItem.vue";

const router = useRouter()
const route = useRoute()

const cookie = route.query.cookie
const studentId = route.query.studentId

function clickCourse() {
  router.push({
    name: 'Course',
    query: {
      studentId:studentId,
      cookie: cookie
    }
  })
}

function clickScore() {
  router.push({
    name: 'Score',
    query: {
      studentId:studentId,
      cookie: cookie
    }
  })
}
</script>

<style scoped>
.padding {
  padding: 10px;
}

.item:hover {
  background-color: #e8e8e8;
}

</style>