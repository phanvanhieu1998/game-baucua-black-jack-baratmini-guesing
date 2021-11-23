<template>
  <div class="poker-timer-action" v-if="visibility">
    <el-progress type="circle" 
      color="#FFFF00"
      :percentage="percent" 
      :format="() => timeleft" :width="60"></el-progress>
  </div>
</template>

<script>
import {mapState} from 'vuex'
const timer_left_limit = 600;

export default {
  data() {
    return {
      timer_enable: true,
      timer: null,
      timeleft: timer_left_limit
    }
  },

  props: {
    isDeadler: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState({
      socket: state => state.poker.socket,
      mySeat: state => state.poker.mySeat,
      visibility: state => state.poker.actionTimeerVisibility,
      current_table_data: state => state.poker.current_table_data,
      actionState: state => state.poker.actionState,
    }),

    percent(){
      return (timer_left_limit - this.timeleft) / timer_left_limit * 100;
    },

    isActiveSeat(){
      return this.current_table_data.activeSeat === this.mySeat;
    },

    phase(){
      return this.current_table_data.phase;
    }
  },

  watch: {
    phase(newVal, oldVal){
      console.log(newVal, oldVal);
      let _this = this;
      if(newVal === 'smallBlind' && oldVal === 'river'){
        this.$store.commit('poker/SET_ACTION_TIMEER_VISIBILITY', false);
        setTimeout(() => {
          _this.updateTimer(0);
          clearInterval(_this.timer);
          _this.timer = null;
        }, 200);
      }
    },

    visibility(newVal, oldVal){
      let _this = this;

      if(this.isDeadler && this.actionState === 'postSmallBlind'){
        this.$store.commit('poker/SET_ACTION_TIMEER_VISIBILITY', false);
        return;
      }
        
      setTimeout(() => {
        if(newVal && newVal !== oldVal && this.timer === null && _this.isActiveSeat){
          _this.setTimeLeft();
          _this.timer_start();
        }
      }, 100);

      if(!newVal && newVal !== oldVal){
        this.updateTimer(0);
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  },

  mounted() {
    this.timer_left = timer_left_limit;
  },

  methods: {
    setTimeLeft(time){
      if(typeof time !== 'undefined' && !Number.isInteger(time) && time > 0){
        this.timeleft = time;
      }else{
        this.timeleft = timer_left_limit;
      }
    },

    timer_start() {
      if(!this.timer_enable) return;

      let _this = this;
      if (this.timer !== null) return;
      this.timer = setInterval(function() {
        _this.updateTimer(_this.timeleft);

        if (_this.timeleft > 0) {
          _this.timeleft--;
        } else if (_this.timeleft == 0) {
          _this.timer_stop();
        }
      }, 1000);
    },

    timer_stop() {
      //Do somthing before stop
      this.$emit('on-timeleft', true);
      this.updateTimer(0);

      //Stop
      clearInterval(this.timer);
      this.timer = null;
      this.$store.commit('poker/SET_ACTION_TIMEER_VISIBILITY', false);
    },

    updateTimer(time){
      this.socket.emit( 'updateActionTime', time, function( response ) {
        //console.log(time, response)
      });
    },
  },

  destroyed() {
    console.log('Timer destroyed')
  },
}
</script>

<style>
.poker-timer-action .el-progress__text{
  font-size: 16px!important;
  font-weight: bold;
  color: #FFFF00;
}

.poker-timer-action svg path.el-progress-circle__track{
  stroke: #0c6751;
}

.poker-game-play-actions .poker-timer-action{

  position: absolute;
  left: 20px;
  top: 0;
}
</style>