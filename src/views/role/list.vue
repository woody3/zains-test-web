<template>
  <div class="app-container">
    <div class="filter-container" @keyup.enter="handleFilter">
      <el-select
        v-model="filterData.userId"
        class="filter-item"
        filterable
        clearable
        placeholder="可输入登录账号或姓名筛选"
        style="width:200px"
      >
        <el-option
          v-for="item in options.users"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filterData.permissions"
        class="filter-item"
        clearable
        placeholder="请选择权限模块"
        style="width:200px"
      >
        <el-option
          v-for="item in options.permissions"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
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
      <el-table-column prop="name" label="权限组" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" @click="showUpdateDialog(row)">编辑</el-button>
          <template v-if="row.isAdmin">内置角色不可删除</template>
          <el-button v-else type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="pagination.total"
      :page.sync="pagination.pageNumber"
      :limit.sync="pagination.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="submitData.id ? '修改' : '新增'"
      :visible.sync="addDialogVisible"
      top="0px"
      width="650px"
    >
      <el-form ref="updateForm" label-width="6rem" :model="submitData">
        <el-form-item
          label="权限组名称"
          prop="name"
          :rules="[{ required: true, message: '请输入权限组名称', trigger: 'blur' }]"
        >
          <template v-if="submitData.isAdmin">{{ submitData.name }}</template>
          <el-input v-else v-model="submitData.name" placeholder="请输入权限组名称" />
        </el-form-item>
        <el-form-item label="组成员" prop="userIds">
          <el-transfer
            v-model="submitData.userIds"
            filterable
            :data="options.users"
            :props="{key:'id',label:'label'}"
            :titles="['未选', '已选']"
          />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-transfer
            v-model="submitData.permissions"
            :data="options.permissions"
            :props="{key:'code',label:'name'}"
            :titles="['未选', '已选']"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  updateRole,
  deleteRole,
  fetchUsersByRole,
  fetchPermissions,
  fetchPermissionsByRole
} from '@/api/role'
import { fetchUsers } from '@/api/user'
import Pagination from '@/components/Pagination'

const resetFilterData = {
  userId: undefined, // 用户主键
  permissions: undefined // 权限
}
const resetSubmitData = {
  id: undefined, // 提交的数据主键
  name: undefined, // 角色名称
  userIds: [], // 用户主键
  permissions: [] // 权限
}
export default {
  name: 'RoleList',
  components: { Pagination },
  data() {
    return {
      options: {
        permissions: [
          // {
          //   code: '权限代码',
          //   name: '模块名称'
          // }
        ],
        users: [
          // {
          //   id: '用户主键',
          //   username: '登录账号',
          //   name: '用户姓名',
          //   label: '用户姓名(登录账号)'
          // }
        ]
      },
      filterData: Object.assign({}, resetFilterData),
      pagination: { pageNumber: 1, pageSize: 20, total: 0 },
      listLoading: true,
      list: [
        // {
        //   id: undefined,
        //   name: '角色名称',
        //   isAdmin: '是否为超级管理员'
        // }
      ],
      addDialogVisible: false,
      submitData: JSON.parse(JSON.stringify(resetSubmitData))
    }
  },
  created() {
    this.getList()
    this.loadUsers()
    this.loadPermissions()
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
    loadUsers() {
      fetchUsers().then(response => {
        response.data.forEach(element => {
          element.label = element.name + '(' + element.username + ')'
        })
        this.options.users = response.data
      })
    },
    loadUsersByRole(roleId) {
      fetchUsersByRole(roleId).then(response => {
        this.submitData.userIds = response.data.map((value, index) => value.id)
      })
    },
    loadPermissions() {
      fetchPermissions().then(response => {
        this.options.permissions = response.data
      })
    },
    loadPermissionsByRole(roleId) {
      fetchPermissionsByRole(roleId).then(response => {
        this.submitData.permissions = response.data
      })
    },
    showUpdateDialog(row) {
      this.submitData = Object.assign(
        {},
        JSON.parse(JSON.stringify(resetSubmitData)),
        row
      )
      this.addDialogVisible = true
      if (this.$refs.updateForm) {
        this.$refs.updateForm.resetFields()
      }
      this.options.permissions.forEach(value => {
        value.disabled = row.isAdmin
      })
      if (row.id) {
        this.loadUsersByRole(row.id)
        this.loadPermissionsByRole(row.id)
      }
    },
    handleUpdate() {
      this.$refs.updateForm.validate(valid => {
        if (!valid) {
          return
        }
        updateRole(this.submitData)
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
      deleteRole(row.id)
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
