<template>
  <div class="game-poker-wrapper">
    <GameTablesList></GameTablesList>
    <Footer></Footer>
  </div>
</template>

<script>
import GameTablesList from '@/components/games/poker/GameTablesList' 
import Footer from '@/components/games/poker/components/PokerFooter.vue' 

import { mapState } from 'vuex';

export default {
  data() {
    return {
      
    }
  },

  components: {
    Footer,
    GameTablesList
  },

  computed: {
    ...mapState({
      devUser: state => state.poker.devUser,
      current_username: state => state.poker.current_username,
      user_info: state => state.user_info,
      socket: state => state.poker.socket
    }),

  },

  mounted() {

    let username = this.user_info?.user_login;

    if(!username){
      this.$router.push('/');
    }

    if(this.devUser){
      username = this.devUser;
    }

    if(username && this.current_username === ''){
      this.register(username);
    }

    // window.onbeforeunload = function (){
    //  return "";
    // };

    this.$store.dispatch('poker/getLobbyTables');
  },

  methods: {
    register(user){
      console.log('Set > '+ user)
      this.$store.commit('poker/SET_CURRENT_USERNAME', user);
      this.socket.emit( 'register', user, function( response ){
        console.log(response)
			});
    },
  },
}
</script>