<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/"><el-dropdown-item>首页</el-dropdown-item></router-link>
          <router-link to="/setting"><el-dropdown-item divided>个人设置</el-dropdown-item></router-link>
          <el-dropdown-item divided :command="()=>{changePasswordSubmitData = {};showChangePassword = true}">修改密码</el-dropdown-item>
          <el-dropdown-item divided :command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="showChangePassword" append-to-body width="650px">
      <el-form ref="changePasswordForm" label-width="6rem" :model="changePasswordSubmitData">
        <el-form-item label="旧密码" prop="oldPassword" :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]">
          <el-input v-model="changePasswordSubmitData.oldPassword" type="password" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="password" :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]">
          <el-input v-model="changePasswordSubmitData.password" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="aginPassword" :rules="[{ required: true, trigger: 'blur', validator: changePasswordValidate }]">
          <el-input v-model="changePasswordSubmitData.aginPassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChangePassword = false">取 消</el-button>
        <el-button type="primary" @click="handleChangePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { changePassword } from '@/api/user'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const changePasswordValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.changePasswordSubmitData.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      changePasswordValidate: changePasswordValidate,
      showChangePassword: false,
      changePasswordSubmitData: {
        oldPassword: '',
        password: '',
        aginPassword: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleCommand(command) {
      if (typeof command === 'function') {
        command.call(this)
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleChangePassword() {
      this.$refs.changePasswordForm.validate((valid) => {
        if (!valid) { return }
        changePassword(this.changePasswordSubmitData).then((response) => {
          this.changePasswordSubmitData = {}
          this.showChangePassword = false
          this.$message.success('操作成功')
        }).catch((error) => {
          this.$message.error(error.response.data || '操作失败')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
