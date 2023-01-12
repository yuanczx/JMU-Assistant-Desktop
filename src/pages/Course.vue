<template>
  <el-row class="main" justify="center" align="top" style="height: 100%">
    <el-col style="max-width: 1000px;">
      <el-row :span="12" class="options">
        <el-col :span="2">
          <el-tooltip content="返回">
            <el-button :icon="Back" @click="router.back()"/>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-select v-model="semester" @change="getCourse" >
            <el-option
                v-for="item in semesterOptions"
                :label="item.label"
                :key="item.value"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="weekIndex" @change="makeCourse" :disabled="!tableAvailable">
            <el-option
                v-for="i in 18"
                :label="weekLabel(i)"
                :key="i"
                :value="i"/>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-tooltip content="显示周末" >
            <el-switch v-model="showWeekend" :disabled="!tableAvailable"/>
          </el-tooltip>
        </el-col>
        <el-col :span="1" :push="8">
          <el-tooltip content="导出ICS文件">
            <el-button :icon="Files" @click="exportIcsFile" :disabled="!tableAvailable"/>
          </el-tooltip>
        </el-col>
      </el-row>
      <CourseTable v-if="tableAvailable" v-loading="loading"/>
      <el-empty v-else v-loading="loading" description="此学期课程表暂未发布"/>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {http} from '@tauri-apps/api';
import {onMounted, provide, Ref, ref, UnwrapRef} from 'vue';
import CourseTable from '@/components/CourseTable.vue';
import {Back, Files} from '@element-plus/icons-vue';
import CourseItem from "@/model/CourseItem";
import Course2ICS from "@/model/Course2ICS";
import moment, {Moment} from "moment";
import {BaseDirectory, writeTextFile} from "@tauri-apps/api/fs";
import {ElMessage} from "element-plus";
import {showFileInExplorer} from "@/utils/commands";

const router = useRouter()
const semesterIndex = 'http://jwxt.jmu.edu.cn/student/ws/semester/get/'
const baseUrl = 'http://jwxt.jmu.edu.cn/student/for-std/course-table/semester/'
const suffix = '/print-data/0/'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'

const route = useRoute()

const cookie = route.query.cookie
const studentId = route.query.studentId

const loading = ref(true)
const showWeekend = ref(true)
const semesterOptions = [
  {
    label: '2022-2023 第二学期',
    value: '182'
  },
  {
    label: '2022-2023 第一学期',
    value: '201'
  },
  {
    label: '2021-2022 第二学期',
    value: '181'
  },
  {
    label: '2021-2022 第一学期',
    value: '61'
  },
  {
    label: '2020-2021 第二学期',
    value: '42'
  },
  {
    label: '2020-2021 第一学期',
    value: '41'
  },
]
const semester = ref(semesterOptions[0].value)
const headers = {
  'cookie': cookie,
  'user-agent': userAgent
}

const noClass = {name: '', room: '', teachers: ['']}
//课表状态
const tableAvailable = ref(false)

let courseTable = ref([[], [], [], [], [], [], []])
const weekIndex = ref(1)
let courses: CourseItem[]
const startDate: Ref<UnwrapRef<Moment>> = ref()
onMounted(() => {
  getCourse()
})
provide('courseTable', courseTable)
provide('showWeekend', showWeekend)

//清空课表
function clearCourseTable() {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 5; j++) {
      courseTable.value[i][j] = noClass
    }
  }
}

//周次选择
function weekLabel(index: number): string {
  return '第' + index + '周'
}

//生成本周课表
function makeCourse() {
  clearCourseTable()
  for (const weekCourse of courses) {
    if (weekCourse.weekIndexes.includes(weekIndex.value)) {
      const courseIndex = weekCourse.endUnit / 2
      const weekday = weekCourse.weekday
      let courseName = weekCourse.courseName
      if (courseName.length > 12) {
        courseName = courseName.substring(0, 10) + '..'
      }
      const room = weekCourse.room.substring(0, 6)
      const teacher = weekCourse.teachers
      courseTable.value[weekday - 1][courseIndex - 1] =
          {
            name: courseName,
            room: room,
            teachers: teacher
          }
    }
  }
  loading.value = false
}


function exportIcsFile() {
  if (!tableAvailable.value) {
    ElMessage.warning('抱歉本学期课表为空')
    return
  }
  const course2ics = new Course2ICS(courses, startDate.value)
  const icsText = course2ics.makeEvents()
  try {
    const fileName = semester.value + '.ics'
    ElMessage.success('成功保存至 ' + fileName)
    writeTextFile(fileName, icsText, {dir: BaseDirectory.Download})
    showFileInExplorer(fileName)
  } catch (e) {
    ElMessage.warning(e)
  }
}

//获取课程数据
async function getCourse() {
  loading.value = true
  //课程信息
  let courseJson = (await http.fetch(baseUrl + semester.value + suffix + studentId,
      {method: 'GET', responseType: http.ResponseType.JSON, headers: headers})).data

  //学期信息
  const semesterInfo = (await http.fetch(semesterIndex + semester.value,
      {method: 'GET', responseType: http.ResponseType.JSON, headers: headers})).data

  startDate.value = moment(semesterInfo['startDate'])
  courses = courseJson['studentTableVm']['activities']
  tableAvailable.value = courses.length != 0;
  makeCourse()
}
</script>

<style scoped>
.options {
  margin-top: 20px;
  margin-bottom: 20px;
}


</style>