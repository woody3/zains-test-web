<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <sticky :z-index="10" :sticky-top="50" class-name="sub-navbar">
        <div style="float:left">
          <el-button @click="goBack">返回</el-button>
        </div>
      </sticky>

      <el-row style="margin-top: 40px;">
        <el-col :span="10">
          <el-form ref="updateForm" :model="submitData" label-position="top">
            <el-form-item label="昵称">
              <el-input v-model="submitData.name" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="submitData.phone" />
            </el-form-item>
            <el-form-item>
              <el-button v-loading="loading" type="primary" @click="handleSetting">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form>
            <el-form-item label="微信二维码" label-position="top">
              <br>
              <el-upload
                class="avatar-uploader"
                accept="image/jpeg, image/png"
                :headers="{'X-USER-TOKEN':token}"
                :show-file-list="false"
                :action="`${BASE_API}/bytes`"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="weChatQrCodeBytes" :src="weChatQrCodeBytes" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { uploadWechatQrcode, setting } from '@/api/user'
import { fetchByteArray } from '@/api/byte-array'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件

export default {
  name: 'Setting',
  components: { Sticky },
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API,
      loading: false,
      submitData: {},
      weChatQrCodeBytes: undefined
    }
  },
  computed: {
    ...mapGetters(['system-properties', 'user', 'token'])
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.$store.dispatch('user/getInfo').then(this.loadSetting)
      this.$store
        .dispatch('system-properties/loadSystemProperties')
        .then(this.loadSetting)
    },
    loadSetting() {
      this.submitData = {
        name: this.user.name,
        phone: this.user.phone
      }
      if (this.user.weChatQrCode) {
        fetchByteArray(this.user.weChatQrCode).then(response => {
          this.weChatQrCodeBytes = response.data
        })
      }
    },
    goBack() {
      this.$router.back()
    },
    handleSetting() {
      this.$refs.updateForm.validate(valid => {
        if (!valid) {
          return
        }
        this.loading = true
        setting(this.submitData)
          .then(response => {
            this.refresh()
            this.$message.success('操作成功')
          })
          .catch(error => {
            this.$message.error(error.response.data || '操作失败')
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    beforeAvatarUpload(file) {
      if (!/^image\/(jpeg|png)$/i.test(file.type)) {
        this.$message.error('只支持png、jpg文件')
        return false
      } else if (file.size > 1024 * 1024 * 10) {
        this.$message.error('上传文件大小不能超过10Mb!')
        return false
      }

      const vm = this
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        function() {
          uploadWechatQrcode({ weChatQrCodeBytes: this.result })
            .then(response => {
              vm.weChatQrCodeBytes = this.result
              vm.$message.success('上传成功')
            })
            .catch(error => {
              vm.$message.error(error.response.data || '上传失败')
            })
        },
        false
      )
      reader.readAsDataURL(file)
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.createPost-container {
  position: relative;
  .createPost-main-container {
    float: left;
    padding: 0px 20px;
    width: 100%;
  }
}
</style>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  display: block;
}
</style>
