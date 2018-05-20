<template>
  <el-container>
    <el-header>
    <div class="title">{{title}}</div>
    <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">{{currentNet}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">Mainnet</el-dropdown-item>
        <el-dropdown-item command="b">Testnet</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </el-header>
    <el-main class="main-section">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">星云DAPP排行榜</el-menu-item>
      <el-menu-item index="2">添加我的DAPP</el-menu-item>
    </el-menu>
    <transition name="fade">
    <div class="main-card" v-if="activeIndex=='1'" v-loading="listLoading" element-loading-text="正在获取项目列表...">
        <br>
        <el-row :gutter="24" v-if="cards">
          <el-col :span="24" v-for="(o, index) in cards" :key="o.id">
              <card :cardInfo="cards[index]" @submitReward="submitReward" :isLoading="loading"></card>
          </el-col>
        </el-row>
    </div>
    <div class="main-card" v-else v-loading="loading" element-loading-text="交易确认中，请耐心等待...">
        <add-dapp @submitData="submitData"></add-dapp>
    </div>
    </transition>
    </el-main>
    <el-footer>
      <div class="footer">
          Copyright © 2018 {{title}}
      </div>
    </el-footer>
  </el-container>
  
</template>

<script>
import Card from './Card.vue'
import AddDapp from './AddDapp.vue'
import QueryCard from './QueryCard.vue'
const Nebulas = require('nebulas')
const Utils = Nebulas.Utils
const neb = new Nebulas.Neb()
const NebPay = require("nebpay.js")
const nebPay = new NebPay()
 
