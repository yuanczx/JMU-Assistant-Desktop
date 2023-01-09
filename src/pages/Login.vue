<script setup lang="ts">
import {Command} from "@tauri-apps/api/shell";
import {ref} from "vue";
import {User, Lock} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";

const userName = ref("")
const password = ref("")
const loading = ref(false)

const router = useRouter()

let info: string

async function login() {
  if (userName.value == '' || password.value == '') {
    ElMessage.warning('账号密码不能为空');
    return;
  }
  loading.value = true
  const command = Command.sidecar('sidecar/request', ["-u", userName.value, "-p", password.value])
  const outs = (await command.execute()).stdout.split(',')
  const cookie = outs[0]
  const studentId = outs[1]
  if (cookie.includes('SESSION')) {
    ElMessage.success('登录成功')
    router.push({
      name: 'Home',
      query: {
        studentId: studentId,
        cookie: cookie
      },
      replace: true
    }).finally()
  } else {
    ElMessage.error('登录失败，请检查用户名及密码是否正确')
  }


  loading.value = false
}

</script>

<template>

  <el-row class="main" justify="center" align="middle">
    <el-card class="login_box" header="JMU Assistant" v-loading="loading">
      <el-row class="padding margin_top" justify="center" align="middle">
        <el-col :span="4"><label>用户名:</label></el-col>
        <el-col :span="20">
          <el-input :suffix-icon="User" v-model="userName" size="large" maxlength="20"></el-input>
        </el-col>
      </el-row>

      <el-row class="padding margin_top" justify="center" align="middle">
        <el-col :span="4"><label>密码:</label></el-col>
        <el-col :span="20">
          <el-input v-model="password" size="large" :suffix-icon="Lock" :clearable="true"
                    :show-password="true"></el-input>
        </el-col>
      </el-row>

      <el-row class="padding margin_top" justify="center" align="bottom" style="">
        <el-button type="primary" round @click="login" style="width: 100%;height: 45px">登录</el-button>
      </el-row>

    </el-card>
  </el-row>
</template>

<style scoped>
.padding {
  padding: 18px;
  /*margin: 5px;*/
}

.margin_top {
  margin-top: 15px;
}

.login_box {
  min-width: 450px;
  max-width: 500px;
  padding: 10px;
  margin: 20px;
  height: 400px;
  filter: blur(0px);
  border-radius: 30px;
}

.main {
  background-image: url("../assets/jmu.jpeg");
  background-size: cover;
  height: 100%;
  width: 100%;
}
</style>

