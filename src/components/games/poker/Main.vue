<template>
  <div class="poker">
    <WinEffect ref="WinEffect"></WinEffect>
    <ChipShow :total-chip="totalBet"/>
    <div class="poker-game-play-section"  :class="[`poker-table-${max_slot}`]" v-if="max_slot">
      <GamePlayPosition  
        v-for="(p, index) in max_slot" :key="p" 
        :position="index" 
        :ready-time-left="readyPlayerTimer[index]"
        :action-time-left="actionPlayerTimer[index]">
      </GamePlayPosition>
      
      <div class="share_cards">
        <ShareCard :cards="shareCards"/>
      </div>

      <el-button class="start-game-button" v-if="isDeadlerCanStart" @click="startGame">START</el-button>
      <TimerReady ref="timerReady" @on-left-table="leaveTable" v-else></TimerReady>  

      <div class="share_cards">
        <ShareCard :cards="shareCards"/>-
      </div>

      <div v-if="shareCards.length > 0" class="pot-view">
        <h2>POT: <span v-for="(item, index) in current_table_data.pot" :key="index">${{item.amount}}</span></h2>
      </div>
      
      <div class="img_bg">
        <img :src="imageUrl('table.png')" alt="" />
      </div>
    </div>

    <div class="game-status">
      <div class="game-status-item">TABLE: {{current_table_data.name}}</div>
      <div class="game-status-item">
        SMALL BLIND: {{current_table_data.smallBlind | price}} 
      </div>

      <div class="game-status-item">
        BIG BLIND: {{current_table_data.bigBlind | price}}
      </div>
    </div>

    <div  class="game__poker-bet">
      <div class="poker-game-play-actions">
        <div class="cards-and-sounds">
          <div class="sound">
            <div
              class="unmuted"
              v-if="this.muted === true"
              @click="unMutedAudio"
            >
              <img src="@/assets/images/volume-mute-solid.svg" />
            </div>
            <div class="muted" v-else @click="mutedAudio">
              <img src="@/assets/images/volume-up-solid.svg" />
            </div>
          </div>

          <div class="my-cards">
            <div class="card">
              <Cards :cards="cards"/>
            </div>
          </div>

          <TimerAction @on-timeleft="doOnTimeleft" :is-deadler="isDeadler"></TimerAction>
        
          <div class="bet-range-place-bet" v-if="showBetRange">
            <el-slider v-model="betAmount" :min="minBet" :max="maxBet" :disabled="!showBetRange" @change="changeBetAmount"></el-slider>
            <el-input type="tel" v-model="betAmountInput" :disabled="!showBetRange" @change="changeBetAmount"></el-input>
          </div>
        </div>

        <div class="game--actions">
          <div  class="actions-cell actions-cell-g1">
            <el-button @click="fold()" v-show="showFoldButton" >Fold</el-button>
            <el-button class="control-button" @click="call()" v-show="showCallButton">Call {{callAmount | price}}</el-button>
            <el-button class="control-button" @click="raise()" v-show="showRaiseButton" >Raise to {{betAmount | price}}</el-button>      
          </div>

          <div  class="actions-cell actions-cell-g2">
            <el-button 
              class="control-button" 
              @click="postBlind(true)" 
              :disabled="!startAble"
              v-show="showPostSmallBlindButton" >Small Blind ({{current_table_data.smallBlind | price}})</el-button>

            <el-button class="control-button" @click="postBlind(true)" v-show="showPostBigBlindButton" >Big Blind ({{current_table_data.bigBlind | price}})</el-button>

            <el-button class="control-button" @click="check()" v-show="showCheckButton">Check</el-button>
          </div>

          <div class="actions-cell actions-cell-g3">
             <el-button class="control-button" @click="bet()" v-show="showBetButton" >Bet {{betAmount | price}}</el-button>
          </div>

          <div  class="actions-cell actions-cell-g3">
            <el-button class="control-button" @click="sitIn()" v-show="showSitIn">Sit In</el-button>
             <el-popconfirm
                title="Sit out, Are you sure?"
                @confirm="postBlind(false)"
                cancel-button-text="Cancel"
                confirm-button-text="Ok"
              >
              <el-button slot="reference" v-show="showSitOut"  >Sit Out</el-button>
             </el-popconfirm>
            <el-button @click="leaveTable()" v-show="showLeaveTableButton" >Leave Table</el-button>
          </div>

          <div class="actions-cell actions-cell-g4">
             <el-popconfirm
                title="Return to lobby, Are you sure?"
                @confirm="pokerLobby"
                cancel-button-text="Cancel"
                confirm-button-text="Ok"
              >
                <el-button  style="background-color:#0d6751" slot="reference" >Poker Lobby</el-button>
             </el-popconfirm>
              <el-button style="background-color:#0d6751" @click="dialog_tip = true">Tip Dealer</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="dialog_tip"
      center
      append-to-body
      title="Tip Dealer"
      custom-class="dialog-tip-game"
      :visible.sync="dialog_tip"
      :show-close="false"
    >
      <div class="tip-body">
        <el-input
          class="game-input"
          type="tel"
          :maxlength="6"
          v-model="tip_value"
        ></el-input>
      </div>

      <div slot="footer" class="tip-footer">
        <el-button @click="dialog_tip = false">Cancel</el-button>
        <el-button type="primary" @click="_onTipDealer">Ok</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const _ = require('lodash')

