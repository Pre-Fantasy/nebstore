<template>
  <div class="note-extension" id="noExtension" v-if="!hasExtension">
  <div role="alert" class="el-alert el-alert--warning is-center"><i class="el-alert__icon el-icon-warning"></i><div class="el-alert__content"><span class="el-alert__title" v-html="getWarn()"></span><!----><i class="el-alert__closebtn el-icon-close" style="display: none;"></i></div></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasExtension: false,
    }
  },
  created() {
    if(typeof(webExtensionWallet) === "undefined"){
      this.hasExtension = false
    }else{
      this.hasExtension = true
    }
  },
  methods: {
    getWarn() {
      return '提示：缺少插件，请先安装 <a target="_blank" href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>  再来打赏吧~ '
    },
  }
}
 
</script>
<style>
.note-extension {
  text-align: center;
  margin-bottom: 10px;
}
</style>
