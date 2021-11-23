<template>
  <div>
    <div class="cashout">
      <div class="cashout--credit">
				{{this.withdraw }}
        <span>
          CREDIT LINE: {{cashier.credit | price}}
        </span>
        <span v-if="data_in.withdraw == undefined">
          WITHDRAWAL: $0
        </span>
        <span v-else>
          WITHDRAWAL: {{-cashier.withdrawal | price(false)}}
        </span>
        <span>
          MAX CASHOUT: {{maximumCashout | price(false)}}
        </span>
      </div>

      <div class="cashout--input">
        <div class="cashout--input-wrapper cashout--input--withdraw">
          <span :class="{'current-label': currentDefault == 'withdraw'}" @click="focusInput('withdraw')">WITHDRAW:</span>
          
          <el-input 
            type="tel"
            ref="refWithdrawal"
            :disabled="currentDefault != 'withdraw' && currentDefault !=''" 
            @focus="focusInput('withdraw')" 
            @keyup.native="inputNumber"  
            v-model="data_in.withdraw"
            placeholder="Enter a mount">
          </el-input>
        </div>
        <div class="cashout--input-wrapper cashout--input--cashout">
          <span :class="{'current-label': currentDefault == 'cashout'}" @click="focusInput('cashout')">CASHOUT:</span>
           <el-input 
            type="tel"
            ref="refCashout"
            :disabled="currentDefault != 'cashout' && currentDefault !=''" 
            @focus="focusInput('cashout')"  
            v-model="data_in.cashout"
            placeholder="Enter a mount">
          </el-input>
        </div>
      </div>
      <div class="request">
        <el-button  @click="cashoutRequest" :loading="loading">REQUEST</el-button>
      </div>
    </div>

    <div class="return--to--lobby" >
      <el-button type="success" @click="backGameList">RETURN TO LOBBY</el-button>
    </div> 
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	data(){
		return{
			data_in: {
        withdraw: '',
			  cashout: '',
      },
      currentDefault:'',
      value:0,
      loading: false
		}
	},
  props:{
		balance:{
			default:() =>{},
      type:Number
		}
	},

  mounted(){
    this.loadData()
  },

  computed:{
    ...mapState({
      cashier : state => state.cashier,
      //credit : state => state.cashier.credit,
      //cashout1 : state => state.cashier.cashout,
      //withdrawal : state => state.cashier.withdrawal,
    }),

    totalMax(){
      if(this.balance < this.credit){
        return this.balance
      }
      else{
        return this.credit
      }
    },
    
    maxWithdraw(){
      let maxWithdraw = parseFloat(this.cashier.credit) - parseFloat(this.cashier.withdrawal)
      return maxWithdraw.toFixed()
    },

    maximumCashout(){
      let max = parseFloat(this.balance) - parseFloat(this.cashier.withdrawal);
      return max < 0? 0: max.toFixed(2);
    }
  },
	methods:{
    focusInput(key){
      let _this = this
      this.currentDefault = key

      switch (key) {
        case 'withdraw':
          setTimeout(() => {
            _this.$refs.refWithdrawal.focus();
            _this.data_in.cashout = '';
          }, 200);
          break;

        case 'cashout':
          setTimeout(() => {
            _this.$refs.refCashout.focus();
            _this.data_in.withdraw = ''
          }, 200);
          break;
      
        default:
          break;
      }

      if(this.currentDefault != 'withdraw' && this.currentDefault !='' ){
        this.withdraw = 0
      }
      if(this.currentDefault != 'cashout' && this.currentDefault !='' ){
        this.cashout = 0
      }
    },

    inputNumber(event){
      //this.withdraw =  parseFloat(event.target.value)
    },

    loadData(){
      this.$store.dispatch('get_cash_out_info')
    },

    backGameList(){
      this.$emit('back-list',true)
    },

		cashoutRequest(){
      let key = this.currentDefault

      if (key === '' || (!this.data_in.withdraw && !this.data_in.cashout) ) {
        this.$message({
          message: this.$t("Please enter an amount."),
          type: "warning",
        });
        return;
      }

      if (isNaN(this.data_in.withdraw) || isNaN(this.data_in.cashout)) {
        this.$message({
          message: this.$t("MSG_FILL_A_NUMBER"),
          type: "warning",
        });
        return;
      }

      let data_value = this.data_in[key];

      if(key === 'cashout' && parseFloat(data_value) > this.maximumCashout){
        this.$message({
          message: 'The amount you requested exceeded your max cashout. Please try a lower amount.',
          type: "warning",
        });
        return;
      }

      if(key === 'withdraw' && parseFloat(data_value) > (this.cashier.credit - this.cashier.withdrawal) ){
        this.$message({
          message: 'The amount you requested exceeded your credit line limit. Please try a lower amount.',
          type: "warning",
        });
        return;
      }

      //Thay đổi key một tí cho giống ở backend admin
      key = (key === 'withdraw')? 'withdrawal': key;

      let data = {
        [key]: data_value
      }

      this.loading = true;
      this.$store.dispatch('user_cash_out', data).then((res)=>{
        if(!res.errors){
          this.$store.commit('SET_CASHIER', res.cashier)
          this.$store.commit('SET_BALANCE',parseFloat(res.user_points))
          this.$message({
            message: this.$t(res.message),
            type: "success",
          });
          this.data_in.withdraw = '';
          this.data_in.cashout = '';
        }else{
          this.$message({
              message: this.$t(res.message),
              type: "warning",
          });
        }

        this.loading = false;
      }).catch( error => {
        this.loading = false;
      })
		}
	}
}
</script>

<style>
.cashout{
	margin: 10px 0;
	width: 300px;
	height: auto;
	background-color: #1e6942;
	border: 2px solid white;
  border-radius: 10px;
}
.cashout--credit{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.cashout--credit span{
	font-size: 15px;
  font-weight: bold;
  margin: 10px;
	color: #ffffff;

}
.cashout--input {
color: #ffffff;
	font-size: 15px;
  font-weight: bold;
	line-height: 40px;
  padding: 20px 10px;
}
.cashout--input .el-input__inner{
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
.cashout--input--withdraw{
	margin-bottom: 10px;
}
.cashout--input--withdraw span{
  cursor: pointer;
}
.cashout--input--cashout{
	margin-bottom: 15px;
}
.cashout--input--cashout span{
 cursor: pointer;
}

.request{
  text-align: center;
  margin-bottom: 20px;
}
.request .el-button {
  background-color: #8be6a6;
  color: black;
}
.request .el-button:hover{
  background-color: #8be6a6;
  color: black;
}
.return--to--lobby{
  text-align: center;
}
.return--to--lobby .el-button{
  background-color: #e4ffb1;
	margin-bottom: 10px;
  color: black;
  border:  2px solid #edefef;
}
.return--to--lobby .el-button:hover{
  background-color: #e4ffb1;
	margin-bottom: 10px;
  color: black;
}

.cashout--input-wrapper{
  display: block;
  width: 100%;
  clear: both;
  float: left;
}

.cashout--input-wrapper > span{
  display: block;
  float: left;
  width: 110px;
}

.cashout--input-wrapper > .el-input{
  width: calc(100% - 110px);
  float: right;
  text-align: center;
}

.cashout .current-label{
  color: orange;
}

@media only screen and (max-width: 575px) {
  .cashout--credit span{
    margin: 5px;
  }
  .cashout--input{
     padding: 10px ;
  }
  
}
@media screen and (min-width: 576px) and (max-width: 1024px) {
 .cashout{
   margin-bottom: 40px;
 }
 .return--to--lobby .el-button{
   margin-bottom: 30px;
 }
}
</style>