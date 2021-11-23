<template>
  <div class="baccarat-mini">
    <div class="game-show-section">
      <!-- Hiển thị phần game bài -->
      <el-row>
        <el-col :span="12">
          <div class="show-player-cards">
            <PlayerCard :cards="playerCard" />
            <div v-if="scorePlayer >= 0" class="score-player">
              {{ scorePlayer }}
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="show-banker-cards">
            <BankerCard :cards="bankerCard" />
            <div v-if="scoreBanker >= 0" class="score-banker">
              {{ scoreBanker }}
            </div>
          </div>
        </el-col>
      </el-row>

      <div v-if="winner" class="result-box" :class="winner">
        {{ resultMessage }}
      </div>
    </div>

    <div class="main-game-section">
      <div class="bm-balance-place-bet-info">
        <div class="game-status-item">BALANCE: {{ balance | price }}</div>

        <div class="game-status-item">
          BANKER: {{ gamer_place_bet_data.banker | price }}
        </div>

        <div class="game-status-item">
          DRAGON: {{ gamer_place_bet_data.banker_dragon | price }}
        </div>

        <div class="game-status-item">
          TIE: {{ gamer_place_bet_data.tie | price }}
        </div>

        <div class="game-status-item">
          PLAYER: {{ gamer_place_bet_data.player | price }}
        </div>

        <div class="game-status-item">
          DRAGON: {{ gamer_place_bet_data.player_dragon | price }}
        </div>
      </div>

      <div class="bm-place-bet">
        <div class="float-section">
          <div class="game-status">
            <div class="counter-time" v-if="countDownTime > 0">
              <CountDownTimer
                ref="counter"
                :count="countDownTime"
                @end-time="endCountDownTimeGame"
                >s
              </CountDownTimer>
            </div>

            <div class="is-lock" v-if="this.isLock === true">
              <el-tooltip
                effect="dark"
                content="Game Locked, waiting for result"
                placement="bottom"
              >
                <i
                  style="font-size: 25px; color: yellow;"
                  class="el-icon-lock"
                ></i>
              </el-tooltip>
            </div>
          </div>

          <div class="sound">
            <button
              class="unmuted"
              v-if="this.muted === true"
              @click="unMutedAudio"
            >
              <img src="@/assets/images/volume-mute-solid.svg" />
            </button>
            <button class="muted" v-else @click="mutedAudio">
              <img src="@/assets/images/volume-up-solid.svg" />
            </button>
          </div>
        </div>

        <div class="tie--button">
          <el-badge
            :value="gamer_place_bet_data.tie | price"
            :hidden="gamer_place_bet_data.tie === 0"
            class="item"
            type="success"
          >
            <el-button
              :disabled="isGameLock || this.lock_game"
              @click="_selectBet(type_want_bet.tie)"
              :style="[styleValueBetTie, { margin: 0 }]"
              type="success"
              >TIE
            </el-button>
          </el-badge>
        </div>

        <div class="banker--button">
          <div style="margin-right: 25px">
            <el-badge
              :value="gamer_place_bet_data.banker | price"
              :hidden="gamer_place_bet_data.banker === 0"
              class="item2"
              type="success"
            >
              <el-button
                class="background-banker"
                :disabled="isGameLock || this.lock_game"
                :style="styleValueBetBanker"
                @click="_selectBet(type_want_bet.banker)"
                type="success"
                >BANKER</el-button
              >
            </el-badge>
          </div>

          <div>
            <el-badge
              :value="gamer_place_bet_data.banker_dragon | price"
              :hidden="gamer_place_bet_data.banker_dragon === 0"
              class="item2"
              type="success"
            >
              <el-button
                :disabled="isGameLock || disable_dragon || lock_game"
                :style="styleValueBetBankerDragon"
                @click="_selectBet(type_want_bet.banker_dragon)"
                type="success"
                >DRAGON</el-button
              >
            </el-badge>
          </div>
        </div>

        <div class="player--button ">
          <div style="margin-right: 25px">
            <el-badge
              :value="gamer_place_bet_data.player | price"
              :hidden="gamer_place_bet_data.player === 0"
              class="item2"
              type="success"
            >
              <el-button
                class="background-player"
                :disabled="isGameLock || lock_game"
                :style="styleValueBetPlayer"
                @click="_selectBet(type_want_bet.player)"
                type="success"
              >
                PLAYER
              </el-button>
            </el-badge>
          </div>

          <div>
            <el-badge
              :value="gamer_place_bet_data.player_dragon | price"
              :hidden="gamer_place_bet_data.player_dragon === 0"
              class="item2"
              type="success"
            >
              <el-button
                :disabled="isGameLock || disable_dragon || lock_game"
                :style="styleValueBetPlayerDragon"
                @click="_selectBet(type_want_bet.player_dragon)"
                type="success"
              >
                DRAGON
              </el-button>
            </el-badge>
          </div>
        </div>

        <div class="list--bet--price">
          <div class="button--bet--price">
            <button :disabled="this.lock_game" @click="_addPoint(1)">
              <img :src="`${wp_theme_url}images/chip_1.png`" />
            </button>

            <button :disabled="this.lock_game" @click="_addPoint(5)">
              <img :src="`${wp_theme_url}images/chip_5.png`" />
            </button>

            <button :disabled="this.lock_game" @click="_addPoint(25)">
              <img :src="`${wp_theme_url}images/chip_25.png`" />
            </button>

            <button :disabled="this.lock_game" @click="_addPoint(100)">
              <img :src="`${wp_theme_url}images/chip_100.png`" />
            </button>
          </div>
        </div>
        <div class="bm-settings-info">
          <PopConfirm
            :isVisible="confirm_place_bet"
            @cancel="confirm_place_bet = false"
            @confirm="place_bet"
            :title="$t('MSG_CONFIRM_PLACE_BET')"
          >
            <div slot="children">
              <el-button
                :disabled="!isPlaceBet || this.lock_game"
                @click="confirm_place_bet = true"
                class="btn-choice-bet"
              >
                PLACE BET
              </el-button>
            </div>
          </PopConfirm>

          <div style="margin: 0 15px">
            <el-button @click="dialog_tip = true" type="success"
              >TIP DEALER</el-button
            >
          </div>

          <div>
            <el-button
              @click="_clearAll"
              :disabled="isGameLock || this.lock_game"
              type="success"
              >CLEAR ALL</el-button
            >
          </div>
        </div>

        <div class="game--info">
          <div v-if="parseSetting.player" class="game-info-item">
            MAIN: {{ parseSetting.player.min | price }}/{{
              parseSetting.player.max | price
            }}MAX
          </div>

          <div v-if="parseSetting.player_dragon" class="game-info-item">
            DRAGON: {{ parseSetting.player_dragon.min | price }}/{{
              parseSetting.player_dragon.max | price
            }}MAX
          </div>

          <div v-if="parseSetting.tie" class="game-info-item">
            TIE: {{ parseSetting.tie.min | price }}/{{
              parseSetting.tie.max | price
            }}MAX
          </div>
        </div>
      </div>
    </div>

    <div class="table-grid-game-section">
      <BaccaratGridTable :arr_input="result_table_data" />
      <BaccaratGridTable2 :arr_input="result_table_data" />
    </div>

    <div class="action-list action-list-baccat-mini">
      <el-row>
        <!-- <el-col :span="8">
					<el-button type="info" @click="dialog_chat_visible = true">GROUP CHAT</el-button>
				</el-col>
				<el-col :span="6">
					<el-button type="info">9XAC.COM</el-button>
				</el-col> -->

        <el-col :span="24">
          <el-popconfirm
            title="Return to lobby, Are you sure?"
            @confirm="returnLobby"
            cancel-button-text="Cancel"
            confirm-button-text="Ok"
          >
            <el-button type="info" slot="reference">RETURN TO LOBBY</el-button>
          </el-popconfirm>
        </el-col>
      </el-row>
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

    <!-- Alert Game Result -->
    <el-dialog
      class="none_header1"
      v-if="this.amount !== 0"
      :visible.sync="dialogVisible"
      custom-class="dialog-tip_win_lose1"
      width="20%"
    >
      <div class="diaglog--win_lose1">
        <h3>
          You {{ this.win_lose == "win" ? "won" : "lost" }}: ${{ this.amount }}
        </h3>
        <span slot="footer" class="dialog-footer1">
          <el-button class="close" @click="close">Close</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- Dialog show chat -->
    <el-dialog
      top="20vh"
      :visible.sync="dialog_chat_visible"
      custom-class="group_chat_dialog"
      title="9Xac Chat"
      append-to-body
    >
      <div class="iframe-container">
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          :src="`${group_chat_url}?channel=baccarat`"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sound from "./SoundClass";
import { mapState } from "vuex";
import BaccaratGridTable from "./BaccaratGridTable.vue";
import BaccaratGridTable2 from "./GridTable2.vue";
import PlayerCard from "./PlayerCard.vue";
import BankerCard from "./BankerCard.vue";
import CountDownTimer from "./CountDownTimer";
export default {
  data() {
    return {
      reset_balance: 0,
      isLockDragon: false,
      on_game: false,
      dialogVisible: false,
      bg_sound: null,
      isLock: true,
      muted: false,
      start: 0,
      lock_game: true,
      new_game: "",
      countDownTime: 0,
      confirm_place_bet: false,
      current_bet: "",
      tip_value: 1,
      dialog_tip: false,
      title: "Baccarat Mini",
      baccarat_data: {
        banker: 0,
        banker_dragon: 0,
        player: 0,
        player_dragon: 0,
        tie: 0,
      },
      type_want_bet: {
        banker: "banker",
        banker_dragon: "banker_dragon",
        player: "player",
        player_dragon: "player_dragon",
        tie: "tie",
      },
      playerCard: [],
      bankerCard: [],
      scoreBanker: null,
      scorePlayer: null,
      winner: null,
      resultMessage: null,
      dialog_chat_visible: false,
    };
  },
  components: {
    BaccaratGridTable,
    BaccaratGridTable2,
    PlayerCard,
    BankerCard,
    CountDownTimer,
  },
  computed: {
    ...mapState({
      balance: (state) => state.balance,
      group_chat_url: (state) => state.group_chat_url,
      game_info: (state) => state.baccarat_mini.game_info,
      gamer_place_bet_data: (state) => state.baccarat_mini.gamer_place_bet_data,
      gamer_match: (state) => state.baccarat_mini.gamer_match,
      disable_bet: (state) => state.baccarat_mini.disable_bet,
      time_game: (state) => state.baccarat_mini.game_match_time_game,
      time_server: (state) => state.baccarat_mini.time_server,
      result_table_data: (state) => state.baccarat_mini.result_table_data,
      game_playing_id: (state) => state.baccarat_mini.game_playing_id,
      win_lose: (state) => state.baccarat_mini.win_lose,
      amount: (state) => state.baccarat_mini.amount,
    }),
    wp_theme_url() {
      return this.$store.state.WP_THEME_APP_URL;
    },
    parseSetting() {
      return this.game_info.config ? JSON.parse(this.game_info?.config) : {};
    },
    isGameLock() {
      return this.gamer_match.place_bet !== null;
    },
    disable_dragon() {
      return this.baccarat_data.player === 0 && this.baccarat_data.banker === 0;
    },
    isPlaceBet() {
      let total = 0;
      for (const [key, value] of Object.entries(this.baccarat_data)) {
        total += parseInt(value);
      }
      return total > 0 ? true : false;
    },
    styleValueBetTie() {
      return {
        border:
          this.current_bet === this.type_want_bet.tie
            ? "2px solid #eea347"
            : null,
      };
    },
    styleValueBetBanker() {
      return {
        border:
          this.current_bet === this.type_want_bet.banker
            ? "2px solid #eea347"
            : null,
      };
    },
    styleValueBetBankerDragon() {
      return {
        border:
          this.current_bet === this.type_want_bet.banker_dragon
            ? "2px solid #eea347"
            : null,
      };
    },
    styleValueBetPlayer() {
      return {
        border:
          this.current_bet === this.type_want_bet.player
            ? "2px solid #eea347"
            : null,
      };
    },
    styleValueBetPlayerDragon() {
      return {
        border:
          this.current_bet === this.type_want_bet.player_dragon
            ? "2px solid #eea347"
            : null,
      };
    },
    soundData() {
      return this.$store.state.baccarat_mini.sound_obj;
    },
    totalPlaceBet() {
      let total = 0;
      for (const [key, value] of Object.entries(this.baccarat_data)) {
        total += parseFloat(value);
      }
      return total;
    },
  },
  mounted() {
    this.on_game = true;
    this.loadGameMatchData();

    this.$store.dispatch("baccarat_mini/getTableResult");

    const channel = this.$pusher.subscribe("baccarat_mini_channel");
    channel.bind("new_game", (data) => {
      if (!this.on_game) return;
      this.loadGameMatchData();
      this.lock_game = false;
      console.log("New game from pusher");
      this.reset_bet();
      this.isLock = false;
      if (this.win_lose !== "") {
        this.dialogVisible = true;
      }
      this.current_bet = "";
    });

    channel.bind("lock_game", (data) => {
      if (!this.on_game) return;
      this.$store.commit("baccarat_mini/SET_WIN_LOST", "");
      this.$store.commit("baccarat_mini/SET_AMOUNT", 0);
      this.lock_game = data.lock_status;
      this.autoRequest();
      this.isLock = true;
      console.log("Locked");
      this.clearGameData();
    });

    sound.bgSound();
  },
  watch: {
    balance() {
      this.balance_bonus = this.balance;
    },
    muted(newVal, oldVal) {
      if (newVal) {
        sound.mute();
      } else {
        sound.unmute();
      }
    },
  },
  methods: {
    mutedAudio() {
      this.muted = true;
    },
    unMutedAudio() {
      this.muted = false;
    },
    showResultGame(data, callback) {
      if (!this.on_game) return;
      let _this = this;
      this.playerCard = data.cards_player;
      this.bankerCard = data.cards_banker;
      let sound_list_arr = [];
      sound_list_arr.push(`player_${data.player_score_end}`);
      sound_list_arr.push(`banker_${data.banker_score_end}`);
      if (data.natural_player || data.natural_banker) {
        if (data.natural_player) {
          sound_list_arr.push(`player_natural_${data.player_score_end}`);
        } else {
          sound_list_arr.push(`banker_natural_${data.banker_score_end}`);
        }
      }

      if (data.winner === "tie") {
        sound_list_arr.push("tie_hand");
      } else {
        sound_list_arr.push(`${data.winner}_wins`);
      }

      if (data.banker_dragon > 0) {
        sound_list_arr.push(`banker_dragon_${data.banker_dragon}`);
      }
      if (data.player_dragon > 0) {
        sound_list_arr.push(`player_dragon_${data.player_dragon}`);
      }
      if (data.banker_dragon === 30 || data.player_dragon === 30) {
        sound_list_arr.push("bravo");
      }

      setTimeout(() => {
        _this.scorePlayer = data.player_score_start;
        _this.scoreBanker = data.banker_score_start;

        setTimeout(() => {
          _this.scorePlayer = data.player_score_end;
          _this.scoreBanker = data.banker_score_end;

          setTimeout(() => {
            _this.winner = data.winner;
            _this.$store.dispatch("baccarat_mini/getTableResult");
          }, 2000);

          if (data.winner === "tie")
            _this.resultMessage = data.winner.toUpperCase();
          else {
            _this.resultMessage = `${data.winner.toUpperCase()} WIN`;
          }

          //let sound_list_arr = ['player_natural_9', 'player_wins', 'banker_dragon_30', 'bravo'];
          sound.result(sound_list_arr, function() {
            if (typeof callback === "function") callback();
          });
        }, 4000);
      }, 9000);
      sound.dealingCards();
    },
    clearGameData() {
      this.playerCard = [];
      this.bankerCard = [];
      this.scoreBanker = null;
      this.scorePlayer = null;
      this.winner = null;
      this.resultMessage = null;
    },
    clearGameData() {
      this.playerCard = [];
      this.bankerCard = [];
      this.scoreBanker = null;
      this.scorePlayer = null;
      this.winner = null;
      this.resultMessage = null;
    },
    reset_bet() {
      this.baccarat_data = {
        banker: 0,
        banker_dragon: 0,
        player: 0,
        player_dragon: 0,
        tie: 0,
      };
      this.$store.commit("baccarat_mini/SET_RESET_BET", this.baccarat_data);
    },
    endGame() {
      this.$store.dispatch("baccarat_mini/endGame").then((res) => {
        //console.log('newgamehihi',res)
      });
    },
    endCountDownTimeGame() {
      this.ping();
      //console.log('Do something when end time');
    },
    ping() {
      this.$store.dispatch("baccarat_mini/pingGame");
    },
    _addPoint(point) {
      let game_info_config = JSON.parse(this.game_info.config);
      let current_bet_key = this.current_bet;

      if (this.balance >= point && this.current_bet) {
        if (
          this.baccarat_data[current_bet_key] + point >
          parseInt(game_info_config[current_bet_key].max)
        ) {
          console.log("Không cho phép");
          return;
        } else {
          this.baccarat_data[current_bet_key] =
            parseInt(this.baccarat_data[current_bet_key]) + point;
        }

        let new_balance = parseFloat(this.balance) - point;
        this.$store.commit("SET_BALANCE", new_balance.toFixed(2));
        this.$store.commit("baccarat_mini/SET_PLAYING_BET", this.baccarat_data);
        sound.chipBet();
      }
    },
    _clearAll() {
      this.current_bet = "";
      //Update new balance
      let new_balance =
        parseFloat(this.balance) + parseFloat(this.totalPlaceBet);
      this.$store.commit("SET_BALANCE", parseFloat(new_balance.toFixed(2)));

      //Reset
      this.baccarat_data = {
        banker: 0,
        banker_dragon: 0,
        player: 0,
        player_dragon: 0,
        tie: 0,
      };
      this.$store.commit("baccarat_mini/SET_PLAYING_BET", this.baccarat_data);
    },

    autoRequest() {
      let _this = this;
      this.$store
        .dispatch("baccarat_mini/getGameBaccaratMiniResult")
        .then((res) => {
          //this.$store.commit("baccarat_mini/SET_RESULT_TABLE_DATA",res.table_result)
          this.reset_balance = parseFloat(res.balance);

          if (res.game_match && res.game_match.result_config !== null) {
            this.showResultGame(res.game_match.result_config, function() {
              _this.endGame();
              //console.log('Endgame')
            });
          } else {
            //_this.endGame();
          }
        });
    },
    loadGameMatchData() {
      let _this = this;
      let start_time = new Date().getTime();
      this.$store.dispatch("baccarat_mini/loadGameMatchData").then((res) => {
        let endtime_time = new Date().getTime();
        let rs = (endtime_time - start_time) / 1000;
        this.countDownTime = res.time_remaining - rs;
        this.countDownTime = Math.round(this.countDownTime);
        if (this.countDownTime < 0) {
          this.countDownTime = 0;
        }
        setTimeout(() => {
          if (_this.$refs.counter !== undefined) {
            _this.$refs.counter.play();
          }
        }, 10);
      });
    },
    _selectBet(bet) {
      this.current_bet = bet;
    },
    close() {
      (this.dialogVisible = false),
        this.$store.commit(
          "SET_BALANCE",
          parseFloat(this.reset_balance).toFixed(2)
        );
    },
    place_bet() {
      this.confirm_place_bet = false;
      let data = {
        place_bet: this.baccarat_data,
        game_playing_id: this.$store.state.baccarat_mini.game_playing_id,
      };
      this.$store.dispatch("baccarat_mini/placeBet", data).then((res) => {
        if (!res.errors) {
          this.$message({
            message: "Your bet has been successfully placed.",
            type: "success",
          });
        } else {
          this.$message({
            message: "An unexpected error occurred.",
            type: "warning",
          });
        }

        //this.confirm_place_bet = false;
        this.lock_game = true;
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
          .dispatch("baccarat_mini/sendTipDealer", this.tip_value)
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
  destroyed() {
    console.log("Destroyed Baccarat Mini Game");
    this.on_game = false;
    sound.bgSoundPause();
    this.$destroy();
  },
};
</script>
<style>
.score-player,
.score-banker {
  position: absolute;
}
.score-player {
  top: 60%;
  right: 10%;
  font-size: 80px;
  font-weight: 700;
}
.score-banker {
  top: 60%;
  left: 10%;
  font-size: 80px;
  font-weight: 700;
}
.baccarat-mini {
  color: #fff;
}
.baccarat-mini .is-lock {
  display: inline-block;
}
.game-show-section {
  position: relative;
  display: flex;
  display: block;
}
.baccarat-mini .float-section {
  position: relative;
  float: left;
  width: 100%;
  height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
}
.baccarat-mini .float-section .game-status {
  float: left;
  max-width: 50%;
}
.baccarat-mini .game-status {
  display: flex;
}
.baccarat-mini .float-section .sound {
  float: right;
  max-width: 50%;
  margin-right: -5px;
  margin-top: 1px;
}
.game-show-section .result-box {
  position: absolute;
  width: 140px;
  height: 100px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border: 1px solid #ffffff;
  font-size: 23px;
  font-weight: 500;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
}
.game-show-section .result-box.banker {
  background-color: rgba(108, 0, 0, 255);
}
.game-show-section .result-box.tie {
  background-color: #eec485;
}
.game-show-section .result-box.player {
  background-color: #025b86;
}
.tie--button .isLock {
  font-size: 30px;
  color: yellow;
}
.game-show-section .el-col {
  height: 400px;
}
.show-player-cards {
  position: relative;
  background-color: #025b86;
  height: 100%;
}
.show-banker-cards {
  position: relative;
  background-color: rgba(108, 0, 0, 255);
  height: 100%;
}
.background-player {
  background-color: #025b86 !important;
}
.background-banker {
  background-color: #6c0000 !important;
}
.main-game-section {
  display: block;
}
.table-grid-game-section {
  display: block;
}
.bm-balance-place-bet-info {
  display: grid;
  grid-template-columns: auto auto auto;
  width: 100%;
}
.bm-balance-place-bet-info .game-status-item {
  border: 2px solid white;
  text-align: center;
  color: #ffffff;
  font-weight: bold;
  background-color: #1e6942;
  font-size: 16px;
  height: 23px;
  line-height: 23px;
}
.bm-place-bet {
  padding: 20px 0 0;
}
.bm-place-bet .tie--button {
  display: flex;
  justify-content: center;
  clear: both;
}
.bm-place-bet .banker--button {
  display: flex;
  justify-content: center;
  padding: 25px;
}
.bm-place-bet .player--button {
  display: flex;
  justify-content: center;
}
.bm-place-bet .el-button {
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
.dialog-tip_win_lose1 h3 {
  color: white;
  margin: 0 0 20px 0;
}
.dialog-tip_win_lose1 .close {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}
.bm-place-bet .el-button:disabled {
  opacity: 0.5;
}
.bm-place-bet .el-button--success.is-disabled:hover {
  background-color: #0d6751;
  border: 2px solid #22c99b;
}
.bm-place-bet .el-button--success.is-disabled:focus {
  outline: none;
  border: 2px solid #eea347;
  font-weight: 400;
}
.button--bet--price {
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
  /* background-color: transparent; */
}
.button--bet--price button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.bm-settings-info {
  display: flex;
  justify-content: center;
}
.bm-settings-info .el-button {
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
.game--info {
  padding: 20px 0 0;
  display: grid;
  grid-template-columns: auto auto auto;
  width: 100%;
}
.game--info .game-info-item {
  border: 2px solid white;
  text-align: center;
  color: #ffffff;
  font-weight: bold;
  background-color: #1e6942;
  font-size: 16px;
  height: 23px;
  line-height: 23px;
}
.action-list {
  background-color: white;
}
.baccarat-mini .action-list-baccat-mini {
  display: block;
}
.action-list .el-button--info {
  border: 2px solid #fff;
  font-weight: 700;
  background-color: #333;
  font-size: 16px;
  width: 100%;
  cursor: pointer;
}

.dialog-tip {
  background-color: #0d6751;
  box-shadow: 2px 2px 20px 1px;
  border: 2px solid #22c99b;
  border-radius: 10px;
  width: 20%;
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
.dialog-tip_win_lose h3 {
  color: white;
  margin: 0 0 20px 0;
}
.diaglog--win_lose .close {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}
.sound .muted img {
  width: 25px;
  color: yellow;
}
.sound .muted {
  background-color: transparent;
  border: 0;
}
.sound .unmuted img {
  width: 25px;
  color: yellow;
}
.sound .unmuted {
  background-color: transparent;
  border: 0;
}
/* @media screen and (max-width: 710px) {
	.game-show-section .el-col {
		height: 337px;	
	}
} */
@media screen and (min-width: 716px) and (max-width: 767px) {
  .game-show-section .el-col {
    height: 404px;
  }
  .el-popup-parent--hidden {
    padding-right: 0;
  }
  .dialog-tip {
    width: 65% !important;
  }
  .dialog-tip_win_lose1 {
    width: 50% !important;
  }
  .score-banker {
    top: 60%;
    left: 5%;
  }
}
@media screen and (min-width: 586px) and (max-width: 715px) {
  .game-show-section .el-col {
    height: 335px;
  }
  .el-popup-parent--hidden {
    padding-right: 0;
  }
  .dialog-tip {
    width: 65% !important;
  }
  .dialog-tip_win_lose1 {
    width: 50% !important;
  }
  .score-banker {
    top: 60%;
    left: 5%;
  }
}
@media screen and (min-width: 501px) and (max-width: 585px) {
  .game-show-section .el-col {
    height: 285px;
  }
  .el-popup-parent--hidden {
    padding-right: 0;
  }
  .dialog-tip {
    width: 65% !important;
  }
  .dialog-tip_win_lose {
    width: 50% !important;
  }
  .button--bet--price {
    display: flex;
    margin: 0 auto;
    justify-content: space-evenly;
    width: 390px;
  }
  .button--bet--price img {
    width: 100px;
  }
  .score-banker {
    top: 60%;
    left: 5%;
  }
}
@media screen and (min-width: 415px) and (max-width: 500px) {
  .game-show-section .el-col {
    height: 240px;
  }
  .el-popup-parent--hidden {
    padding-right: 0;
  }
  .dialog-tip {
    width: 65% !important;
  }
  .dialog-tip_win_lose {
    width: 50% !important;
  }
  .bm-balance-place-bet-info .game-status-item {
    font-size: 12px;
    height: 17px;
    line-height: 17px;
  }
  .bm-place-bet .el-button {
    width: 100px;
    height: 40px;
    font-size: 10px;
  }
  .list--bet--price,
  .button--bet--price {
    display: flex;
    margin: 0 auto;
    justify-content: space-evenly;
    width: 300px;
  }
  .button--bet--price img {
    width: 64px;
  }
  .game--info .game-info-item {
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    background-color: #1e6942;
    font-size: 12px;
    height: 21px;
    line-height: 22px;
  }
  .action-list .el-button--info {
    font-size: 10px;
  }
  .score-banker {
    top: 60%;
    left: 5%;
  }
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .game-show-section .el-col {
    height: 210px;
  }
  .el-popup-parent--hidden {
    padding-right: 0;
  }
  .dialog-tip {
    width: 65% !important;
  }
  .dialog-tip_win_lose {
    width: 50% !important;
  }
  .bm-balance-place-bet-info .game-status-item {
    font-size: 12px;
    height: 17px;
    line-height: 17px;
  }
  .bm-place-bet .el-button {
    width: 100px;
    height: 40px;
    font-size: 10px;
  }
  .list--bet--price,
  .button--bet--price {
    display: flex;
    margin: 0 auto;
    justify-content: space-evenly;
    width: 300px;
  }
  .button--bet--price img {
    width: 64px;
  }
  .game--info .game-info-item {
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    background-color: #1e6942;
    font-size: 12px;
    height: 21px;
    line-height: 22px;
  }
  .action-list .el-button--info {
    font-size: 10px;
  }
  .score-banker {
    top: 60%;
    left: 5%;
  }
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .score-player {
    top: 67%;
    right: 8%;
    font-size: 60px;
    font-weight: 700;
  }
  .score-banker {
    top: 67%;
    left: 8%;
    font-size: 60px;
    font-weight: 700;
  }
}
@media screen and (min-width: 415px) and (max-width: 500px) {
  .score-player {
    top: 64%;
    right: 8%;
  }
  .score-banker {
    top: 64%;
    left: 8%;
  }
}
@media screen and (min-width: 501px) and (max-width: 767px) {
  .score-player {
    top: 67%;
    right: 8%;
  }
  .score-banker {
    top: 67%;
    left: 8%;
  }
}
</style>
