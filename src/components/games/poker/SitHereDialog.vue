<template>
  <div>
    <el-dialog
      custom-class="game_poker_join"
      :append-to-body="true"
      :title="`${current_table_info.name} Table`"
      :visible.sync="dialogVisible"
      width="280px"
     
      :before-close="handleClose"
      :close-on-click-modal="allowClose"
      @open="modalOpen">
      <el-row class="current_table_info">{{current_table_info.name}} Table</el-row>
      <el-row>Min buy in: {{ current_table_info.minBuyIn | price }}</el-row>
      <el-row>Max buy in: {{ current_table_info.maxBuyIn | price }}</el-row>
      <el-row>Balance: $4.000</el-row>
      <el-row>
        <div style="display:flex">
          <el-input size="small" type="number" v-model="amount_buy_in"></el-input>
          <el-button type="primary" @click="sitOnTheTable">SIT</el-button>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      dialogVisible: false,
      amount_buy_in: 0,
      message: '',
      allowClose: false
    }
  },

  props: {
    position: {
      type: Number,
      default: 0
    }
  },

  computed: {
    ...mapState({
      socket: state => state.poker.socket,
      current_table_info: state => state.poker.current_table_info,
      sittingIn: state => state.poker.sittingIn,
      visibility: state => state.poker.readyTimeerVisibility,
    })
  },

  mounted() {
    
  },

  methods: {
    open(){
      this.dialogVisible = true;
    },

    handleClose(done){
      done();
    },

    modalOpen(){
      this.amount_buy_in = this.current_table_info.maxBuyIn;
    },

    /**
     * User can sit this position and play the game
     */
    sitOnTheTable(){
      let _this = this;
      this.socket.emit( 'sitOnTheTable', { 
        'seat': this.position, 
        'tableId': this.current_table_info.id, 
        'chips': this.amount_buy_in 
      }, function( response ) {
        console.log(response)
        if( response.success ){
          _this.$store.commit('poker/SET_SITTING_IN', true);
          _this.$store.commit('poker/SET_SITTING_ON_TABLE', _this.current_table_info.id);
          _this.$store.commit('poker/SET_MY_SEAT', _this.position);
          
          _this.$emit('success', true);
          _this.$store.commit('poker/SET_ACTION_STATE', 'waiting');
          _this.dialogVisible = false;

          let player = response.player;

          if(player.inHand && player.sittingIn && !player.ready &&  !_this.visibility){
            _this.$store.commit('poker/SET_READY_TIMEER_VISIBILITY', true);
          }
        } else {
          _this.$message({
            message: response.error? response.error: 'An unexpected error occurred',
            type: 'warning'
          });
          _this.allowClose = true;
        }
      });
    }
  },
}
</script>