export default {
  data() {
    return {
      title: '星云商店',
      loading: false,
      listLoading: false,
      activeIndex: '1',
      currentNet: 'Mainnet',
      //currentNet: 'Testnet',
      address: {
        Mainnet: {
          fromAddress: 'n1ThFycuaH4HPQjoJMmQoNoWerfmQADSfT3',
          contractAddress: 'n23BUiGryhfZWsTTZFZDJM6UytB7qrgZNxY',
          baseUrl: 'https://mainnet.nebulas.io'
        },
        Testnet: {
          fromAddress: 'n1KKKkRQFe84epWkTtYU1UY1rVn63fWPf3v',
          contractAddress: 'n1i1dB61uPLZTarnJM3wsgLn8kHWCwsDuMB',
          baseUrl: 'https://testnet.nebulas.io'
        }
      },
      cards: [],
      successTip: '快去『星云DAPP』那里查看自己的项目吧~',
      addTip: '快去『星云DAPP』那里查看自己的项目吧~',
      rewardTip: '打赏成功，您的支持会激励作者开发出更好的作品~',

    };
  },
  computed: {
    contractAddr: function() {
      return this.address[this.currentNet].contractAddress
    }
  },
  components: {
    AddDapp,
    QueryCard,
    Card
  },
  created() {
    neb.setRequest(new Nebulas.HttpRequest(this.address[this.currentNet].baseUrl))
    this.fetchAppList()
    //const b = ['星云名片', '可以在其中添加和更新自己的名片信息，还可以根据地址查询别人的名片，介绍自己的时候就可以直接发个钱包地址给他了~', 'https://nebstore.io/business-card/', 'https://s1.ax1x.com/2018/05/13/CDNi01.jpg', 'Xat_MassacrE', 'n1xkpw3Aq1713pQpwVRBKcP1SL3VBEhUSFQ']
    //const a = ["星云商店", "用户可以提交自己的作品，包括访问地址，预览图片地址，项目简介，项目名称，合约地址。浏览本项目的用户如果觉得你的项目很棒，可以选择打赏，用户为了获得更靠前的位置也可以自己给自己的项目打赏，打赏金额越多，项目排名越靠前，平台收取打赏金额的10%作为网站的维护费用的，剩余的90%将会发送给项目作者。", "https://nebstore.io/", "https://s1.ax1x.com/2018/05/14/Cri36J.jpg", "Xat_MassacrE", "n23BUiGryhfZWsTTZFZDJM6UytB7qrgZNxY"]
  },
  methods: {
    submitData(data) {
      this.addDapp(data)
    },
    handleSelect(key) {
      this.activeIndex = key
    },
    handleCommand(command) {
      if (command == 'a') {
        this.currentNet = 'Mainnet'
      } else {
        this.currentNet = 'Testnet'
      }
      neb.setRequest(new Nebulas.HttpRequest(this.address[this.currentNet].baseUrl))
      this.fetchAppList()
    },
    addDapp(data) {
      console.log(data, this.contractAddr)
      this.successTip = this.addTip
      const value = 0
      const callFunction = 'add'
      const args = [data.title, data.desc, data.website, data.thumbUrl, data.author, data.contract]
      const callArgs = JSON.stringify(args)
      nebPay.call(this.contractAddr, value, callFunction, callArgs, {
        listener: this.cbPush
      });
    },
    cbPush(resp) {
      this.loading = true
      const that = this
      console.log("response of push: " + JSON.stringify(resp))
      var intervalQuery = setInterval(() => {
        neb.api.getTransactionReceipt({hash: resp["txhash"]}).then((receipt) => {
          console.log("判断数据提交到区块链的状态")
          if (receipt["status"] === 2) {
            console.log("pending.....")
          } else if (receipt["status"] === 1){
            console.log("交易成功......")
            that.loading = false
            that.$confirm(that.successTip, '交易成功', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
                that.activeIndex = '1'
                that.fetchAppList()
              })
            clearInterval(intervalQuery)
          } else {
            console.log("交易失败......")
            that.loading = false
            that.$confirm('请检查参数是否正确', '交易失败', {
              confirmButtonText: '确定',
            })
            clearInterval(intervalQuery)
          }
        });
      }, 5000);
    },
    submitReward(data) {
      console.log(data)
      const id = data[0]
      const value = data[1]
      const callFunction = 'reward'
      const args = [id]
      const callArgs = JSON.stringify(args)
      this.successTip = this.rewardTip
      nebPay.call(this.contractAddr, value, callFunction, callArgs, {
        listener: this.cbPush
      });
    },
    compare(property) {
      return function(obj1, obj2){
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value2 - value1;
      }
    },
    fetchAppList() {
      this.listLoading = true
      const that = this;
      let params = {};

      params.from = this.address[this.currentNet].fromAddress
      params.to = that.contractAddr

      // prepare gasLimit
      params.gasLimit = Utils.toBigNumber(200000);
      params.gasPrice = Utils.toBigNumber(1000000);

      // prepare value
      let value = Utils.toBigNumber(0);
      params.value = value;

      // prepare contract
      params.contract = {
        "function": "fetchAppList",
        "args": ""
      };
      neb.api
        .call({
          from: params.from,
          to: params.to,
          value: params.value,
          nonce: params.nonce,
          gasPrice: params.gasPrice,
          gasLimit: params.gasLimit,
          contract: params.contract
        })
        .then(function(resp) {
          if (resp.execute_err) {
            that.listLoading = false
            that.$message.error(resp.execute_err)
          } else {
            var data = JSON.parse(resp.result)
            if (data) {
              that.listLoading = false
              that.cards = data.sort(that.compare('totalRewards'))
            } else {
              that.listLoading = false
              that.$confirm('先去添加一个自己的项目吧~', '暂时没有项目列表', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                  that.activeIndex = '2'
                })
            }
          }
        })
        .catch(function(err) {
          that.loading = false
          that.$message.error(err.message);
        });
    }
  }
}
</script>

<style>
body {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  display: flex;
  min-height: 98vh;
  flex-direction: column;
  font-size: 1.5rem
}

.el-container {
  align-items: center;
}
.main-section {
  width: 80%;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 1.2rem;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.title {
  font-size: 2rem;
}

.main-card {
  margin-top: 20px;
}

header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer {
  text-align: center;
  color: #b2b2b2;
}
footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