import { mapState, mapGetters } from 'vuex';
import GamePlayPosition from "@/components/games/poker/GamePlayPosition"
import Cards from './Cards.vue'
import ShareCard from './ShareCard.vue'
import TimerReady from './TimerReady.vue'
import TimerAction from './TimerAction.vue'
import sound from "./Sound";
import ChipShow from "./components/ChipShow.vue"
import WinEffect from './WinEffect.vue'

//const io = require("socket.io-client");

// Vue.use(new VueSocketIO({
//     debug: true,
//     //connection: 'http://poker.9xac.st-hitech.com',
//     connection: 'http://localhost:3000',
//     vuex: {
//       store,
//       actionPrefix: 'SOCKET_',
//       mutationPrefix: 'SOCKET_'
//     },
//     options: { pingTimeout: 60000, path: "/socket.io" }
// }))

export default {
  name: "Main",

  data() {
    return {
      max_slot: 10,
      betAmount: 0,
      betAmountInput: 0,
      dialog_tip:false,
      tip_value:'',
      shareCards:[],
      cards:[],
      muted: false,
    }
  },

  components: {
    GamePlayPosition,
    Cards,
    ShareCard,
    TimerReady,
    TimerAction,
    ChipShow,
    WinEffect
  },

  computed: {
    ...mapState({
      gameReady: state => state.poker.gameReady,
      socket: state => state.poker.socket,
      current_table_info: state => state.poker.current_table_info,
      sittingIn: state => state.poker.sittingIn,
      sittingOnTable: state => state.poker.sittingOnTable,
      actionState: state => state.poker.actionState,
      mySeat: state => state.poker.mySeat,
      myCards: state => state.poker.myCards,
      current_table_data: state => state.poker.current_table_data,
      readyPlayerTimer: state => state.poker.readyPlayerTimer,
      actionPlayerTimer: state => state.poker.actionPlayerTimer,
    }),

    ...mapGetters({
      totalBet: 'poker/totalBet'
    }),

    isDeadler(){
      let is_deadler = false;

      if(this.current_table_data !== undefined && this.mySeat !== null && this.current_table_data?.dealerSeat === this.mySeat){
        is_deadler = true;
      }

      return is_deadler;
    },

    startAble(){
      let startAble = false;
      let seats = this.current_table_data?.seats;
      var count = 0;
      var count_ready = 0;

      if(typeof seats !== 'object')
        return startAble;

      seats.forEach( seat => {
        if(seat !== null && !_.isEmpty(seat)){
          if(seat.ready){
            count_ready++;
          }
          count++;
        }
      });
      
      if(count>1 && count === count_ready){
        startAble = true;
      }

      return startAble;
    },

    // Can start the game
    isDeadlerCanStart(){
      return this.isDeadler && !this.gameReady && this.startAble && this.actionState === 'postSmallBlind';
    },

    table_id(){
      return parseInt(this.$route.params.table_id);
    },

    minBet(){
      if( this.mySeat === null 
        || typeof this.current_table_data.seats[this.mySeat] === 'undefined' 
        || this.current_table_data.seats[this.mySeat] === null ) 
        return 0;

      // If the pot was raised
      if( this.actionState === "actBettedPot" ) {
        var proposedBet = +this.current_table_data.biggestBet + this.current_table_data.bigBlind;
        return this.current_table_data.seats[this.mySeat].chipsInPlay < proposedBet ? this.current_table_data.seats[this.mySeat].chipsInPlay : proposedBet;
      } else {
        return this.current_table_data.seats[this.mySeat].chipsInPlay < this.current_table_data.bigBlind 
        ? this.current_table_data.seats[this.mySeat].chipsInPlay 
        : this.current_table_data.bigBlind;
      }
    },

    maxBet(){
      if( this.mySeat === null 
        || typeof this.current_table_data.seats[this.mySeat] === 'undefined' 
        || this.current_table_data.seats[this.mySeat] === null ) 
        return 0;

		  return this.actionState === "actBettedPot" 
      ? this.current_table_data.seats[this.mySeat].chipsInPlay + this.current_table_data.seats[this.mySeat].bet 
      : this.current_table_data.seats[this.mySeat].chipsInPlay;
    },

    callAmount(){
      if( this.mySeat === null 
        || typeof this.current_table_data.seats[this.mySeat] === 'undefined' 
        || this.current_table_data.seats[this.mySeat] == null ) 
        return 0;

		  var callAmount = +this.current_table_data.biggestBet - this.current_table_data.seats[this.mySeat].bet;
		  return callAmount > this.current_table_data.seats[this.mySeat].chipsInPlay 
        ? this.current_table_data.seats[this.mySeat].chipsInPlay 
        : callAmount;
    },

    showLeaveTableButton(){
      
      return this.sittingOnTable !== null && ( !this.sittingIn || this.actionState === "waiting" );
    },

    showFoldButton(){
      return this.actionState === "actNotBettedPot" || this.actionState === "actBettedPot" || this.actionState === "actOthersAllIn";
    },

    showSitOut(){
      return this.actionState === 'postSmallBlind' || this.actionState === 'postBigBlind';
    },

    showSitIn(){
      return this.sittingOnTable !== null && !this.sittingIn;
    },

    showPostSmallBlindButton() {
      return this.actionState === "postSmallBlind";
    },

    showPostBigBlindButton() {
      return this.actionState === "postBigBlind";
    },

    showCheckButton() {
      return this.actionState === "actNotBettedPot" 
        || ( this.actionState === "actBettedPot" 
        && this.current_table_data.biggestBet == this.current_table_data.seats[this.mySeat].bet );
    },

    showCallButton() {
      return this.actionState === "actOthersAllIn" 
        || this.actionState === "actBettedPot"  
        && !( 
          this.actionState === "actBettedPot" 
          && this.current_table_data.biggestBet == this.current_table_data.seats[this.mySeat].bet 
        );
    },

    showBetButton() {
      return this.actionState === "actNotBettedPot" 
        && this.current_table_data.seats[this.mySeat].chipsInPlay 
        && this.current_table_data.biggestBet < this.current_table_data.seats[this.mySeat].chipsInPlay;
    },

    showRaiseButton() {
      return this.actionState === "actBettedPot" 
        && this.current_table_data.seats[this.mySeat].chipsInPlay 
        && this.current_table_data.biggestBet < this.current_table_data.seats[this.mySeat].chipsInPlay;
    },

    showBetRange() {
      return (this.actionState === "actNotBettedPot" || this.actionState === "actBettedPot") 
        && this.current_table_data.seats[this.mySeat].chipsInPlay 
        && this.current_table_data.biggestBet < this.current_table_data.seats[this.mySeat].chipsInPlay;
    },

    showBetInput() {
      return (
          this.actionState === "actNotBettedPot" || this.actionState === "actBettedPot"
        ) 
        && this.current_table_data.seats[this.mySeat].chipsInPlay 
        && this.current_table_data.biggestBet < this.current_table_data.seats[this.mySeat].chipsInPlay;
    },

    boardCards(){
      return this.current_table_data.board
    },

    Cards(){
      return this.myCards
    },
  },

  watch:{
    boardCards(newVal,oldVal){
      if(newVal != oldVal){
        let arr = []
        this.current_table_data.board.forEach((e)=>{
          if(e != ''){
        
            arr.push(e)
           
            
            if(arr.length > this.shareCards.length){
              sound.dealingCards();
              this.current_table_data.pot.forEach((e)=>{
                // console.log(e.amount)
                this.$store.commit('poker/SET_POT_AMOUNT', e.amount);
              })
            }
          }
        })
        this.shareCards = arr
      }
    },

    muted(newVal, oldVal) {
      if (newVal) {
        sound.mute();
      } else {
        sound.unmute();
      }
    },

    Cards(newVal,oldVal){
    
      if(newVal != oldVal){
        this.cards = this.myCards
        if(this.cards.length > 0){
          sound.dealingCards();
          setTimeout(()=>{
            sound.dealingCards();
          },2000)
        }
      }
    },

    actionState(newVal, oldVal){
      if(newVal && newVal !== 'waiting' && newVal !== oldVal){
        this.$store.commit('poker/SET_ACTION_TIMEER_VISIBILITY', true);
      }else{
        this.$store.commit('poker/SET_ACTION_TIMEER_VISIBILITY', false);
      }

      if(newVal === 'postSmallBlind' && newVal !== oldVal){
        this.$store.commit('poker/SET_MY_CARDS', []);
      }
    },

    showBetRange(newVal, oldVal){
      if(newVal && newVal !== oldVal){
        this.changeBetAmount(0);
      }
    }
  },


  created() {
    let _this = this;
    let slot = this.$route.params.max_slot;
    this.max_slot = parseInt(slot);

    this.socket.on('receiveUserReadyTime', function(response) {
      let arr = _this.readyPlayerTimer;
      arr[response.seatPosition] = response.readyTimeLeft;
      _this.$store.commit('poker/SET_READY_PLAYER_TIMER', arr);
      _this.$forceUpdate();
    });

    this.socket.on('receiveUserActionTime', function(response) {
      let arr = _this.actionPlayerTimer;

      for(var i = 0; i < arr.length; i++){
        arr[i] = 0;
      }

      arr[response.seatPosition] = response.actionTimeLeft;
      _this.$store.commit('poker/SET_ACTION_PLAYER_TIMER', arr);
      _this.$forceUpdate();
    });
  },

  mounted() {
    sound.bgSound();
    this.$store.commit('poker/SET_CURRENT_TABLE_INFO_GAME', this.table_id);  
    this.initGame();
  },

  destroyed() {
    console.log('Destroyed', this.current_table_info)
    sound.mute();
    if(this.current_table_info?.id){
      this.leaveTable();
      this.leaveRoom();
    }
  },

  methods: {
    winEffect(){
      this.$refs.WinEffect.runWinEffect();
    },

    unMutedAudio() {
      this.muted = false;
    },

    mutedAudio() {
      this.muted = true;
    },

    _onTipDealer() {
      if (this.tip_value < 1) {
        this.$message({
          message: this.$t("MSG_MIN_TIP_DEALER"),
          type: "warning",
        });
        return;
      }
      if (isNaN(this.tip_value)) {
        this.$message({
          message: this.$t("MSG_FILL_A_NUMBER"),
          type: "warning",
        });
        return;
      }
      if (this.balance >= 1) {
        // this.$store
        //   .dispatch("guessing/sendTipDealer", this.tip_value)
        //   .then((res) => {
        //     this.$message({
        //       message: this.$t("MSG_TIP_DEALER_SUCCESS"),
        //       type: "success",
        //     });
        //     this.$store.commit("SET_BALANCE", parseFloat(res.data.user_points));
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
        // this.dialog_tip = false;
      } else {
        this.$message({
          message: this.$t("MSG_DO_NOT_ENOUGH_MONEY"),
          type: "warning",
        });
      }
    },

    initGame(){
      if(isNaN(this.table_id) || !this.table_id)
        return false;

      //Khởi tạo game
      let _this = this;

      this.socket.on("connection", (socket) => {
        console.log(socket); // true
      });

      this.$store.commit('poker/SET_MY_CARDS', []);
      this.socket.emit( 'enterRoom', this.table_id );

      this.$store.dispatch('poker/getTableData', this.table_id);
    },

    pokerLobby(){
      let _this = this;
      this.leaveTable();
      this.leaveRoom();
      setTimeout(() => {
        _this.$router.push('/poker');
      }, 100);
    },

    fold(){
      let _this = this;
      this.socket.emit( 'fold', function( response ) {
        console.log(response)
        if( response.success ) {
          _this.$store.commit('poker/SET_ACTION_STATE', '');
          _this.$store.commit('poker/SET_MY_CARDS', []);
        }
      });
    },

    postBlind(posted){
      let _this = this;
      this.socket.emit( 'postBlind', posted, function( response ) {
        if( response.success && !posted ) {
          _this.$store.commit('poker/SET_SITTING_IN', false);
        } else {
          //sounds.playBetSound();
        }

        _this.$store.commit('poker/SET_ACTION_STATE', '');
      });
    },

    startGame(){
      this.$store.commit('poker/SET_GAME_READY', true);
      this.postBlind(true);
    },

    sitIn(){
      let _this = this;
      this.socket.emit( 'sitIn', function( response ) {
        console.log(response)
        if( response.success ) {
          _this.$store.commit('poker/SET_SITTING_IN', true);
        }
      });
    },

    check(){
      let _this = this;
      this.current_table_data

      this.socket.emit( 'check', function( response ) {
        console.log(response)
        if( response.success ) {
          //sounds.playCheckSound();
          _this.$store.commit('poker/SET_ACTION_STATE', '');
        }
      });

    },

    call(){
      let _this = this;
      this.socket.emit( 'call', function( response ) {
        console.log(response)
        if( response.success ) {
          _this.$store.commit('poker/SET_ACTION_STATE', '');
        }
      });
    },

    bet(){
      let _this = this;
      this.socket.emit( 'bet', this.betAmount, function( response ) {
        console.log(response)
        if( response.success ) {
          _this.$store.commit('poker/SET_ACTION_STATE', '');
        }
      });
    },

    raise(){
      let _this = this;
      this.socket.emit( 'raise', this.betAmount, function( response ) {
        console.log(response)
        if( response.success ) {
          _this.$store.commit('poker/SET_ACTION_STATE', '');
        }
      });
    },

    leaveRoom(){
      this.socket.emit( 'leaveRoom', this.current_table_info.id );
      this.$store.commit('poker/SET_CURRENT_TABLE_INFO_GAME', 0);
    },

    leaveTable(){
      
      let _this = this;
      this.socket.emit( 'leaveTable', function( response ) {
        //console.log(response)
        if( response.success ) {
          _this.$store.commit('poker/SET_SITTING_ON_TABLE', null);
          _this.$store.commit('poker/SET_MY_SEAT', null);
          _this.$store.commit('poker/SET_SITTING_IN', false);
          _this.$store.commit('poker/SET_ACTION_STATE', '');
          _this.$store.commit('poker/SET_MY_CARDS', []);
          _this.$refs.timerReady.timer_stop();
        }
      });

      //this.socket.emit( 'leaveRoom', this.current_table_info.id);
      //this.$store.commit('poker/SET_CURRENT_TABLE_INFO_GAME', 0);
    },

    imageUrl(img) {
      let url = `/poker/images/${img}`;
      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }
      return url;
    },

    changeBetAmount(value){
      value = parseInt(value);
      if(value < this.minBet){
        value = this.minBet;
      }

      if(value > this.maxBet){
        value = this.maxBet;
      }

      this.betAmount = value;
      this.betAmountInput = value;
    },

    /** 
     * Do somthing on time left
     */
    doOnTimeleft(){
      console.log('Time left');
      
      if(this.actionState === 'postSmallBlind' || this.actionState === 'postBigBlind'){
        this.leaveTable();
      }else{
        if(this.showCheckButton){
          this.check();
        }else{
          this.fold();
        }
      }
    },

    forceUpdate(){
      this.$forceUpdate();
    }
  },
};
</script>

<style>
@import "./style.css";
.poker{
  position: relative;
}
</style>
