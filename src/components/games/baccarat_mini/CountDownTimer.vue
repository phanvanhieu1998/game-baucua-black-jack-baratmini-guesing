<template>
  <span class="count-down-timer" v-if="this.timerCount">{{displayCoundown}}S</span>
</template>

<script>
export default {
  data() {
    return {
      timerCount: 0,
      timer: null
    }
  },

  props: {
    count: {
      type: [Number, String],
      default: 0
    }
  },

  computed:{
    displayCoundown(){
      return this.timerCount < 10? '0'+this.timerCount: this.timerCount;
    }
  },

  mounted() {
    //this.play();
    this.count = parseInt(this.count)
    this.timerCount = this.count;
  },

  methods: {
    play() {
      let _this =  this
      this.timerCount = this.timerCount === 0? this.count: this.timerCount;

      clearInterval(this.timer);
      this.timer = setInterval(function(){
        if(_this.timerCount <= 0){
          this.timerCount = 0;
          _this.$emit('end-time', true);
          clearInterval(_this.timer);
        }else{
          _this.timerCount--;
        }
      }, 1000)
    },

    pause() {
      clearInterval(this.timer);
    },

    reset() {
      this.timerCount = 0;
      this.play();
    }
  },
}
</script>

<style>
.count-down-timer{
  font-size: 18px;
  color: #FFFF00;
  line-height: 30px;
  margin-right: 5px;
}
</style>