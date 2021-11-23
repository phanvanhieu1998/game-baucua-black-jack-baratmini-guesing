<template>
  <div class="">
    <Main ref="pokerMain"></Main>  
    <PokerChatBox ref="pokerChat"></PokerChatBox>
    <!-- <div>
      {{ current_table_data }}
    </div> -->
    <Footer></Footer>  
  </div>
</template>

<script>
import Main from '@/components/games/poker/Main' 
import Footer from '@/components/games/poker/components/PokerFooter.vue' 
import sound from "@/components/games/poker/Sound";
import PokerChatBox from '@/components/games/poker/chat/ListChat';

import { mapState } from 'vuex';

export default {
  data() {
    return {
      betAmount: 0
    }
  },

  components: {
    Main,
    PokerChatBox,
    Footer
  },

  computed: {
    ...mapState({
      current_table_data: state => state.poker.current_table_data,
      current_username: state => state.poker.current_username,
      user_info: state => state.user_info,
      socket: state => state.poker.socket
    }),

  },

  created() {
    //this.socket.removeAllListeners();
  },

  mounted() {
    let username = this.user_info?.user_login;

    if(!username){
      this.$router.push('/');
    }
  },

  created() {
    let _this = this;
    // When the table data have changed
    this.socket.on( 'table-data', function( data ) {
      console.log('Table data => ', data)
      switch ( data.log.action ) {
        case 'fold':
          sound.playFoldSound();
          break;
        case 'check':
          sound.playCheckSound();
          break;
        case 'call':
          sound.playCallSound();
          break;
        case 'bet':
          sound.playBetSound();
          break;
        case 'raise':
          sound.playRaiseSound();
          break;
      }

      _this.$store.commit('poker/SET_CURRENT_TABLE_DATA', data);

      if( data.log.message ) {
        _this.$refs.pokerChat.updateLogChat(data.log.message);
      }

      if(data.phase === 'smallBlind'){
        _this.$store.commit('poker/SET_MY_CARDS', []);
      }
    });

    // When the game has stopped
    this.socket.on( 'gameStopped', function( data ) {
      console.log('Game Stop: ', data)
      _this.$store.commit('poker/SET_CURRENT_TABLE_DATA', data);
      _this.$store.commit('poker/SET_ACTION_STATE', 'waiting');
      _this.$store.commit('poker/SET_MY_CARDS', []);
      _this.$store.commit('poker/SET_GAME_READY', false);
    });

    // When the player is asked to place the small blind
    this.socket.on( 'postSmallBlind', function( data ) {
      _this.$store.commit('poker/SET_ACTION_STATE', 'postSmallBlind');
    });

    // When the player is asked to place the big blind
    this.socket.on( 'postBigBlind', function( data ) {
      _this.$store.commit('poker/SET_ACTION_STATE', 'postBigBlind');
    });

    // When the player is dealt cards
    this.socket.on( 'dealingCards', function( cards ) {
      _this.$store.commit('poker/SET_MY_CARDS', cards);
    });

    // When the user is asked to act and the pot was betted
    this.socket.on( 'actBettedPot', function() {
      _this.$store.commit('poker/SET_ACTION_STATE', 'actBettedPot');

      // var proposedBet = +$scope.table.biggestBet + $scope.table.bigBlind;
      // $scope.betAmount = $scope.table.seats[$scope.mySeat].chipsInPlay < proposedBet ? $scope.table.seats[$scope.mySeat].chipsInPlay : proposedBet;
      
    });

    // When the user is asked to act and the pot was not betted
    this.socket.on( 'actNotBettedPot', function() {
      _this.$store.commit('poker/SET_ACTION_STATE', 'actNotBettedPot');

      //$scope.betAmount = $scope.table.seats[$scope.mySeat].chipsInPlay < $scope.table.bigBlind ? $scope.table.seats[$scope.mySeat].chipsInPlay : $scope.table.bigBlind;
      
    });

    // When the user is asked to call an all in
    this.socket.on( 'actOthersAllIn', function() {
      _this.$store.commit('poker/SET_ACTION_STATE', 'actOthersAllIn');
    });
  },

  destroyed() {
    this.socket.removeListener( 'table-data' );
  },

  methods: {
    
  },
}
</script>