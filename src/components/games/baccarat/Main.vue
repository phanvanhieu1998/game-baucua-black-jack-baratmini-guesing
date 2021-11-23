<template>
  <div class="game-wrapper-baccarat">
    <section class="section-1">
      <div class="game-display">
        <iframe
          :allowfullscreen="0"
          height="315"
          width="560"
          class="responsive-iframe"
          :src="
            `https://www.youtube.com/embed/${getEmbedUrl}?playsinline=1&controls=0`
          "
        ></iframe>
      </div>
      <div class="game-status">
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
    </section>

    <section class="section-2">
      <section class="child-section-1">
        <el-tooltip
          effect="dark"
          content="Game Locked, waiting for result"
          placement="bottom"
          v-if="isLock"
        >
          <i class="el-icon-lock"></i>
        </el-tooltip>

        <div v-if="gamer_match && gamer_match.status !== '3'">
          <div v-if="gamer_match.seat === '0'" class="splash_open">
            <el-button @click="onSeatOpen" type="text">[SEAT_OPEN]</el-button>
          </div>
          <div v-else class="list-btn-bet">
            <el-badge
              :value="gamer_place_bet_data.tie | price"
              :hidden="gamer_place_bet_data.tie === 0"
              class="item"
              type="success"
            >
              <button
                :disabled="isGameLock"
                :style="[
                  {
                    border:
                      current_bet === type_want_bet.tie
                        ? '2px solid #eea347'
                        : null,
                  },
                  { margin: 0 },
                ]"
                class="btn-choice-bet"
                @click="_selectBet(type_want_bet.tie)"
              >
                TIE
              </button>
            </el-badge>

            <div class="list-btn-choice-bet">
              <el-badge
                :value="gamer_place_bet_data.banker | price"
                :hidden="gamer_place_bet_data.banker === 0"
                class="item2"
                type="success"
              >
                <button
                  :disabled="isGameLock"
                  :style="{
                    border:
                      current_bet === type_want_bet.banker
                        ? '2px solid #eea347'
                        : null,
                  }"
                  class="btn-choice-bet"
                  @click="_selectBet(type_want_bet.banker)"
                >
                  BANKER
                </button>
              </el-badge>
              <el-badge
                :value="gamer_place_bet_data.banker_dragon | price"
                :hidden="gamer_place_bet_data.banker_dragon === 0"
                class="item2"
                type="success"
              >
                <button
                  :disabled="isGameLock || disable_dragon"
                  :style="{
                    border:
                      current_bet === type_want_bet.banker_dragon
                        ? '2px solid #eea347'
                        : null,
                  }"
                  class="btn-choice-bet"
                  @click="_selectBet(type_want_bet.banker_dragon)"
                >
                  DRAGON
                </button>
              </el-badge>
              <el-badge
                :value="gamer_place_bet_data.player | price"
                :hidden="gamer_place_bet_data.player === 0"
                class="item2"
                type="success"
              >
                <button
                  :disabled="isGameLock"
                  :style="{
                    border:
                      current_bet === type_want_bet.player
                        ? '2px solid #eea347'
                        : null,
                  }"
                  class="btn-choice-bet"
                  @click="_selectBet(type_want_bet.player)"
                >
                  PLAYER
                </button>
              </el-badge>
              <el-badge
                :value="gamer_place_bet_data.player_dragon | price"
                :hidden="gamer_place_bet_data.player_dragon === 0"
                class="item2"
                type="success"
              >
                <button
                  :disabled="isGameLock || disable_dragon"
                  :style="{
                    border:
                      current_bet === type_want_bet.player_dragon
                        ? '2px solid #eea347'
                        : null,
                  }"
                  class="btn-choice-bet"
                  @click="_selectBet(type_want_bet.player_dragon)"
                >
                  DRAGON
                </button>
              </el-badge>
            </div>
          </div>
        </div>
        <div v-else class="splash_open">
          <h3>
            {{ $t("MSG_TABLE_FULL") }}
          </h3>
        </div>

        <div class="list-porker">
          <el-button :disabled="!current_bet" type="text"
            ><img
              class="pokerchip"
              @click="_addPoint(1)"
              :src="`${wp_theme_url}images/chip_1.png`"
              alt="#1"
          /></el-button>
          <el-button :disabled="!current_bet" type="text"
            ><img
              class="pokerchip"
              @click="_addPoint(5)"
              :src="`${wp_theme_url}images/chip_5.png`"
              alt="#5"
          /></el-button>
          <el-button :disabled="!current_bet" type="text"
            ><img
              class="pokerchip"
              @click="_addPoint(25)"
              :src="`${wp_theme_url}images/chip_25.png`"
              alt="#25"
          /></el-button>
          <el-button :disabled="!current_bet" type="text">
            <img
              class="pokerchip"
              @click="_addPoint(100)"
              :src="`${wp_theme_url}images/chip_100.png`"
              alt="#100"
          /></el-button>
        </div>
        <div class="list-btn-second">
          <PopConfirm
            :isVisible="confirm_place_bet"
            @cancel="confirm_place_bet = false"
            @confirm="_onPlaceBet"
            :title="$t('MSG_CONFIRM_PLACE_BET')"
          >
            <div slot="children">
              <button
                :disabled="!current_bet || disable_bet"
                @click="confirm_place_bet = true"
                class="btn-choice-bet"
              >
                PLACE BET
              </button>
            </div>
          </PopConfirm>
          <el-button
            class="btn-choice-bet tip-btn"
            type="text"
            @click="dialog_tip = true"
            >TIP DEALER</el-button
          >
          <button
            :disabled="gamer_match && gamer_match.place_bet !== null"
            @click="_clearAll"
            class="btn-choice-bet"
          >
            CLEAR ALL
          </button>
        </div>
        <div class="game-info">
          <div v-if="parseSetting.player" class="game-info-item">
            MAIN: {{ parseSetting.player.min | price }}/{{
              parseSetting.player.max | price
            }}Max
          </div>
          <div v-if="parseSetting.player_dragon" class="game-info-item">
            DRAGON: {{ parseSetting.player_dragon.min | price }}/{{
              parseSetting.player_dragon.max | price
            }}Max
          </div>
          <div v-if="parseSetting.tie" class="game-info-item">
            TIE: {{ parseSetting.tie.min | price }}/{{
              parseSetting.tie.max | price
            }}Max
          </div>
        </div>

        <div class="table-wrapper">
          <table v-if="tableData1[0]">
            <tr
              v-for="i in game_table_length.table1.row"
              :key="i"
              :style="{ backgroundColor: i === 7 ? '#F3EEC3' : null }"
            >
              <td v-for="j in game_table_length.table1.col" :key="j">
                <div class="span-table">
                  <span :class="[`${getDot(tableData1[i - 1][j - 1])}`]"></span>
                </div>
              </td>
            </tr>
          </table>

          <table v-if="tableData2[0]">
            <tr v-for="i in game_table_length.table2.row" :key="i">
              <td v-for="j in game_table_length.table2.col" :key="j">
                <div class="span-table">
                  <span :class="[`${getDot(tableData2[i - 1][j - 1])}`]"></span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </section>
      <section class="child-section-2">
        <div class="action-list">
          <button @click="dialog_chat_visible = true" class="action-item">
            GROUP CHAT
          </button>
          <button class="action-item">
            <a
              style="color: #ffffff; text-decoration: none"
              href="https://9xac.com/"
              target="_blank"
              >9XAC.COM</a
            >
          </button>
          <el-popconfirm
            title="Return to lobby, Are you sure?"
            @confirm="returnLobby"
            cancel-button-text="Cancel"
            confirm-button-text="Ok"
          >
            <el-button class="action-item" type="text" slot="reference"
              >RETURN TO LOBBY</el-button
            >
          </el-popconfirm>
        </div>
      </section>
    </section>

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

    <el-dialog
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
        <!-- <el-input-number
          v-model="tip_value"
          :min="5"
          :max="balance"
          controls-position="right"
        ></el-input-number> -->
      </div>

      <div slot="footer" class="tip-footer">
        <el-button @click="dialog_tip = false">Cancel</el-button>
        <el-button type="primary" @click="_onTipDealer">Ok</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import "@/assets/css/baccarat.css";
