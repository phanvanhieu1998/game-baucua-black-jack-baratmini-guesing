<template>
  <div class="game__poker">
    <div v-if="joinStatus">
      <NameTable @joinGame="joinStatus = false" />
    </div>
    <div v-else>
      <div>
        <div v-if="screenSit" class="game__poker_bg">
          <div v-for="(sit, index) in listSit" :key="index" :class="[`sit-${sit.class}`]" class="hi">
            <el-button @click="dialogVisible = true " type="primary">{{sit.sit}}</el-button>
           </div>
          <img :src="imageUrl('table.png')" alt="" />
        
        </div>
         <div v-else class="game__poker_bg">
          <div v-for="(sit, index) in listSit" :key="index" :class="[`sit-${sit.class}`]" class="hi">
            <el-button type="primary"><span style="display:block">USER NAME</span><span>$111</span></el-button>
           </div>
          <img :src="imageUrl('table.png')" alt="" />
        
        </div>
        
    
        <!-- <button @click="joinStatus = true">
          out table
        </button> -->

       
        <div class="game-status">
          <div class="game-status-item">TABLE:</div>
          <div class="game-status-item">
            SMALL BLIND:
          </div>

          <div class="game-status-item">
            BIG BLIND:
          </div>
        </div>

        <div v-if="joinTable" class="game__poker-bet">
          <div class="card">la bai</div>

          <div class="stylePull">
            <div class="block">
              <!-- <span class="demonstration">Default value</span> -->
              <el-slider
                class="xxx"
                :show-input="true"
                v-model="valuePull"
              ></el-slider>
            </div>
          </div>

          <div class="betting_door_list">
            <div
              class="betting_button"
              v-for="(value, key) in playButton"
              :key="key"
            >
              <!-- <el-badge
                :value="valueBet[key] | price"
                :hidden="valueBet[key] == 0"
                type="success"
              > -->
              <el-button>
                {{ value.lable }}
              </el-button>
              <!-- </el-badge> -->
            </div>
          </div>

          <div  class="betting_door_list">
            <div
              class="betting_button"
              :class="[{ tip: value.text === 'tip' }]"
              v-for="(value, key) in playButton2"
              :key="key"
            >
              <!-- <el-badge
                :value="valueBet[key] | price"
                :hidden="valueBet[key] == 0"
                type="success"
              > -->
              <el-button>
                {{ value.lable }}
              </el-button>
              <!-- </el-badge> -->
            </div>
          </div>
        </div>
        <div v-else class="game__poker-bet">

        </div>

        <div class="chatbox">
          CHAT BOX: PLEASE KEEP IT FRIENDLY & DON'T SHOW YOUR POKER FACE
        </div>

        <div class="mesage__list">
          <div class="mesage__content">
            df
          </div>

          <div class="send_message">
            <div class="enter__mesage">
              <el-input size="small" v-model="message"></el-input>
            </div>

            <div>
              <el-button size="small" type="primary">SEND</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="game_poker_join">
      <el-dialog :visible.sync="dialogVisible" custom-class="custom">
        <p style="padding-bottom: 15px; text-align: center;">
          PETER POKER TABLE
        </p>
        <p>MIN BY IN: $40</p>
        <p>MAX BY IN: $400</p>
        <p>BALANCE: $3,333</p>
        <div class="value__sit">
          <el-input size="small" type="number" v-model="valueSit"></el-input>
          <el-button size="small" type="primary" @click="joinGame"
            >SIT</el-button
          >
        </div>
      </el-dialog>
    </div>
    <div class="action-list action-list-bau-cua">
      <el-row>
        <el-col :span="24">
          <el-popconfirm
            title="Return to lobby, Are you sure?"
            @confirm="returnLobby"
            cancel-button-text="Cancel"
            confirm-button-text="Ok"
          >
            <el-button
              style="width:100%;background-color: #333;display: block;"
              type="info"
              slot="reference"
              >RETURN TO LOBBY</el-button
            >
          </el-popconfirm>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import VueSocketIO from "vue-socket.io";
import NameTable from "./NameTable";
export default {
  name: "Main",
  data() {
    return {
      // socket: new VueSocketIO({
      //   debug: true,
      //   connection: SocketIO('http://metinseylan.com:1992', options),
      //   vuex: {
      //   store,
      //   actionPrefix: 'SOCKET_',
      //   mutationPrefix: 'SOCKET_'
      // },
      // }),
      screenSit:true,
      joinTable:false,
      message: "",
      valuePull: 0,
      valueSit: "",
      dialogVisible: false,
      joinStatus: true,
      listSit: [
        { sit: "SIT HERE",
          class:'sit1'
        },
         { sit: "SIT HERE",
          class:'sit2'
        },
         { sit: "SIT HERE",
          class:'sit3'
        },
         { sit: "SIT HERE",
          class:'sit4'
        },
         { sit: "SIT HERE",
          class:'sit5'
        },
         { sit: "SIT HERE",
          class:'sit6'
        },
         { sit: "SIT HERE",
          class:'sit7'
        },
         { sit: "SIT HERE",
          class:'sit8'
        },
         { sit: "SIT HERE",
          class:'sit9'
        },
         { sit: "SIT HERE",
          class:'sit10'
        },
 
      ],
      playButton: [
        {
          lable: "FOLD",
          text: "fold",
        },
        {
          lable: "CALL",
          text: "call",
        },
        {
          lable: "RAISE TO 6",
          text: "raise",
        },
        {
          lable: "ALL IN",
          text: "allin",
        },
      ],
      playButton2: [
        {
          lable: "SIT OUT",
          text: "sitout",
        },
        {
          lable: "TIP DEALER",
          text: "tip",
        },
        {
          lable: "POKER LOBBY",
          text: "poker",
        },
      ],
    };
  },
  components: {
    NameTable,
  },

  methods: {
    imageUrl(img) {
      let url = `/poker/images/${img}`;
      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }
      return url;
    },
    joinGame(){
      this.dialogVisible = false
      this.joinTable = true
      this.screenSit = false
    },
    returnLobby() {
      this.$store
        .dispatch("userQuitGame", 0)
        .then((res) => {
          this.$forceUpdate();
        })
        .catch((error) => {});
      this.$emit("quit-game", true);
    },
  },
};
</script>

