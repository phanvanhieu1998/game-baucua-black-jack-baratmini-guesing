<template>
  <div class="game-play-item" 
    :class="[
      `player-pos-${position}`, 
      {'active blink_me': isActiveSeat},
      {'game-play-item-cards':myCards.length > 0},
      {'is-ready': isReady}
    ]">
    
    <span class="time-to-ready" v-if="timeLeft>0">{{timeLeft}}</span>

    <div v-if="isPositionEmpty">
      <el-button  @click="sitHere" v-if="!sittingIn">Sit here</el-button>
      <span v-else>
        <el-button >Empty</el-button>
      </span>
    </div>
    <div v-else>
      <div class="my-cards">
        <el-button class="info_user" :class="[{'its-me': mySeat == position}, {'in-folded': !positionData.inHand && seatedCount > 1 }]">
          <span style="display:block">{{ positionData.name }}</span>
          <span>{{ positionData.chipsInPlay | price }}</span>
        </el-button>

        <div v-if="current_table_data.winners.length > 0 && current_table_data.winners[0] == position" class="img__winner">
          <img :src="imageUrl('winner.png')" alt="" />
          <div class="side_main--pot">
            <span >POT: ${{pot_amount}}</span>
            <!-- <span>SIDE POT: 231</span> -->
          </div>
        </div>

        <div class="list-card-poker" v-if="positionData.hasCards">
          <div 
              class="flip-cards-poker"
             :class="[{'flip-my-cards-poker':mySeat == position }]"
              v-for="(card, index) in myCards"
              :key="card + index"
            
          >
            <div v-if="card !== null"  class="front-cards-poker">
                <img :src="cardUrl(card)" alt="" />
            </div>
            <div class="back-card-poker">
              <img  :src="cardUrl('img_back_card')" alt="" />
            </div>
        
          </div>
        </div>
        <!-- {{myCards}} -->
      </div>
      
      <div class="dealer" v-if="current_table_data.dealerSeat == position">
        <span>D</span>
      </div>
    </div>

    <SitHereDialog 
      ref="sitHereDialog" 
      :position="position" 
      v-if="current_table_info"
      @success="successSat"></SitHereDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SitHereDialog from './SitHereDialog'

import _ from 'lodash'

export default {
  data() {
    return {
      //sittingIn: false,
      pot:null
    }
  }, 

  components: {
    SitHereDialog
  },

  props: {
    position: {
      type: Number,
      default: 0
    },

    readyTimeLeft: {
      type: Number,
      default: 0
    },

    actionTimeLeft: {
      type: Number,
      default: 0
    }
  },

  computed: {
    ...mapState({
      socket: state => state.poker.socket,
      devUser: state => state.poker.devUser,
      myCards: state => state.poker.myCards,
      current_table_info: state => state.poker.current_table_info,
      current_table_data: state => state.poker.current_table_data,
      sittingIn: state => state.poker.sittingIn,
      mySeat: state => state.poker.mySeat,
      pot_amount: state => state.poker.pot_amount,
      readyPlayerTimer: state => state.poker.readyPlayerTimer
    }),

    username(){
      return this.devUser;
    },

    seatedCount(){
      return this.current_table_data?.playersSeatedCount || 0;
    },

    positionData(){
      return this.current_table_data?.seats?.length>0 ? this.current_table_data.seats[this.position]: {};
    },

    isPositionEmpty(){
      return _.isEmpty(this.positionData);
    },

    isActiveSeat(){
      return this.current_table_data.activeSeat === this.position;
    },

    isReady(){
      return this.positionData?.ready ? true: false;
    },

    timeLeft(){
      return this.readyTimeLeft > 0? this.readyTimeLeft: this.actionTimeLeft;
    },

    isDeadler(){
      let is_deadler = false;

      if(this.current_table_data !== undefined && this.mySeat !== null && this.current_table_data?.dealerSeat === this.mySeat){
        is_deadler = true;
      }

      return is_deadler;
    },
  },

  watch:{
    sittingIn(newVal, oldVal){
      if(oldVal && !newVal && this.mySeat === this.position){
        this.$store.commit('poker/SET_SITTING_IN', false);
      }
    },

    mySeat(newVal, oldVal){
      if(newVal === null){
        this.$store.commit('poker/SET_SITTING_IN', false);
      }
    }
  },

  mounted() {
    
  },

  methods: {
    
    imageUrl(img) {
      let url = `/poker/images/${img}`;
      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }
      return url;
    },
    sitHere(){
      this.$refs.sitHereDialog.open();
    },

    successSat(){
      this.$store.commit('poker/SET_SITTING_IN', true);
    },

    cardUrl(card) {
       card = card.toUpperCase()
      let url = `/poker/images/cards/${card}.png`;

      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }

      return url;
   },
  },
}
</script>
<style>
.flip-cards-poker {
  position: relative;
  width: 50%;
  height: auto;
  perspective: 1000px;
  animation-name: fly-in-face-upp;
  animation-duration: 2s;
  transform-style: preserve-3d;
  animation-fill-mode: forwards;
  visibility: hidden;

}
.flip-my-cards-poker{
  position: relative;
  width: 50%;
  height: auto;
  perspective: 1000px;
  animation-name: fly-in-face-uppp;
  /* animation-duration: 2s;
  transform-style: preserve-3d;
  animation-fill-mode: forwards;
  visibility: hidden; */
}
.game-play-item .list-card-poker{
  width: 92px;
}
.front-cards-poker {
  transform: rotateY(180deg);
  position: absolute;
  backface-visibility: hidden ;  
  transition: 0.6s; 
  transform-style: preserve-3d;
  border-radius: 10px;
  
} 

.back-card-poker{
    position: absolute;
  backface-visibility: hidden ;  
  transition: 0.6s; 
  transform-style: preserve-3d;
  border-radius: 10px;
}

 /* .front-card {
  transform: rotateY(180deg);
}  */
.flip-cards-poker:nth-of-type(1) {
  animation-delay: 0s;
  animation-duration: 2s !important;
}

.flip-cards-poker:nth-of-type(2) {
  animation-delay: 2s;
  animation-duration: 2s !important;
  
}

.time-to-ready {
  position: absolute;
  left: -32px;
  top: 6px;
  background-color: #509d72;
  display: block;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #ffff00;
  border: 1px solid #ffff00;
}

@keyframes fly-in-face-upp {
  0% {
    visibility: visible;
    transform: translateY(-500px);
  }
  50% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0deg);
  }
}

@keyframes fly-in-face-uppp {
  0% {
    visibility: visible;
    transform: translateY(-500px);
  }
  50% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(-180deg);
  }
}

.blink_me {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0.8;
  }
}

@media screen and (min-width: 375px) and (max-width: 570px) {
.game-play-item .list-card-poker {
    width: 60px;
}
.time-to-ready {
  position: absolute;
  left: -26px;
  top: 6px;
  background-color: #509d72;
  display: block;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  color: #ffff00;
  border: 1px solid #ffff00;
}

}


</style>