<template>
  <div class="game__election__crab">
   
    <div  class="main__game">
     
      <ShowCard
        :openBowl="openBowl"
        :shake="shake"
        :result="result"
        :start="start"
        @start-game="startTheGame"
      />
    </div>

    <div class="main__game--balance">
      <div class="balance">BALANCE: {{ balance | price }}</div>
    </div>
    

    <div class="main__game--place--bet--icon">
      <el-button
        :disabled="islockBet || start"
        v-for="(item, index) in listCard"
        :key="index"
        @click="current_icon(item)"
        class="icon icon--nai"
      >
        <el-badge
          :value="listIconPlaceBetState[item] | price"
          :hidden="listIconPlaceBetState[item] == 0"
          type="success"
        >
          <img
            class="item"
            :class="[
              { 'current-card': current_card == item },
              { math: isInResult(item) },
            ]"
            :src="cardUrl(`${item}Btn`)"
          />
        </el-badge>
      </el-button>
    </div>

    <div class="main__game--max--min--place--bet">
      <div class="main__game--max--min">
        MIN: {{ parseSetting.min | price }}
      </div>
      <div class="main__game--max--min">
        MAX: {{ parseSetting.max | price }}
      </div>
    </div>

    <div class="main__game--place--bet">
      <div class="list--bet--price">
        <button
          :disabled="current_card == '' || islockBet"
          @click="_addPoint(n)"
          v-for="n in [1, 5, 25, 100]"
          :key="n"
        >
          <img :src="`${wp_theme_url}images/chip_${n}.png`" />
        </button>
      </div>
      <div class="list--bet--tip--clear">
        <PopConfirm
          :isVisible="confirm_place_bet"
          @cancel="confirm_place_bet = false"
          @confirm="place_bet"
          :title="$t('MSG_CONFIRM_PLACE_BET')"
        >
          <div slot="children">
            <el-button
              :disabled="isPlaceBet || islockBet"
              @click="confirm_place_bet = true"
              class="btn-choice-bet"
            >
              PLACE BET
            </el-button>
          </div>
        </PopConfirm>

        <div class="tip__dealer">
          <el-button @click="dialog_tip = true" type="success"
            >TIP DEALER</el-button
          >
        </div>

        <div>
          <el-button @click="_clearAll" :disabled="islockBet" type="success"
            >CLEAR ALL</el-button
          >
        </div>
      </div>
    </div>

    <el-dialog
      class="dialog_tip"
      center
      append-to-body
      :title="$t('TIP_DEALER_LABEL')"
      custom-class="dialog-tip"
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

    <el-dialog
      class="none_header1"
      v-if="this.amount !== 0"
      append-to-body
      :visible.sync="dialogVisible"
      custom-class="dialog-tip_win_lose1"
      width="20%"
      :before-close="clearAll"
    >
      <div class="diaglog--win_lose1">
        <h3>
          You {{ this.won_lost == "win" ? "won" : "lost" }}: ${{ this.amount }}
        </h3>
        <span slot="footer" class="dialog-footer1">
          <el-button class="close" @click="clearAll">Ok</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sound from "./Sound";
import ShowCard from "./ShowCard.vue";
import { mapState } from "vuex";

