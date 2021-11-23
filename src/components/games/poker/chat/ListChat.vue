<template>
  <div class="poker-chat-list poker">
    <div class="chatbox">
      CHAT BOX: PLEASE KEEP IT FRIENDLY & DON'T SHOW YOUR POKER FACE
    </div>
        
    <div class="mesage__list">
      <div class="mesage__content">
        <div id="message" ref="msg">
          <ul id="message_scr" ref="msgHeight">
            <ChatItem v-for="(msg, index) in tableChatListOk" :key="index" :msg="msg"></ChatItem>
          </ul>
        </div>
      </div>

      <div class="send_message">
        <div class="enter__mesage">
          <el-input size="small" v-model="msg" @keyup.native.enter="sendMsg" placeholder="Enter a message"></el-input>
        </div>

        <div>
          <el-button size="small" type="primary" @click="sendMsg">SEND</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
var moment = require('moment'); // require
import ChatItem from './ChatItem.vue'

String.prototype.toHtmlEntities = function() {
  return this.replace(/./gm, function(s) {
      // return "&#" + s.charCodeAt(0) + ";";
      return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
  });
};


export default {
  data() {
    return {
      msg: '',
    }
  },

  components: {
    ChatItem
  },

  computed: {
    ...mapState({
      socket:  state => state.poker.socket,
      tableChatList:  state => state.poker.tableChatList,
    }),

    ...mapGetters({
      tableChatListOk: 'poker/tableChatListOk'
    }),

    table_id(){
      return parseInt(this.$route.params.table_id);
    },

    chatListChange(){
      return this.tableChatList.length
    }
  },

  watch: {
    chatListChange(newVal,oldVal){
      this.scrMsg();
    },
  },

  mounted() {
    let _this = this;

    //Get history chat
    this.$store.dispatch('poker/getHistoryChat', this.table_id).then( res => {
      this.scrMsg();
    }).catch( error => {
      console.log(error);
    });

    //Lesten message from user
    this.socket.on( 'receiveMessage', function( data ) {
      _this.$store.dispatch('poker/addNewChat', {
        sender: data.sender,
        message: data.message,
        datetime: moment().format()
      });
    });
  },

  methods: {
    
    sendMsg(){
      if ( this.msg.trim() ) {
        var message = this.msg.trim();
        this.socket.emit( 'sendMessage', message );
        this.$store.dispatch('poker/addNewChat',{
          sender: 'You',
          message: message,
          datetime: moment().format()
        });
        this.msg = '';
      }
    },

    scrMsg(){
      setTimeout(()=>{
        if(this.$refs.msg !== 'undefined' && this.$refs.msgHeight !== undefined){
          this.$refs.msg.scrollTop = this.$refs.msgHeight.offsetHeight;
        }
      },10)
    },

    updateLogChat(message){
      this.$store.dispatch('poker/addNewChat', {
        sender: 'system',
        type: 'system',
        message: message.toHtmlEntities(),
        datetime: moment().format()
      });
    },
  },
}
</script>

<style>

</style>