export default {
  data() {
    return {
      current_bet: "",
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
      tableData1: [],
      tableData2: [],
      balance_bonus: 0,
      confirm_place_bet: false,
      confirm_donate: false,
      dialog_tip: false,
      tip_value: 1,
      confirm_out_game: false,
      dialog_chat_visible: false,
    };
  },
  computed: {
    ...mapState({
      group_chat_url: (state) => state.group_chat_url,
      balance: (state) => state.balance,
      gamer_place_bet_data: (state) => state.baccarat.gamer_place_bet_data,
      game_info: (state) => state.baccarat.game_info,
      gamer_match: (state) => state.baccarat.gamer_match,
      game_match_info: (state) => state.baccarat.game_match_info,
      game_table_length: (state) => state.baccarat.game_table_length,
      game_playing_id: (state) => state.baccarat.game_playing_id,
      disable_bet: (state) => state.baccarat.disable_bet,
      game_active: (state) => state.baccarat.game_active,
    }),
    ...mapGetters({
      initGameTable1: "baccarat/initGameTable1",
      initGameTable2: "baccarat/initGameTable2",
      isLock: "baccarat/isLock",
      isClose: "baccarat/isClose",
    }),
    isGameLock() {
      return (
        this.gamer_match.place_bet !== null || this.disable_bet || this.isLock
      );
    },
    parseSetting() {
      return this.game_info.config ? JSON.parse(this.game_info?.config) : {};
    },
    getEmbedUrl() {
      return this.parseSetting.yt_link
        ? this.parseSetting.yt_link.split("?v=")[1]
        : "";
    },
    wp_theme_url() {
      return this.$store.state.WP_THEME_APP_URL;
    },
    disable_dragon() {
      return this.baccarat_data.player === 0 && this.baccarat_data.banker === 0;
    },
  },
  watch: {
    balance() {
      this.balance_bonus = this.balance;
    },
    disable_bet() {
      if (this.disable_bet) {
        this._clearAll();
      }
    },
    game_active() {
      if (this.game_active && this.game_playing_id == 0) {
        this.returnLobby();
      }
    },
  },
  mounted() {
    // if(this.game_match_info == null || this.gamer_match == null) {
    //   this.returnLobby();
    // }
    this.loadGameMatchData();
    const channel = this.$pusher.subscribe("game_match_update_channel");
    channel.bind("table_update", (data) => {
      console.log(data);
      this.loadGameMatchData();
    });
    channel.bind("game_lock_update", (data) => {
      console.log(data);
      this.$store.commit("baccarat/SET_LOCK_GAME_MATCH", 1);
    });
  },
  methods: {  
    loadGameMatchData() {
      this.$store
        .dispatch("baccarat/loadGameMatchData")
        .then((res) => {
          this.balance_bonus = this.balance;
          this.tableData1 = this.initGameTable1; 
          this.tableData2 = this.initGameTable2;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    _selectBet(bet) {
      this.current_bet = bet;
    },
    _clearAll() {
      //sum of money user has decrement
      const sumMoneyLost = () => {
        let sum = 0;
        for (let i in this.gamer_place_bet_data) {
          sum += this.gamer_place_bet_data[i];
        }
        return sum;
      };
      this.balance_bonus += sumMoneyLost();
      this.baccarat_data = {
        banker: 0,
        banker_dragon: 0,
        player: 0,
        player_dragon: 0,
        tie: 0,
      };
      this.$store.commit("baccarat/SET_PLAYING_BET", this.baccarat_data);
      this.$store.commit("SET_BALANCE", this.balance_bonus);
      this.current_bet = "";
    },
    _addPoint(point) {
      if (this.balance >= point && this.current_bet) {
        for (let i in this.baccarat_data) {
          if (this.current_bet === i) {
            this.baccarat_data[i] += point;
            this.$store.commit("baccarat/SET_PLAYING_BET", this.baccarat_data);
          }
        }
        this.$store.commit("SET_BALANCE", (this.balance_bonus -= point));
      }
    },
    _onPlaceBet() {
      this.$store
        .dispatch("baccarat/placeBet")
        .then((res) => {
          this.confirm_place_bet = false;
          this.current_bet = "";
          this.loadGameMatchData();
           this.$store.commit("SET_BALANCE", res.data.user_points);
        })
        .catch((error) => {
          console.log(error.response.data.message);
          this.$message.error(`${error.response.data.message}`);
          this._clearAll();
          this.confirm_place_bet = false;
        });
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
      // this.tip_value = parseInt(this.tip_value)
      if (this.balance >= 1) {
        this.$store
          .dispatch("baccarat/sendTipDealer", this.tip_value)
          .then((res) => {
            //console.log(res);
            this.$message({
              message: this.$t("MSG_TIP_DEALER_SUCCESS"),
              type: "success",
            });
            this.$store.commit("SET_BALANCE", res.data.user_points);
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
    onSeatOpen() {
      this.$store
        .dispatch("baccarat/openSeat")
        .then((res) => this.loadGameMatchData())
        .catch((error) => console.error(error));
    },
    returnLobby() {
      this.$store
        .dispatch("userQuitGame", this.game_playing_id)
        .then((res) => {
          this.$forceUpdate();
        })
        .catch((error) => {});
    },
    getDot(value) {
      switch (value) {
        case "B":
          return "red-dot";
        case "P":
          return "blue-dot";
        case "T":
          return "green-dot";
        case "BT":
          return "green-red-dot";
        case "PT":
          return "green-blue-dot";
        default:
          return "";
      }
    },
  },
  destroyed() {
    this.$store.commit("baccarat/RESET_CURRENT_BET");
  },
};
</script>