export default {
  name: "Main",

  data() {
    return {
      start: true,
      newResult1: [],
      dialogVisible: false,
      shake: false,
      islockBet: false,
      confirm_place_bet: false,
      dialog_tip: false,
      tip_value: 1,
      openBowl: false,
      listCard: ["nai", "bau", "ga", "ca", "cua", "tom"],
      current_card: "",
      listIconPlaceBet: {
        nai: 0,
        tom: 0,
        ca: 0,
        bau: 0,
        ga: 0,
        cua: 0,
      },
    };
  },
  computed: {
    ...mapState({
      balance: (state) => state.balance,
      listIconPlaceBetState: (state) => state.baucua.listIconPlaceBet,
      game_info: (state) => state.baucua.game_info,
      result: (state) => state.baucua.result,
      won_lost: (state) => state.baucua.won_lost,
      amount: (state) => state.baucua.amount,
      total_money: (state) => state.baucua.totalMoney,
    }),
    wp_theme_url() {
      return this.$store.state.WP_THEME_APP_URL;
    },
    totalPlaceBet() {
      let total = 0;
      for (const [key, value] of Object.entries(this.listIconPlaceBet)) {
        total += parseFloat(value);
      }
      return total;
    },
    isPlaceBet() {
      let total = 0;
      for (const [key, value] of Object.entries(this.listIconPlaceBet)) {
        total += parseInt(value);
      }
      return total > 0 ? false : true;
    },
    parseSetting() {
      return this.game_info.config ? JSON.parse(this.game_info?.config) : {};
    },
  },

  mounted() {
    this.loadGameMatchData();
    // setTimeout(()=>{
    // 	_this.shake = false
    // },3000)
  },
  methods: {
    startTheGame() {
      let _this = this;
      this.start = false;
      setTimeout(() => {
        sound.diceshake();
        _this.shake = true;
        setTimeout(() => {
          _this.shake = false;
        }, 1000);
      }, 1000);
    },
    cardUrl(card) {
      let url = `/baucua/${card}.png`;

      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }

      return url;
    },

    isInResult(item) {
      if (item) {
        return this.result.includes(item);
      } else {
        return false;
      }
    },
    loadGameMatchData() {
      this.$store.dispatch("baucua/loadGameMatchData").then((res) => {
        console.log("res", res);
      });
    },
    returnLobby() {
      this.$store
        .dispatch("userQuitGame", this.game_playing_id)
        .then((res) => {
          this.$forceUpdate();
        })
        .catch((error) => {});
      this.$emit("quit-game", true);
    },
    current_icon(valueIcon) {
      this.current_card = valueIcon;
      console.log("đ", this.current_card);
    },
    fileAudio(resultArray, callback) {
      let sound_list_arr = [];

      const getNewResult = (arr) => {
        let nArr = [],
          arrCheck = [];
        let soundMap = { "1": "mot", "2": "hai", "3": "ba" };

        arr.forEach((ani) => {
          if (arrCheck.indexOf(ani) === -1) {
            let countR = arr.filter((a) => a === ani);
            nArr.push(countR);
            arrCheck.push(ani);
          }
        });

        let _return = [];
        nArr.forEach((_a) =>
          _return.push({ count: soundMap[_a.length], key: _a[0] })
        );

        return _return;
      };

      let newResult = getNewResult(resultArray);

      newResult.forEach((_r) => {
        sound_list_arr.push(_r.count);
        sound_list_arr.push(_r.key);
      });

      // console.log(newResult)

      // if(resultArray[0] == resultArray[1] && resultArray[1] == resultArray[2] ){
      // 	sound_list_arr.push('ba')
      // 	sound_list_arr.push(resultArray[0])
      // }else if(resultArray[0] != resultArray[1] && resultArray[0] != resultArray[2] && resultArray[1] != resultArray[2] ){
      // 	sound_list_arr.push('mot')
      // 	sound_list_arr.push(resultArray[0])
      // 	sound_list_arr.push('mot')
      // 	sound_list_arr.push(resultArray[1])
      // 	sound_list_arr.push('mot')
      // 	sound_list_arr.push(resultArray[2])
      // }else	if(resultArray[0] == resultArray[1] && resultArray[2] != resultArray[1] ){
      // 	sound_list_arr.push('hai')
      // 	sound_list_arr.push(resultArray[0])
      // 	sound_list_arr.push('mot')
      // 	sound_list_arr.push(resultArray[2])
      // }else	if(resultArray[0] == resultArray[2] && resultArray[2] != resultArray[1] ){
      // 	sound_list_arr.push('hai')
      // 	sound_list_arr.push(resultArray[0])
      // 	sound_list_arr.push('mot')
      // 	sound_list_arr.push(resultArray[1])
      // }else	if(resultArray[1] == resultArray[2] && resultArray[2] != resultArray[0] ){
      // 	sound_list_arr.push('hai')
      // 	sound_list_arr.push(resultArray[1])
      // 	sound_list_arr.push('mot')
      // 	sound_list_arr.push(resultArray[0])
      // }else{
      // 	console.log('....')
      // }
      sound.result(sound_list_arr, function() {
        if (typeof callback === "function") callback();
        console.log("h", callback());
      });
    },
    reset() {
      this.dialogVisible = true;
    },

    clearAll() {
      this.dialogVisible = false;
      (this.listIconPlaceBet = {
        nai: 0,
        tom: 0,
        ca: 0,
        bau: 0,
        ga: 0,
        cua: 0,
      }),
        this.$store.commit("SET_BALANCE", this.total_money);
      this.$store.commit(
        "baucua/SET_LIST_ICOM_PLACE_BET",
        this.listIconPlaceBet
      );
      this.islockBet = false;
      this.openBowl = false;
      this.current_card = "";
      this.$store.commit("baucua/SET_RESULT", this.newResult1);
      setTimeout(() => {
        this.shake = true;
        sound.diceshake();
      }, 2000);
      setTimeout(() => {
        this.shake = false;
      }, 3000);
    },
    place_bet() {
      this.confirm_place_bet = false;
      let data = {
        place_bet: this.listIconPlaceBet,
      };
      this.$store.dispatch("baucua/placeBet", data).then((res) => {
        // sound.diceshake();
        this.$message({
          message: "Your bet has been successfully placed.",
          type: "success",
        });
        let _this = this;
        // this.shake = true
        this.openBowl = true;
        // setTimeout(()=>{
        // 	this.shake = false
        // },1000)

        this.islockBet = true;
        setTimeout(() => {
          this.fileAudio(res.result, function() {
            _this.reset();
          });
          this.$store.commit("baucua/SET_TOTAL_MONEY", res.user_points);
          console.log(res.result);
        }, 6000);
      });
    },
    _addPoint(point) {
      sound.chipBet();
      let current_bet_key = this.current_card;
      if (this.balance >= point && this.current_card) {
        if (
          parseInt(this.listIconPlaceBet[current_bet_key]) + point >
          this.parseSetting.max
        ) {
          return;
        } else {
          this.listIconPlaceBet[current_bet_key] =
            parseInt(this.listIconPlaceBet[current_bet_key]) + point;
        }
        let new_balance = parseFloat(this.balance) - point;
        this.$store.commit("SET_BALANCE", new_balance.toFixed(2));
        this.$store.commit(
          "baucua/SET_LIST_ICOM_PLACE_BET",
          this.listIconPlaceBet
        );
      }
    },
    _clearAll() {
      this.current_card = "";
      let new_balance =
        parseFloat(this.balance) + parseFloat(this.totalPlaceBet);
      this.$store.commit("SET_BALANCE", parseFloat(new_balance.toFixed(2)));
      (this.listIconPlaceBet = {
        nai: 0,
        tom: 0,
        ca: 0,
        bau: 0,
        ga: 0,
        cua: 0,
      }),
        this.$store.commit(
          "baucua/SET_LIST_ICOM_PLACE_BET",
          this.listIconPlaceBet
        );
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
        this.$store
          .dispatch("baucua/sendTipDealer", this.tip_value)
          .then((res) => {
            this.$message({
              message: this.$t("MSG_TIP_DEALER_SUCCESS"),
              type: "success",
            });
            this.$store.commit("SET_BALANCE", res.user_points);
          })
          .catch((error) => {
            console.log(error);
          });
        this.dialog_tip = false;
      } else {
        this.$message({
          message: this.$t("MSG_DO_NOT_ENOUGH_MONEY"),
          type: "warning",
        });
      }
    },
  },
  components: {
    ShowCard,
  },
};
</script>
<style>
.main__game {
  width: 100%;
  background-color: #a88492;
  height: auto;
}
.main__game--balance {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1e6942;
  border: 2px solid white;
}

