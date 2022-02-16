<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <el-popover v-model="visiblePopover" placement="top-end" width="400" trigger="click" @after-enter="afterEnterPopover">
        <el-form label-width="6rem">
          <el-form-item label="固定变量">
            <el-button @click="handleInsertVariable(true, '变量A')">变量A</el-button>
            <el-button @click="handleInsertVariable(true, '变量B')">变量B</el-button>
          </el-form-item>
          <el-form-item label="自定义变量">
            <el-input ref="variableNameInput" v-model="variableName" placeholder="输入变量名称">
              <el-button slot="append" @click="handleInsertVariable(true)">插入</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="warning" @click="handleInsertVariable(false)">取消</el-button>
          </el-form-item>
        </el-form>
        <el-alert type="info" :closable="false">
          通过此功能插入变量，直接写变量名称即可，<span class="text-primary">无需输入</span>${}
        </el-alert>
        <el-button slot="reference" type="primary">插入变量</el-button>
      </el-popover>
      <el-popover v-model="visibleUploadImagePopover" placement="top-end" width="386" trigger="click">
        <el-form>
          <el-form-item>
            <el-upload
              ref="upload"
              drag
              :limit="1"
              :headers="{'X-USER-TOKEN':token}"
              accept="image/jpeg,image/png"
              :show-file-list="false"
              :action="`${BASE_API}/bytes`"
              :before-upload="handleBeforeUpload"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">只支持png、jpg文件，且不超过10Mb</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="visibleUploadImagePopover = false">关闭</el-button>
          </el-form-item>
        </el-form>
        <el-button slot="reference" type="success">插入本地图片</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API,
      token: store.getters.token,
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      visiblePopover: false,
      variableName: '',
      visibleUploadImagePopover: false
    }
  },
  computed: {
    language() {
      return 'zh_CN'
    },
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        language: this.language,
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 500,
        code_dialog_width: 800,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    afterEnterPopover() {
      this.$refs.variableNameInput.focus()
    },
    handleInsertVariable(insert, variableName) {
      variableName = variableName || this.variableName
      this.visiblePopover = false
      this.variableName = ''
      if (!insert || !variableName) { return }
      const _this = this
      window.tinymce.get(_this.tinymceId).insertContent('${' + variableName + '}')
    },
    handleBeforeUpload(file) {
      if (!/^image\/(jpeg|png)$/i.test(file.type)) {
        this.$message.error('只支持png、jpg文件')
        return false
      } else if (file.size > 1024 * 1024 * 10) {
        this.$message.error('上传文件大小不能超过10Mb!')
        return false
      }

      const vm = this
      const reader = new FileReader()
      reader.addEventListener('load', function() {
        window.tinymce.get(vm.tinymceId).insertContent(`<img src="${this.result}"/>`)
        vm.visibleUploadImagePopover = false
      }, false)
      reader.readAsDataURL(file)
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
