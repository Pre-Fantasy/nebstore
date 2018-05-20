<template>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="输入钱包地址" required prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('form')" plain size="medium" style="width: 100%">查询</el-button>
    </el-form>
</template>

<script>
export default {
  props: ['address'],
  data() {
    return {
      form: {
        address: ''
      },
      rules: {
        address: [
          { required: true, message: '请输入你想查询的地址'}
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submitAddr', this.form.address)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style>
</style>