.main__game--balance .balance {
  text-align: center;
  line-height: 23px;
  color: #ffffff;
  width: 100%;
  height: 23px;
  background-color: #1e6942;
  font-weight: 700;
}
.main__game--place--bet--icon {
  display: grid;
  grid-template-columns: auto auto auto;
  width: 100%;
  background-color: #a88492;
  width: 100%;
  height: auto;
  cursor: pointer;
  grid-gap: 30px;
  padding: 30px;
  box-sizing: border-box;
}
.main__game--place--bet--icon .icon img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  border: 5px solid red;
  box-sizing: border-box;
  border-radius: 12%;
}
.main__game--place--bet--icon .el-button {
  padding: 0;
  border: none;
  background-color: transparent;
  margin: 0;
}
.main__game--place--bet--icon .el-button:hover {
  padding: 0;
  border: none;
  background-color: transparent;
  margin: 0;
}
.main__game--max--min--place--bet {
  display: grid;
  grid-template-columns: auto auto;
  width: 100%;
}
.main__game--max--min {
  border: 2px solid #fff;
  text-align: center;
  color: #fff;
  font-weight: 700;
  background-color: #1e6942;
  font-size: 16px;
  height: 23px;
  line-height: 23px;
}
.main__game--place--bet {
  padding: 20px 0;
  width: 100%;
  background-color: #014839;
  height: auto;
}
.main__game--place--bet .list--bet--price {
  padding: 10px 0;
  display: flex;
  justify-content: center;
}
.main__game--place--bet .list--bet--price button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.main__game--place--bet .list--bet--price img {
  width: 140px;
}
.list--bet--tip--clear {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}
.tip__dealer {
  margin: 0 30px;
}
.list--bet--tip--clear .el-button {
  background-color: #0d6751;
  border: 2px solid #22c99b;
  border-radius: 15px;
  cursor: pointer;
  width: 150px;
  height: 44px;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 0 2px #f9fbfa, 0 0 2px rgb(0 0 0), inset 0 0 2px rgb(0 0 0);
  font-size: 13px;
}
.list--bet--tip--clear .el-button:hover {
  background-color: #0d6751;
  border: 2px solid #22c99b;
}
.list--bet--tip--clear .el-button:disabled {
  opacity: 0.5;
}
.dialog-tip {
  background-color: #0d6751;
  box-shadow: 2px 2px 20px 1px;
  border: 2px solid #22c99b;
  border-radius: 10px;
  width: 20%;
}
.dialog_tip .el-dialog__title {
  color: white;
  font-weight: bolder;
}
.main__game--place--bet--icon .el-badge__content {
  width: auto;
  height: 25px;
  transform: translateY(-40%) translateX(80%);
  line-height: 27px;
}
.main__game--place--bet--icon .icon img.current-card {
  border: 5px solid orange;
}
.main__game--place--bet--icon .icon img.math {
  animation: result ease 0.5s infinite;
  animation-delay: 6s;
}

