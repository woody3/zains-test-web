<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <sticky :z-index="10" :sticky-top="50" class-name="sub-navbar">
        <div style="float:left">
          <router-link to="/template/list">
            <el-button>返回</el-button>
          </router-link>
        </div>
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="primary"
          @click="submitForm"
        >保存</el-button>
      </sticky>
      <el-alert id="templateAlert" type="info" :closable="false" title="提示" style="margin-top:10px">
        <ul>
          <li>本页面分为左侧【编辑区】和右侧【预览区】，在【编辑区】编辑的内会实时的显示在右侧【预览区】</li>
          <li>编辑完毕后点击右上角【保存】按钮即可保存，保存后仍然可以继续编辑，若放弃编辑点击左上角【返回】按钮即可</li>
          <li>
            变量使用
            <span class="text-primary">${变量名称}</span>插入。如：
            <span class="text-primary">${客户姓名}</span>，
            <span class="text-primary">${证件号}</span>，也可使用【插入变量】插入
          </li>
        </ul>
      </el-alert>

      <el-form ref="updateForm" :model="submitData" :rules="rules">
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput
            id="templateTitle"
            v-model="submitData.title"
            :maxlength="100"
            name="name"
            required
            @keydown.enter.prevent.native
          >模板名称</MDinput>
        </el-form-item>
        <el-form-item id="templateContent" prop="content">
          <tinymce ref="editor" v-model="submitData.content" :height="height" />
        </el-form-item>
      </el-form>
    </div>
    <template-preview
      id="templatePreview"
      :content="submitData.content"
      style="float:right;margin-right:20px;"
    />
    <guide
      :guide-show="guideShow"
      guide-key="CLOSE-GUIDE-TEMPLATE-DETAIL"
      :steps="[{
        element: '#templateTitle',
        popover: {
          title: '模板名称',
          description: '在此输入模板名称',
          position: 'bottom'
        }
      }, {
        element: '#templateContent',
        popover: {
          title: '编辑区',
          description: '在此键入模板内容，在需要插入变量的地方输入：<span class=\'text-primary\'>${变量名称}</span>即可',
          position: 'top'
        }
      }, {
        element: '#templatePreview',
        popover: {
          title: '预览区',
          description: '此区域显示在手机上查看时的效果，在【编辑区】输入的内容，会实时的在此区域显示',
          position: 'left'
        }
      }, {
        element: '#templateAlert',
        popover: {
          title: '提示区',
          description: '此区域显示一些注意事项',
          position: 'bottom'
        }
      }, {
        element: '.el-button.el-button--primary',
        popover: {
          title: '保存',
          description: '编辑完成后，点击此按钮保存编辑内容',
          position: 'bottom'
        }
      }, {
        element: '.el-button.el-button--default',
        popover: {
          title: '返回',
          description: '点击此按钮返回到模板列表',
          position: 'bottom'
        }
      }]"
    />
  </div>
</template>

<script>
import { fetchTemplate, updateTemplate } from '@/api/template'
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import Guide from '@/components/Guide'
import TemplatePreview from './Preview'

export default {
  name: 'TemplateDetail',
  components: { Tinymce, MDinput, Sticky, Guide, TemplatePreview },
  data() {
    return {
      options: {
        projects: [
          // { id: 1, name: '项目' }
        ]
      },
      submitData: {
        id: undefined,
        title: '', // 模板名称
        content: '', // 模板内容
        digest: '', // 模板摘要
        enableComment: true
      },
      loading: false,
      rules: {
        title: [{ required: true, message: '模板名称不能为空' }]
      },
      height: 400,
      guideShow: false
    }
  },
  created() {
    // this.height = document.body.clientHeight - 380
    this.fetchData(this.$route.params && this.$route.params.id)
  },
  mounted() {
    this.$nextTick(() => {
      this.guideShow = true
    })
  },
  methods: {
    fetchData(id) {
      if (!id) {
        return
      }
      fetchTemplate(id)
        .then(response => {
          this.submitData = response.data
          this.submitData.id = +id
        })
        .catch(error => {
          this.$message.error(error.response.data || '模板不存在')
        })
    },
    submitForm() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.loading = true
          updateTemplate(this.submitData)
            .then(response => {
              this.$message.success('操作成功')
              this.submitData.id = response.data
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

<style lang="scss" scoped>
.createPost-container {
  position: relative;
  .createPost-main-container {
    float: left;
    padding: 0px 20px;
    width: calc(100% - 364px - 20px);
  }
}
</style>
