<template>
  <div class="poker-timer-ready-section" v-if="visibility">
    <div class="timer-down">
      <el-progress type="circle" :percentage="percent"  :width="80" :color="color" :format="formatShow"></el-progress>
    </div>
    <div class="button-action">
      <el-button @click="userReady">Ready</el-button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
const timer_left_limit = 60;
export default {
  data() {
    return {
      //visibility: false,
      timer: null,
      timeleft: timer_left_limit
    }
  },

  computed: {
    ...mapState({
      socket: state => state.poker.socket,
      mySeat: state => state.poker.mySeat,
      visibility: state => state.poker.readyTimeerVisibility,
      current_table_data: state => state.poker.current_table_data,
    }),

    color(){
      let __c = '#ffc107';
      return __c;
    },

    percent(){
      return (timer_left_limit - this.timeleft) / timer_left_limit * 100;
    }
  },

  mounted() {
    this.timer_left = timer_left_limit;
    
  },

  watch: {
    mySeat(newVal, oldVal){
      // Kiểm tra chỗ ngồi đã
      if(!this.mySeat)
        return false;

      //Nếu ready tức là dealer sẽ bỏ qua timer
      if(this.current_table_data !== undefined && this.current_table_data.seats[this.mySeat].ready)
        return;

      if(newVal !== null){
        this.$store.commit('poker/SET_READY_TIMEER_VISIBILITY', true);
        this.setTimeLeft();
        this.timer_start();
      }else{
        this.$store.commit('poker/SET_READY_TIMEER_VISIBILITY', false);
      }
    },

    visibility(newVal, oldVal){
      if(newVal && newVal !== oldVal && this.timer === null){
        this.setTimeLeft();
        this.timer_start();
      }
    }
  },

  methods: {
    formatShow(){
      return this.timeleft;
    },

    setTimeLeft(){
      this.timeleft = timer_left_limit;
    },

    timer_start() {
      let _this = this;
      if (this.timer !== null) return;
      this.timer = setInterval(function() {
        _this.updateTimer(_this.timeleft);

        if (_this.timeleft > 0) {
          _this.timeleft--;
        } else if (_this.timeleft == 0) {
          _this.timer_stop();
          _this.$emit('on-left-table', true);
        }
      }, 1000);
    },

    timer_stop() {
      this.updateTimer(0);
      
      clearInterval(this.timer);
      this.timer = null;
      this.$store.commit('poker/SET_READY_TIMEER_VISIBILITY', false);
    },

    userReady(){
      this.timer_stop();
      
      this.socket.emit( 'userReady', function( response ) {
        console.log(response)
      });
    },

    updateTimer(time){
      this.socket.emit( 'updateReadyTime', time, function( response ) {
        //console.log(response)
      });
    },
  },
}
</script>

<style>
.poker-timer-ready-section{
  position: absolute;
  top: calc(50% - 90px);
  left: calc(50% - 120px);
  text-align: center;
  width: 100px;
  /* background-color: rgba(255,255,255,0.5); */
  background: radial-gradient(circle, rgba(37,103,37,0.7931547619047619) 0%, rgba(252,70,107,0) 74%);
  padding: 30px 70px;
}

.poker-timer-ready-section .el-progress__text{
  color: #FFF;
  font-size: 20px!important;
  font-weight: bold;
}

.poker-timer-ready-section .el-button{
  background-color: #3b9962;
  color: #FFF;
  border-color: #FFF;
  margin-top: 10px;
}

.poker-timer-ready-section .el-button:hover{
  background-color: #2ebb69;
}



@media screen and (min-width: 375px) and (max-width: 570px) {
  .poker-timer-ready-section .el-button {
    background-color: #3b9962;
    color: #FFF;
    border-color: #FFF;
    margin-top: 6px;
    padding: 8px;
}
}



</style>