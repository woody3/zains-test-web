<template>
  <div class="app-container">
    <div class="filter-container" @keyup.enter="handleFilter">
      <el-input
        v-model="filterData.key"
        class="filter-item"
        placeholder="可输入登录账号或姓名"
        style="width: 200px;"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button class="filter-item" @click="handleReset">重置</el-button>
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-edit"
        @click="showUpdateDialog({})"
      >添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      height="calc(100vh - 142px)"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="username" label="登录账号" />
      <el-table-column prop="enabled" label="是否启用">
        <template slot-scope="{row}">{{ row.deleted ? '已删除' : row.enabled ? "已启用" : "未启用" }}</template>
      </el-table-column>
      <!-- <el-table-column prop="locked" label="是否锁定" />
      <el-table-column prop="lockDate" label="锁定日期" />
      <el-table-column prop="lastLoginIp" label="最后登录IP" />
      <el-table-column prop="lastLoginDate" label="最后登录日期" />-->
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="{row}">
          <template v-if="row.username == 'admin'">内置人员不可操作</template>
          <template v-else-if="!row.deleted">
            <el-button type="primary" @click="showUpdateDialog(row)">编辑</el-button>
            <el-button type="success" @click="handleResetPassword(row)">重置密码</el-button>
            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
          <template v-else>已删除用户不可操作</template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="pagination.total"
      :page.sync="pagination.pageNumber"
      :limit.sync="pagination.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="submitData.id ? '修改' : '新增'" :visible.sync="addDialogVisible" width="650px">
      <el-form ref="updateForm" label-width="6rem" :model="submitData">
        <el-form-item
          label="姓名"
          prop="name"
          :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
        >
          <el-input v-model="submitData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item
          label="登录账号"
          prop="username"
          :rules="[{ required: true, message: '请输入登录账号', trigger: 'blur' }]"
        >
          <el-input v-model="submitData.username" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item
          label="是否启用"
          prop="enabled"
          :rules="[{ required: true, message: '请选择是否启用', trigger: 'blur' }]"
        >
          <el-switch v-model="submitData.enabled" active-text="启用" inactive-text="不启用" />
        </el-form-item>
        <el-alert
          type="error"
          :closable="false"
          :title="'默认密码:' + system_properties.defaultPassword"
        />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateUser, resetPassword, deleteUser } from '@/api/user'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'

const resetFilterData = {
  key: undefined // 查询关键字
}
const resetSubmitData = {
  id: undefined, // 提交的数据主键
  name: undefined, // 姓名
  username: undefined, // 登录账号
  enabled: true // 是否启用
}
export default {
  components: { Pagination },
  data() {
    return {
      filterData: Object.assign({}, resetFilterData),
      pagination: { pageNumber: 1, pageSize: 20, total: 0 },
      listLoading: true,
      list: [
        // {
        //   id: 1,
        //   name: "系统管理员",
        //   username: "admin",
        //   enabled: true,
        //   isAdmin: true,
        //   lastLoginDate: 1557934085519,
        //   lastLoginIp: "127.0.0.1|127.0.0.1|null|null",
        //   lockDate: null,
        //   locked: false
        // }
      ],
      addDialogVisible: false,
      submitData: Object.assign({}, resetSubmitData)
    }
  },
  computed: {
    ...mapGetters(['system_properties'])
  },
  created() {
    this.getList()
  },
  methods: {
    handleReset() {
      this.filterData = Object.assign({}, resetFilterData)
    },
    handleFilter() {
      this.pagination.pageNumber = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      const requestBody = Object.assign({}, this.filterData, this.pagination)
      fetchList(requestBody)
        .then(response => {
          this.list = response.data.items
          this.pagination.total = response.data.total
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    showUpdateDialog(row) {
      this.submitData = Object.assign({}, resetSubmitData, row)
      this.addDialogVisible = true
      if (this.$refs.updateForm) {
        this.$refs.updateForm.resetFields()
      }
    },
    handleResetPassword(row) {
      resetPassword(row.id)
        .then(response => {
          this.$message.success('操作成功')
          this.getList()
        })
        .catch(error => {
          this.$message.error(error.response.data || '操作失败')
        })
    },
    handleUpdate() {
      this.$refs.updateForm.validate(valid => {
        if (!valid) {
          return
        }
        updateUser(this.submitData)
          .then(response => {
            this.submitData = {}
            this.addDialogVisible = false
            this.$message.success('操作成功')
            this.getList()
          })
          .catch(error => {
            this.$message.error(error.response.data || '操作失败')
          })
      })
    },
    handleDelete(row) {
      deleteUser(row.id)
        .then(response => {
          this.$message.success('操作成功')
          this.getList()
        })
        .catch(error => {
          this.$message.error(error.response.data || '操作失败')
        })
    }
  }
}
</script>
