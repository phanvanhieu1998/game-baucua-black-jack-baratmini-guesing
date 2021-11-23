<template>
  <div class="living-betting-main">
    <!--<div id="game-guide-rules" v-if="is_show_guide_box"> -->
    <div
      :class="[{ noGameGue: game_list.length == 0 }]"
      v-if="game_list.length == 0"
    >
      <div class="notifiAll">
        <h2
          style="text-align: center;
    padding: 20px 0 0 0"
          class="notifiAllh2"
        >
          All bet options displayed are in moneyline payout.
        </h2>

        <h2 style="margin: 10px 0">For example:</h2>
        <h2>+120 means risking $100 to win $120</h2>
        <h2>+50 means risking $100 to win $50</h2>
      </div>
      <div v-for="(item, index) in guide_play" :key="index" class="notifi">
        <h2>{{ item.type }}</h2>
        <h2>{{ item.rules1 }}</h2>
        <h2>{{ item.rules2 }}</h2>
        <h2>{{ item.rules3 }}</h2>
        <h2>{{ item.rules4 }}</h2>
      </div>
      <!--<img src="@/assets/images/image.png" /> 
      <div class="action-display">
        <el-button type="primary" @click="show_guide = false">Got it</el-button>
        <el-button type="primary" @click="dont_show_me"
          >Don’t show me this again</el-button
        >
      </div> -->
    </div>

    <div v-else class="living-betting-game-list">
      <GameItem
        v-for="game in game_list"
        :key="game.id"
        :game="game"
        @up-date-current="updateCurrent"
        :bettings="bettings"
        @currentBet="selectCurrent"
        @reset="resetBet"
      >
      </GameItem>
    </div>

    <div class="list-balance-min-max">
      <div class="min-max list-balance-min-max_balance">
        BALANCE: {{ balance | price }}
      </div>

      <div class="min-max list-balance-min-max_min">
        MIN: {{ game_info.min | price }}
      </div>

      <div class="min-max list-balance-min-max_max">
        MAX: {{ game_info.max | price }}
      </div>
    </div>

    <div class="list__img--bet--level">
      <div class="image-level-bet">
        <button @click="_addPoint(n)" v-for="n in [1, 5, 25, 100]" :key="n">
          <img :src="`${wp_theme_url}images/chip_${n}.png`" />
        </button>
      </div>
    </div>
    <span class="countdown" v-if="game_timeleft != 0">{{ game_timeleft }}</span>
    <div class="list__bet__tip__clear">
      <PopConfirm
        :isVisible="confirm_place_bet"
        @cancel="confirm_place_bet = false"
        @confirm="place_bet"
        :title="$t('MSG_CONFIRM_PLACE_BET')"
      >
        <div slot="children">
          <el-button
            style="padding: 0 5px;"
            :disabled="!isPlaceBet || placeBet"
            @click="confirm_place_bet = true"
            class="btn-choice-bet place-tip-clear"
          >
            PLACE BET
          </el-button>
        </div>
      </PopConfirm>

      <div class="tip__dealer">
        <el-button
          style="padding: 0 5px;"
          class="place-tip-clear "
          @click="dialog_tip = true"
          type="success"
          >TIP WATERBOY</el-button
        >
      </div>

      <div>
        <el-button class="place-tip-clear" type="success" @click="clear_all"
          >CLEAR ALL</el-button
        >
      </div>
    </div>

    <div style="padding:10px 0 10px 0" class="list__bet__tip__clear">
      <el-popconfirm
        title="Go to game Sportsbook, Are you sure?"
        @confirm="nextGame"
        cancel-button-text="Cancel"
        confirm-button-text="Ok"
      >
        <el-button
          style="padding: 0 5px;width: 100%;"
          slot="reference"
          class="betting_door_list_1"
        >
          Sportsbook
        </el-button>
      </el-popconfirm>
    </div>

    <div class="pending--result">
      <span>PENDING BETS AND RESULTS:</span>
    </div>
    <div :class="[{ 'scroll--peding': doneGame != '' }]">
      <div
        class="red--zone"
        :class="[`lbgt-${game.type}`]"
        v-for="game in doneGame"
        :key="game.id"
        :game="game"
      >
        <el-row>
          <el-col class="style___type" :xs="5" :sm="4">
            <span>
              {{ typeGame(game.type) }}
            </span>
          </el-col>

          <el-col :xs="19" :sm="20">
            <el-row>
              <el-col :xs="24" :span="10">
                <div class="red-zone-text">
                  <span style="color:black;padding-left:10px">{{
                    game.title
                  }}</span>
                </div></el-col
              >
              <el-col :xs="24" :span="14">
                <div class="red-zone-text">
                  <div
                    v-for="(value, key) in game.settings"
                    :key="key"
                    class="red-zone-text-right"
                  >
                    <el-button
                      :class="[
                        `list-button-${game.type}`,
                        { none: value == 0 },
                      ]"
                      style="text-transform: uppercase;"
                    >
                      <span>{{ key }} (+{{ game.settings[key] }})</span>
                    </el-button>

                    <span
                      v-if="game.betting_result < 0"
                      style="color:black;padding:0 10px"
                      >[Risking: ${{ game.betting[key] }} | Result:
                      {{ game.betting_result }}]</span
                    >
                    <span v-else style="color:black;padding:0 5px"
                      >[Risking: ${{ game.betting[key] }} | Result: +{{
                        game.betting_result
                      }}]</span
                    >

                    <div>
                      <img
                        @click="deleteGame(game.id)"
                        slot="reference"
                        style="width:20px;float:right;margin-right:5px;cursor: pointer;"
                        src="@/assets/images/times-solid.svg"
                      />
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- </div> -->
          </el-col>
        </el-row>
      </div>
    </div>
    <div :class="[{ 'scroll--peding': game_list_place_bet != '' }]">
      <div
        class="red--zone"
        v-for="game in game_list_place_bet"
        :key="game.id"
        :game="game"
        :class="[`lbgt-${game.type}`]"
      >
        <el-row>
          <el-col class="game__typee" :xs="5" :sm="4">
            <span>
              {{ _label(game.type) }}
            </span>
          </el-col>

          <el-col :xs="19" :sm="20">
            <el-row>
              <el-col :xs="24" :span="12">
                <div class="red-zone-text">
                  <span style="color:black;padding-left:10px">{{
                    game.title
                  }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :span="12">
                <div class="red-zone-text">
                  <div
                    v-for="(value, key) in game.settings"
                    :key="key"
                    class="rd-down-text-right"
                  >
                    <el-button
                      :class="[`list-button-${game.type}`]"
                      style="text-transform: uppercase;"
                    >
                      <span>{{ key }}: +{{ value }}</span>
                    </el-button>
                    <span class="pending"
                      >[Risking: ${{ game.betting[key] }} | Pending]</span
                    >
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
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

    <el-dialog
      class="dialog_tip"
      center
      append-to-body
      title="Tip Waterboy"
      custom-class="dialog-tip-game"
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
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapState, mapGetters, mapMutations } from "vuex";
import GameItem from "./GameItem";
export default {
  data() {
    return {
      currentBet: [],
      tip_value: 1,
      dialog_tip: false,
      bettings: {},
      confirm_place_bet: false,
      idPlaceBet: 0,
      isLock: false,
      arrBet: [],
      settingBet: {},
      select: "",
      placeBet: false,
      show_guide: false,
    };
  },
  components: {
    GameItem,
  },
  computed: {
    ...mapState({
      balance: (state) => state.balance,
      options: (state) => state.living_betting.options,
      game_list: (state) => state.living_betting.game_list,
      user_id: (state) => state.user_id,
      game_selected: (state) => state.living_betting.game_selected,
      game_timeleft: (state) => state.living_betting.game_timeleft,
      game_list_place_bet: (state) => state.living_betting.game_list_place_bet,
      doneGame: (state) => state.living_betting.doneGame,
      id: (state) => state.living_betting.id,
      game_info: (state) => state.living_betting.game_info,
      currentID: (state) => state.living_betting.currentID,
      currentKey: (state) => state.living_betting.currentKey,
      guide_play: (state) => state.living_betting.guide_play,
    }),
    ...mapGetters({
      initBettings: "living_betting/initBettings",
      filterGamePending: "living_betting/filterGamePending",
    }),

    is_show_guide_box() {
      let hide_me = Cookies.get("dissmis_guide_box");

      return this.show_guide && !hide_me;
    },

    filterBettings() {
      return this.filterGamePending;
    },
    isPlaceBet() {
      let total = 0;
      for (const [key, value] of Object.entries(this.bettings)) {
        for (const [_key, _value] of Object.entries(value)) {
          total += _value;
        }
      }
      return total > 0 ? true : false;
    },
    valuePlaceBet() {
      let total = 0;
      delete this.bettings.id;
      for (const [key, value] of Object.entries(this.bettings)) {
        for (const [_key, _value] of Object.entries(value)) {
          total += _value;
        }
      }
      return total;
    },
    wp_theme_url() {
      return this.$store.state.WP_THEME_APP_URL;
    },
    current_game_type() {
      return this.game_selected?.type;
    },
    current_game_id() {
      return this.game_selected?.id;
    },
  },
  watch: {
    current_game_id(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== undefined) {
        this.resetBet();
      }
    },
    // doneGame(newVal, oldVal) {
    //   if (newVal != oldVal) {
    //     this.loadData();
    //   }
    // },
  },
  mounted() {
    this.show_guide = true;

    this.loadData();
    this.resetBet();
    const channel = this.$pusher.subscribe("living_betting");
    channel.bind("new_game", (data) => {
      this.game_list.push(data);
    });
    channel.bind(`game_result_${this.user_id}`, (data) => {
      this.$store.commit("living_betting/SET_ID", data);
      this.$store.commit("SET_BALANCE", parseFloat(data.user_points));
    });
  },
  methods: {
    nextGame() {
      this.$emit("back-guessing", true);
    },
    dont_show_me() {
      Cookies.set("dissmis_guide_box", true);
      this.show_guide = false;
    },

    selectCurrent(data, key) {
      this.currentBet = data;
      this.select = key;
    },
    _label(key) {
      let label = this.options[key].label;
      return label;
    },
    typeGame(value) {
      let label = this.options[value].label;
      return label;
    },
    loadData() {
      this.$store.dispatch("living_betting/loadData");
    },
    resetBet() {
      this.bettings = JSON.parse(JSON.stringify(this.initBettings));
    },
    updateCurrent() {
      this.currentBet = [];
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
    place_bet() {
      this.confirm_place_bet = false;
      let data = {
        lb_game_id: parseInt(this.currentID),
        betting: this.bettings[this.current_game_type],
      };
      if (!this.arrBet.includes(this.current_game_id)) {
        this.$store.dispatch("living_betting/placeBet", data).then((res) => {
          if (res.data.errors) {
            let returnValue = parseFloat(this.balance) + this.valuePlaceBet;
            this.$store.commit("SET_BALANCE", returnValue.toFixed(2));
            this.$message({
              message: res.data.message,
              type: "error",
            });
          } else {
            this.$store.commit("living_betting/SET_CURRENT_ID", null);
            let listBet = {
              id: res.data.game_lb_playing.id,
              betting: res.data.game_lb_playing.betting,
              type: res.data.lb_game.type,
              title: res.data.lb_game.title,
              settings: res.data.lb_game.settings,
            };
            this.$store.commit(
              "living_betting/SET_GAME_LIST_PLACE_BET",
              listBet
            );
            this.arrBet.push(this.current_game_id);
            // this.loadData();
            this.$message({
              message: "Your bet has been successfully placed.",
              type: "success",
            });
          }
        });
      } else {
        this.$message({
          message: "You already made a bet for this drive.",
          type: "error",
        });
        let returnValue = parseFloat(this.balance) + this.valuePlaceBet;
        this.$store.commit("SET_BALANCE", returnValue.toFixed(2));
        this.resetBet();
      }
      this.placeBet = true;
      this.currentBet = [];
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
          .dispatch("living_betting/sendTipDealer", this.tip_value)
          .then((res) => {
            this.$message({
              message: this.$t("MSG_TIP_DEALER_SUCCESS"),
              type: "success",
            });
            this.$store.commit("SET_BALANCE", parseFloat(res.data.user_points));
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
    deleteGame(id) {
      this.$store
        .dispatch("living_betting/deleteHistory", {
          lb_playing_id: id,
        })
        .then(() => {
          this.loadData();
        });
    },
    _addPoint(point) {
      this.placeBet = false;
      if (this.currentBet.length == 0) return;
      let cb = this.currentBet;
      if (this.bettings[cb[0]][cb[1]] + point <= this.game_info.max) {
        this.bettings[cb[0]][cb[1]] += point;
        let new_balance = parseFloat(this.balance) - point;
        this.$store.commit("SET_BALANCE", new_balance.toFixed(2));
      } else {
        console.log("max roi");
      }
    },
    clear_all() {
      this.currentBet = [];
      let returnValue = parseFloat(this.balance) + this.valuePlaceBet;
      this.$store.commit("SET_BALANCE", returnValue.toFixed(2));
      this.$store.commit("living_betting/SET_CURRENT_ID", 0);
      this.resetBet();
    },
  },
};
</script>
<style>
@import "./style.css";
.notifi h2 {
  color: white;
  text-transform: uppercase;
  font-size: 12.1px;
  line-height: 14px;
  padding: 0 20px;
}
.notifiAll h2 {
  color: white;
  margin: 0;
  text-transform: uppercase;
  font-size: 12.1px;
  padding: 0 20px;
}

.noGameGue {
  height: 500px;
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .notifi h2 {
    font-size: 10px;
    text-transform: uppercase;
  }
  .notifiAll h2 {
    color: white;
    margin: 0;
    font-size: 10px;
    text-transform: uppercase;
  }
  .game-guide-rules {
    height: 100% !important;
  }
}
</style>
