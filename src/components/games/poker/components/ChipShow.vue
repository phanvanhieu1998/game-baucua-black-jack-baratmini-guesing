<template>
  <div class="total-chip-show" :total-chip="totalChip">
    <div :class="[key]" v-for="(value, key) in chips" :key="key">
      <div :class="[`${key}_${index}`]" v-for="(item, index) in value" :key="index" :style="`top: ${-index * 5}px`" >
          <img :src="`${wp_theme_url}images/${key}.png`">
      </div>
    </div>
  </div>
</template>

<script>
import chip from "./../Chip"

export default {
  data() {
    return {
      chips: {}
    }
  },


  // total-chip="245"
  props: {
    totalChip: {
      type: Number,
      default: 0
    }
  },

  computed:{
    wp_theme_url() {
      return this.$store.state?.WP_THEME_APP_URL || process.env.VUE_APP_PUBLIC_PATH;
    },
  },

  watch: {
    totalChip(newVal, oldVal){
      if(newVal !== oldVal){
        this.chips = chip.build(this.totalChip)
      }
    }
  },

  mounted() {
    //this.chips = chip.build(this.totalChip)
    //console.log(this.chips)
  },
}
</script>
<style >
.total-chip-show{
    position: absolute;
    z-index: 1;
    width: 175px;
    top: 38%;
    left: 38%;
    display: flex;
    justify-content: center;
}
.total-chip-show > div:empty{
  display: none;
}
.total-chip-show img {
  width: 40px;
  height: 40px;
}
.chip_100{

  width: 40px;
  height: 40px;
}
.chip_25{

    width: 40px;
  height: 40px;
}
.chip_5{

    width: 40px;
  height: 40px;
}
.chip_1{

    width: 40px;
  height: 40px;
}
.chip_100 div{
  position: absolute;
}
.chip_25 div{
  position: absolute;

}
.chip_5 div{
  position: absolute;
 
}
.chip_1 div{
  position: absolute;
 
}
@media screen and (min-width: 375px) and (max-width: 570px) {
  .total-chip-show{
    position: absolute;
    z-index: 1;
   width: 175px;
       top: 31%;
    left: 28%;
    display: flex;
    justify-content: center;
}
.total-chip-show img {
  width: 20px;
  height: 20px;
}
.chip_100{

  width: 20px;
  height: 20px;
}
.chip_25{

  width: 20px;
  height: 20px;
}
.chip_5{

  width: 20px;
  height: 20px;
}
.chip_1{

  width: 20px;
  height: 20px;
}

}
</style>
