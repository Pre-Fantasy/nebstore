<template>
<div class="neb-card" v-if="cardInfo">
  <img :src="cardInfo.thumbUrl" class="image" >
  <div class="info">
    <h1>{{cardInfo.title}}</h1>
    <h2>项目作者：{{cardInfo.author}}</h2>
    <p class="summary">项目简介：{{cardInfo.desc}}</p>
  </div>
  <div class="reward">
      <span>总计获得打赏：<b class="total-rewards">{{reward}}</b> NAS</span>
    <el-button type="text" class="button" @click="viewDapp">去看看他的 DAPP</el-button>
    <el-button type="primary" @click="dialogFormVisible = true" :loading="isLoading">{{rewardText}}</el-button>
  </div>
  <el-dialog title="给他打赏（最小 0.001 NAS）" :visible.sync="dialogFormVisible">
    <el-form class="demo-form-inline" label-width="150px" :model="form" :rules="rules">
      <el-form-item label="打赏金额（NAS）" :inline="true">
        <el-input v-model="form.value" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitReward">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
const Nebulas = require('nebulas')
export default {
  props: ['cardInfo', 'isLoading'],
  data() {
    return {
      currentDate: new Date(),
      dialogFormVisible: false,
      rewardText: '打赏',
      form: {
        value: 0.1
      },
      rules: {
        value: [
          { required: true, message: '请输入打赏的金额（单位 NAS）', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    reward() {
      return parseFloat(Nebulas.Unit.fromBasic(this.cardInfo.totalRewards, "nas"), 5)
    }
  },
  methods: {
    viewDapp() {
      window.open(this.cardInfo.website)
    },
    submitReward() {
      this.dialogFormVisible = false
      this.$emit('submitReward', [this.cardInfo.id, this.form.value])
    },
  }
}
</script>
<style>
.neb-card {
  display: flex;
  width: 100%;
  height: 200px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3);
  margin: 0 auto 2%;
  overflow: hidden;
  position: relative;
  font-size: 14px;
  line-height: 1.45em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.neb-card .image {
  height: 100%;
  min-width: 200px;
}

.reward {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.total-rewards {
  font-size: 1.5rem;
  font-weight: 700;
}

.info {
    width: 60%;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    margin-left: 10px;

    h1 {
        font-family: "Roboto";
        line-height: 1em;
        margin: 0 0 10px 0;
    }

    h2 {
        font-family: "Open Sans";
        line-height: 1.2em;
        text-transform: uppercase;
        font-size: 1em;
        font-weight: 400;
        margin: 1.2% 0;
    }

    p {
        position: relative;
        margin: 0;
        padding-top: 20px;

        &:after {
            content: "";
            height: 6px;
            width: 40px;

            /*POSITION*/
            position: absolute;
            top: 6px;
            left: 0;
        }
    }

    a {
        margin-bottom: 10px;
        float: right;

        &:after {

            content: "\f061";
            font-family: FontAwesome;
            margin-left: -10px;
            opacity: 0;
            vertical-align: middle;
        }

        &:hover:after {
            margin-left: 5px;
            opacity: 1;
        }
	}
}
</style>
