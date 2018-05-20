<template>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="项目名称" prop="title" required>
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="项目介绍" prop="desc" required>
        <el-input v-model="form.desc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="访问地址" prop="website" required>
        <el-input v-model="form.website"></el-input>
      </el-form-item>
       <el-form-item label="预览图 URL" prop="thumbUrl" required>
        <el-input v-model="form.thumbUrl"></el-input>
      </el-form-item>
      <el-form-item label="作者名称" prop="author" required>
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="合约地址" prop="contract" required>
        <el-input v-model="form.contract"></el-input>
      </el-form-item>
      <el-form-item class="submit-line-item">
        <el-button type="primary" @click="submitForm('form')">立即添加</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: '',
        desc: '',
        website: '',
        thumbUrl: '',
        author: '',
        contract: '',
      },
      rules: {
        desc: [
          { required: true, message: '请输入项目简介', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入你的项目名称', trigger: 'blur' }
        ],
        thumbUrl: [
          { required: true, message: '请输入项目的预览图地址', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入项目的作者名称', trigger: 'blur' }
        ],
        website: [
          { required: true, message: '请输入项目的访问网址', trigger: 'blur' }
        ],
        contract: [
          { required: true, message: '请输入项目的合约地址', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submitData', this.form)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style>
.submit-line-item .el-form-item__content {
  display: flex;
  justify-content: space-around;
}
</style>
