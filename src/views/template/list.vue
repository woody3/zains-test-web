<template>
  <div class="app-container">
    <div class="filter-container" @keyup.enter="handleFilter">
      <el-input
        v-model="filterData.title"
        placeholder="模板名称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button class="filter-item" @click="handleReset">重置</el-button>
      <router-link to="/template/create">
        <el-button class="filter-item" type="success" icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      height="calc(100vh - 142px)"
      @row-dblclick="handlePreview"
    >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column prop="title" label="模板名称" width="200" />
      <el-table-column prop="digest" label="摘要" />
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="{row}">
          <router-link :to="'/template/edit/' + row.id">
            <el-button type="primary">编辑</el-button>
          </router-link>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="pagination.total"
      :page.sync="pagination.pageNumber"
      :limit.sync="pagination.pageSize"
      @pagination="getList"
    />

    <right-panel :visible.sync="previewVisible">
      <template-preview :content="dblclickRow.content" style="margin-left:4px;" />
    </right-panel>
    <guide
      :guide-show="guideShow"
      guide-key="CLOSE-GUIDE-TEMPLATE"
      :steps="[{
        element: '.el-table__body-wrapper tbody tr.el-table__row td:nth-child(3)',
        popover: {
          title: '快速查看模板内容',
          description: '双击行，可以快速查看模板完整内容',
          position: 'bottom'
        }
      }]"
    />
  </div>
</template>

<script>
import {
  fetchList,
  fetchTemplateContent,
  deleteTemplate
} from '@/api/template'
import Pagination from '@/components/Pagination'
import RightPanel from '@/components/RightPanel'
import Guide from '@/components/Guide'
import TemplatePreview from './components/Preview'

const resetFilterData = {
  title: undefined, // 模板标题
  digest: undefined // 模板摘要
}
export default {
  name: 'TemplateList',
  components: { Pagination, RightPanel, TemplatePreview, Guide },
  data() {
    return {
      options: {
        projects: [
          // { id: 1, name: '项目名称' }
        ]
      },
      filterData: Object.assign({}, resetFilterData),
      pagination: { pageNumber: 1, pageSize: 20, total: 0 },
      listLoading: true,
      list: [],
      dblclickRow: {},
      previewVisible: false,
      guideShow: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const requestBody = Object.assign({}, this.filterData, this.pagination)
      fetchList(requestBody)
        .then(response => {
          this.list = response.data.items
          this.pagination.total = response.data.total
          if (response.data.items.length <= 0) {
            return
          }
          setTimeout(() => {
            this.guideShow = true
          }, 500)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    handleFilter() {
      this.pagination.pageNumber = 1
      this.getList()
    },
    handleReset() {
      this.filterData = Object.assign({}, resetFilterData)
    },
    handlePreview(row, column, event) {
      this.dblclickRow = row
      if (row.content) {
        this.previewVisible = true
        return
      }
      fetchTemplateContent(row.id)
        .then(response => {
          this.dblclickRow.content = response.data
          this.previewVisible = true
        })
        .catch(error => {
          this.$message.error(
            error.response.data || '数据请求失败，请稍后重试'
          )
        })
    },
    handleDelete(row) {
      deleteTemplate(row.id)
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