.action-list-bau-cua {
  grid-template-columns: auto;
}

@keyframes result {
  from {
    border: 5px solid #1aab5f;
  }
  to {
    border: 5px solid #1aab5f;
  }
}
.dialog-tip_win_lose1 {
  background-color: #0d6751;
  box-shadow: 2px 2px 20px 1px;
  border: 2px solid #22c99b;
  border-radius: 10px;
  text-align: center;
}
.none_header1 .el-dialog__header {
  display: none;
}
.dialog_tip .el-dialog__title {
  color: white;
}
.dialog-tip_win_lose1 h3 {
  color: white;
  margin: 0 0 20px 0;
}
.dialog-tip_win_lose1 .close {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}

@media screen and (max-width: 1024px) {
  .dialog-tip {
    width: 65% !important;
  }
  .dialog-tip_win_lose {
    width: 50% !important;
  }
}

@media screen and (min-width: 415px) and (max-width: 768px) {
  .dialog-tip_win_lose1 {
    background-color: #0d6751;
    box-shadow: 2px 2px 20px 1px;
    border: 2px solid #22c99b;
    border-radius: 10px;
    text-align: center;
    width: 55% !important;
  }
  .dialog-tip_win_lose1 .el-dialog__body {
    padding: 20px 0;
  }
  .none_header1 .el-dialog__header {
    display: none;
  }
  .dialog_tip .el-dialog__title {
    color: white;
  }
  .dialog-tip_win_lose1 h3 {
    color: white;
    margin: 0 0 20px 0;
  }
  .dialog-tip_win_lose1 .close {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
  }
  .dialog-footer1 .el-button {
    padding: 8px 12px;
  }
}
@media screen and (min-width: 415px) and (max-width: 600px) {
  .dialog-tip {
    width: 65% !important;
  }
  .dialog-tip_win_lose {
    width: 50% !important;
  }
  .main__game--place--bet .list--bet--price img {
    width: 100px;
  }
  .list--bet--tip--clear .el-button {
    width: 100px;
    height: 40px;
    font-size: 10px;
  }
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .dialog-tip {
    width: 65% !important;
  }
  .dialog-tip_win_lose {
    width: 50% !important;
  }
  .list--bet--tip--clear .el-button {
    width: 100px;
    height: 40px;
    font-size: 10px;
  }
  .main__game--place--bet .list--bet--price img {
    width: 80px;
  }
  .tip__dealer {
    margin: 0 10px;
  }
  .main__game--place--bet--icon {
    grid-gap: 15px;
    padding: 15px;
  }
  .main__game--place--bet--icon .el-badge__content {
    z-index: 1;
    width: auto;
    height: 20px;
    transform: translateY(-40%) translateX(55%);
    line-height: 20px;
  }
  .list--bet--tip--clear {
    padding-top: 10px;
  }
  .main__game--max--min {
    font-size: 15px;
    height: 20px;
    line-height: 20px;
  }
  .main__game--balance .balance {
    font-size: 15px;
    height: 20px;
    line-height: 20px;
  }
  .dialog-tip_win_lose1 {
    background-color: #0d6751;
    box-shadow: 2px 2px 20px 1px;
    border: 2px solid #22c99b;
    border-radius: 10px;
    text-align: center;
    width: 55% !important;
  }
  .dialog-tip_win_lose1 .el-dialog__body {
    padding: 20px 0;
  }
  .none_header1 .el-dialog__header {
    display: none;
  }
  .dialog_tip .el-dialog__title {
    color: white;
  }
  .dialog-tip_win_lose1 h3 {
    color: white;
    margin: 0 0 20px 0;
  }
  .dialog-tip_win_lose1 .close {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
  }
  .dialog-footer1 .el-button {
    padding: 8px 12px;
  }
}
</style>
