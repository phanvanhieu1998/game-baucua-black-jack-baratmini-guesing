<template>
  <div id="main-app">
    <div class="container">
      <LoginScreen v-if="!isLoggedIn"/>
      <!-- <GameScreen v-else/> -->
      <router-view v-else/>
    </div>
  </div>
</template>

<script>
import LoginScreen from './components/LoginScreen.vue'
import GameScreen from './components/GameScreen.vue'
import "@/assets/css/style.css"
import  "@/assets/css/nomarline.css"
import {mapState} from "vuex";
import StorageGame from "@/utils/storage";
export default {
  name: 'App',
  components: {
    LoginScreen,
    GameScreen
  },

  computed: {
    ...mapState({
      isLoggedIn:state => state.isLoggedIn
    }),
    wp_theme_url(){
      return this.$store.state.WP_THEME_APP_URL
    }
  },

  created(){
    if(typeof APP_USER_ID_LOGGEDIN !== 'undefined'){
      this.$store.commit('setUserId', APP_USER_ID_LOGGEDIN);
    }
  },

  mounted() {
    //console.log(process.env)

    this.loadApp()
    setInterval(this.userPing,60000)
  },

  methods: {
    loadApp(){
      this.$store.dispatch('appLoad').then( res => {
        //console.log(res)
      }).catch( err => {
        //console.log(err)
      })
    },
    userPing() {
      this.$store.dispatch('userPing').then(res => {

      }).catch(error => console.log(error))
    }
  },
}
</script>
<style>

</style>
