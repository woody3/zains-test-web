<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <sticky :z-index="10" :sticky-top="50" class-name="sub-navbar">
        <div style="float:left">
          <el-button v-loading="loading" type="primary" @click="submitForm">保存</el-button>
        </div>
      </sticky>

      <el-form ref="updateForm" :model="submitData" :rules="rules">
        <el-form-item label="新浪应用APPKEY" prop="sinaShortUrlAppKey">
          <el-input
            v-model="submitData.sinaShortUrlAppKey"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 10}"
            placeholder="一行表示一个KEY"
          />
          <el-link type="warning" href="https://open.weibo.com/connect" target="_blank">创建新浪应用</el-link>后，进入【我的应用】，点击一个应用，复制【App Key】后面的内容（不包含冒号）
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件

import { fetchConfigs, saveConfigs } from '@/api/config'
export default {
  name: 'Config',
  components: { Sticky },
  data() {
    return {
      submitData: {
        sinaShortUrlAppKey: ''
      },
      loading: false,
      rules: {
        sinaShortUrlAppKey: [
          { required: true, message: '新浪应用APPKEY不能为空' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      fetchConfigs()
        .then(response => {
          this.submitData = response.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitForm() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveConfigs(this.submitData)
            .then(response => {
              this.$message.success('操作成功')
            })
            .catch(error => {
              this.$message.error(error.response.data || '操作失败')
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
        }
      })
    }
  }
}
</script>