<style>
.game__poker_bg img {
  width: 100%;
  background-color: #266725 !important ;
  
}
.game__poker_bg{
  position: relative;
}
.game_poker_join .el-dialog__header {
  display: none;
}
.game_poker_join .el-dialog__body p {
  display: block;
  color: white;
  padding-bottom: 4px;
  margin: 0;
}
.game_poker_join .el-dialog__body {
  padding: 20px 20px;
  font-size: 15px;
}
.game_poker_join .value__sit {
  display: flex;
  margin-top: 20px;
}
.game_poker_join .custom {
  background-color: #266926;
  border: 1px solid white;
  border-radius: 3px;
}
.game_poker_join .el-dialog {
  width: 15%;
}
.game_poker_join .el-input__inner {
  width: 95%;
}
.game__poker .game-status {
  display: grid;
  grid-template-columns: auto auto auto;
  width: 100%;
}
.game__poker .game-status-item {
  border: 2px solid white;
  text-align: center;
  color: #ffffff;
  font-weight: bold;
  background-color: #1e6942;
  font-size: 16px;
}
.game__poker-bet {
  width: 100%;
  height: 200px;
  background-color: #034c3d;
}
/* .game__poker-bet .stylePull{
  margin-left: 70px;
} */
.game__poker-bet .betting_door_list {
  display: flex;

  justify-content: center;
}

.hi .el-button{
  position: absolute;

  z-index: 1;
  /* padding: 12px 30px; */
  border-radius: 50px;
  background-color: #20835b;
  border: 2px solid #31ca9f;
  color: white;
  font-weight: 600;
  font-size: 14px;
 

}

.sit-sit1 .el-button{
 left: 7%;
  top: 7%;
}
.sit-sit2 .el-button{
 left: 40%;
  top: 7%;
}
.sit-sit3 .el-button{
 right: 7%;
  top: 8%;
}
.sit-sit4 .el-button{
 right: 2%;
  top: 30%;
}
.sit-sit5 .el-button{
 right: 2%;
  bottom: 30%;
}
.sit-sit6 .el-button{
 right: 7%;
bottom: 10%;
}
.sit-sit7 .el-button{
 left: 40%;
bottom: 10%;
}
.sit-sit8 .el-button{
 left: 7%;
bottom: 10%;
}
.sit-sit9 .el-button{
 left: 2%;
bottom: 30%;
}
.sit-sit10 .el-button{
 left: 2%;
  top: 30%;
}
.game__poker-bet .block {
  width: 60%;
  margin: 0 auto;
}
/* .game__poker-bet .block .el-input-number__increase, .game__poker-bet .block .el-input-number__decrease{
 display: none;
} */
/* .game__poker-bet .block .el-input input{
  padding: 0; */
/* width: 50px;

} */
/* .game__poker-bet .block .el-input-number__decrease{
    display: none;
} */
.game__poker-bet .betting_door_list .betting_button {
  padding: 7px;
}
.game__poker-bet .betting_door_list .betting_button .el-button {
  padding: 12px 30px;
  border-radius: 50px;
  background-color: #20835b;
  border: 2px solid #31ca9f;
  color: white;
  font-weight: 600;
  font-size: 15px;
}
.game__poker-bet .betting_door_list .tip .el-button {
  background-color: #0a654f;
}
/* .betting_door_list .current-bet {
  border: 2px solid #eea347 !important;
} */
.game__poker .chatbox {
  border: 2px solid white;
  color: white;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  background-color: #1e6942;
}
.send_message {
  display: flex;
  margin: 7px;
}
.send_message .enter__mesage {
  width: 89%;
}
.mesage__list .mesage__content {
  width: 98%;
  height: 200px;
  background-color: white;
  margin: 7px;
}
.send_message .el-input__inner {
  width: 100%;
}
.send_message .el-button {
  margin-left: 10px;
  color: black;
  font-weight: 600;
  background-color: #fffbb2;
  border-color: #fffbb2;
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .game__poker-bet .block {
    width: 80%;
  }
}
@media screen and (min-width: 375px) and (max-width: 570px) {
  
.hi .el-button{
  position: absolute;

  z-index: 1;
  padding: 5px 12px !important;
  border-radius: 50px;
  background-color: #20835b;
  border: 2px solid #31ca9f;
  color: white;
  font-weight: 600;
  font-size: 10px;
  
}
.game__poker-bet .betting_door_list .betting_button .el-button {
  padding: 12px 30px;
  border-radius: 50px;
  background-color: #20835b;
  border: 2px solid #31ca9f;
  color: white;
  font-weight: 600;
  font-size: 1px;
}

}
</style>
