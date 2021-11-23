<template>
  <li class="poker-chat-item">    
    <p class="log-message" v-if="msg.type == 'system'"><span v-html="msg.message"></span></p>
    <p class="message" v-else><b class="sender">{{sender}}</b>: <span v-html="msg.message"></span></p>
  </li>
</template>
<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      
    }
  },

  props: {
    msg: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState({
      
    }),

    sender(){
      return this.msg.sender;
    }
  }
}
</script>