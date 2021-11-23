<template>

  <div class="game-wrapper-black-jack" >
    <WinEffect ref="winEffect" />
      
    <div
      style="color:black"
      v-if="dealerScore > 0"
      :class="{ 'over-score': dealerScore > 21 }"
      class="score-label1"
    >
      {{ dealerScore }}
    </div>

    <section  class="section-1">
      
      <div class="game-display">
        <div v-if="display_bg && dealer.length === 0" class="start-img">
          <div class="wrap-content">
            <div style="width:100%;text-align: center;">
              <img :src="imageUrl('blackjack_logo.png')" alt="" />
            </div>
            <h3>9xac blackjack rules & payouts:</h3>

            <div class="textBg" v-for="(item, index) in textBg" :key="index">
              <div :class="{ height_text: index > 2 }" class="textBg__stand">
                {{ item.stand }}
              </div>
              <div class="textBg__match">
                {{ item.match }}
              </div>
            </div>
            <p>please place your bet to start</p>
          </div>
        </div>
        <div class="please_play_game" v-if="please_play_game">
          <h3>please place your bet to continue....</h3>
        </div>

        <BankerCard ref="dealerCardRef" :cards="dealer" />
        <div v-if="checkBlackjack" class="insurance">
          <div class="wrap-insurance">
            <div class="content">
              insurance?
              <div v-if="confirmCheck && totalMoney > 0" class="total-money">
                {{ totalMoney }}
              </div>
            </div>
            <div
              v-if="!confirmCheck"
              @click="checkingBlackjack"
              class="btn-yes"
            >
              yes
            </div>
            <div @click="noInsur()" v-if="!confirmCheck" class="btn-no">
              no
            </div>
          </div>
        </div>

        <div v-if="evenMoney" class="insurance">
          <div class="wrap-insurance">
            <div class="content">even money?</div>
            <div @click="yes_event('even')" class="btn-yes">yes</div>
            <div @click="no_event('no_even')" class="btn-no">no</div>
          </div>
        </div>

        <div v-if="faceDown" class="insurance">
          <div class="wrap-insurance">
            <div class="content">face down?</div>
            <div @click="clickDouble('double', 'yes')" class="btn-yes">yes</div>
            <div @click="clickDouble('double')" class="btn-no">no</div>
            <div @click="clickDouble('double', 'cancel')" class="btn-cancel">
              cancel
            </div>
          </div>
        </div>

        <PlayerCard
          ref="playerCardRef"
          :cards="player"
          :score="playerScore"
          :splitCards="splitCards"
          :splitScore="splitScore"
        />

        <img
          style="z-index:100011111"
          class="result-img"
          v-if="resultPlay[0]"
          :src="imageUrl('win.png')"
          alt=""
        />
        <img
          style="z-index:1000111"
          class="result-img"
          v-if="resultPlay[1]"
          :src="imageUrl('lose.png')"
          alt=""
        />
        <img
          style="z-index:100011111"
          class="result-img"
          v-if="resultPlay[2]"
          :src="imageUrl('push.png')"
          alt=""
        />

        <div>
          <img
            style="z-index:1000 ;top:63%"
            class="result-img"
            v-if="resultSplit[0]"
            :src="imageUrl('win.png')"
            alt=""
          />
          <img
            style="z-index:1000 ;top:67%"
            class="result-img"
            v-if="resultSplit[1]"
            :src="imageUrl('lose.png')"
            alt=""
          />
          <img
            style="z-index:1000 ;top:67%"
            class="result-img"
            v-if="resultSplit[2]"
            :src="imageUrl('push.png')"
            alt=""
          />
        </div>
      </div>

      <div class="game-status">
        <div class="game-status-item">BALANCE: {{ balance | price }}</div>
        <div class="game-status-item">
          MAIN: {{ gamer_place_bet_data.main | price }}  
        </div>
  
        <div class="game-status-item">
          MATCH: {{ gamer_place_bet_data.match | price }}
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

        <div class="list-btn-main-match">
          <el-badge
            :value="gamer_place_bet_data.main | price"
            :hidden="gamer_place_bet_data.main === 0"
            class="item"
            type="success"
          >
            <button
              :style="{
                border:
                  current_bet === type_want_bet.main
                    ? '2px solid #eea347'
                    : null,
              }"
              class="btn-main-match"
              @click="_selectBet(type_want_bet.main)"
            >
              MAIN BET
            </button>
          </el-badge>
          <el-badge
            :value="gamer_place_bet_data.match | price"
            :hidden="gamer_place_bet_data.match === 0"
            class="item"
            type="success"
          >
            <button
              :disabled="is_placeBet"
              :style="{
                border:
                  current_bet === type_want_bet.match
                    ? '2px solid #eea347'
                    : null,
              }"
              class="btn-main-match"
              @click="_selectBet(type_want_bet.match)"
            >
              MATCH
            </button>
          </el-badge>
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

        <div class="list-porker">
          <el-button @click="_addPoint(1)" :disabled="levedbet" type="text"
            ><img
              class="pokerchip"
              :src="`${wp_theme_url}images/chip_1.png`"
              alt="#1"
          /></el-button>
          <el-button @click="_addPoint(5)" :disabled="levedbet" type="text"
            ><img
              class="pokerchip"
              :src="`${wp_theme_url}images/chip_5.png`"
              alt="#5"
          /></el-button>
          <el-button @click="_addPoint(25)" :disabled="levedbet" type="text"
            ><img
              class="pokerchip"
              :src="`${wp_theme_url}images/chip_25.png`"
              alt="#25"
          /></el-button>
          <el-button @click="_addPoint(100)" :disabled="levedbet" type="text">
            <img
              class="pokerchip"
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
                :disabled="is_placeBet || is_placeBet_lock"
                @click="confirm_place_bet = true"
                class="btn-main-match"
              >
                PLACE BET
              </button>
            </div>
          </PopConfirm>
          <el-button
            class="btn-main-match tip-btn"
            type="text"
            @click="dialog_tip = true"
            >TIP DEALER</el-button
          >
          <button :disabled="clear" @click="_clearAll" class="btn-main-match">
            CLEAR ALL
          </button>
        </div>

        <div class="game-info">
          <!-- <div class="game-info-item">GAME INFO:</div> -->
          <div v-if="parseSetting.main" class="game-info-item">
            MAIN: {{ parseSetting.main.min | price }}/{{
              parseSetting.main.max | price
            }}Max
          </div>
          <div class="game-info-item" v-if="parseSetting.match">
            MATCH: {{ parseSetting.match.min | price }}/{{
              parseSetting.match.max | price
            }}Max
          </div>
        </div>
        <div class="bottom-action">
          <div class="list-btn-bottom">
            <button
              :disabled="is_lock"
              @click="clickHit('hit')"
              class="btn-main-match"
            >
              HIT
            </button>
            <button
              :disabled="is_lock"
              @click="clickStand('stand')"
              class="btn-main-match"
            >
              STAND
            </button>
            <button
              :disabled="is_lock || double"
              @click="double_double"
              class="btn-main-match"
            >
              DOUBLE
            </button>
            <!--<button
              :disabled="is_lock || double"
              @click="clickDouble('double')" 
              class="btn-main-match"
            >
              DOUBLE
            </button> -->
            <button
              :disabled="is_lock || split"
              @click="clickSplit('split')"
              class="btn-main-match"
            >
              SPLIT
            </button>
            <el-popconfirm
              title="Surrender, Are you sure?"
              @confirm="clickSurrender('surrender')"
              cancel-button-text="Cancel"
              confirm-button-text="Ok"
            >
              <button
                :disabled="is_lock_sur"
                slot="reference"
                class="btn-main-match"
              >
                SURRENDER
              </button>
            </el-popconfirm>
          </div>
        </div>
      </section>
      <section class="child-section-2">
        <div class="action-list">
          <!-- <button @click="dialog_chat_visible = true" class="action-item">
            GROUP CHAT
          </button>
          <button class="action-item">
            <a style="color: #ffffff; text-decoration: none" href="https://9xac.com/" target="_blank">9XAC.COM</a>
          </button> -->
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
          :src="`${group_chat_url}?channel=black_jack`"
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

    <el-dialog
      v-if="result_match != null"
      class="none_header1"
      append-to-body
      :visible.sync="dialogVisible"
      custom-class="dialog-tip_win_lose1"
      :before-close="closeResult"
    >
      <div class="diaglog--win_lose1">
        <h3 v-if="this.result_match.match">
          You {{ this.result_match.match.type == "won" ? "won" : "lost" }}: ${{
            this.result_match.match.amount
          }}
          for your match bet
        </h3>
        <span slot="footer" class="dialog-footer1">
          <el-button class="close" @click="closeResult">Close</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sound from "./Sound";
import { mapState, mapGetters } from "vuex";
import PlayerCard from "./PlayerCard.vue";
import BankerCard from "./BankerCard.vue";
import WinEffect from "./WinEffect.vue";
import "@/assets/css/black_jack.css";
export default {
  data() {
    return {
      please_play_game: false,
      is_placeBet_lock: false,
      end___game: false,
      clear: false,
      scoreDoubleYes2: 0,
      scoreDoubleYes: 0,
      cardsDouble: [],
      cardsPlayer_1: [],
      cardsPlayer_2: [],
      hand_id: 0,
      totalMoney: 0,
      is_lock_sur: true,
      match_data_player: {},
      match_data_dealer: {},
      arrayCardDouble: [],
      action_ctrl: "",
      dialogVisible: false,
      game_match_id: null,
      display_bg: true,
      // <---- test data ---->
      lengthCardsDealer: 2,
      user_id: 1,
      dealer: [],
      player: [],
      dealerScore1: 0,
      levedbet: false,

      splitCards: [],
      splitScore: 0,
      place_double_stand: 0,
      result: false,
      playerScore: 0,
      dealerScore: 0,
      // [win, lose, push]
      resultPlay: [null, null, null],
      resultSplit: [null, null, null],

      bg_sound: null,
      muted: false,
      is_lock: true,
      split: true,
      double: false,
      cardsDouble2: [],
      checkBlackjack: false,
      confirmCheck: null,
      insurance: false,
      evenMoney: false,
      faceDown: false,
      flagSplit: false,
      // <---- test data ---->

      // <---- end test data ---->
      current_bet: "",
      black_jack_data: {
        main: 0,
        match: 0,
      },
      type_want_bet: {
        main: "main",
        match: "match",
      },
      textBg: [
        {
          stand: "dealer stand on all 17’s",
          match: "Match the dealer:",
        },
        {
          stand: "blackjack payout 2:1",
          match: "1 unsuited match: 4/1",
        },
        {
          stand: "insurance payout 2:1",
          match: "2 unsuited match: 8/1",
        },
        {
          stand:
            "Surrender will Forfeit half the bet and end the hand immediately.",
          match: "1 unsuited/ 1 suited: 14/1",
        },
        {
          stand:
            "you can not double down for less, must be of equal value only.",
          match: "1 suited match: 10/1",
        },
        {
          stand: "You are only allowed to split once.",
          match: "2 suited match: 30/1",
        },
      ],
      balance_bonus: 0,
      confirm_place_bet: false,
      confirm_out_game: false,
      dialog_chat_visible: false,
      dialog_tip: false,
      tip_value: 1,
    };
  },

  components: {
    PlayerCard,
    BankerCard,
    WinEffect,
  },

  computed: {
    ...mapState({
      group_chat_url: (state) => state.group_chat_url,
      balance: (state) => state.balance,
      gamer_place_bet_data: (state) => state.black_jack.gamer_place_bet_data,
      gamer_match: (state) => state.black_jack.gamer_match,
      game_info: (state) => state.black_jack.game_info,
      game_match_info: (state) => state.black_jack.game_match_info,
      game_playing_id: (state) => state.black_jack.game_playing_id,
      disable_bet: (state) => state.black_jack.disable_bet,
      game_active: (state) => state.black_jack.game_active,
      game_save: (state) => state.black_jack.game_save,
      result_match: (state) => state.black_jack.result_match,
      blance_match: (state) => state.black_jack.blance_match,
      game_match_id_save: (state) => state.black_jack.game_match_id,
    }),
    ...mapGetters({
      isLock: "black_jack/isLock",
      isClose: "black_jack/isClose",
    }),

    is_placeBet() {
      let total = 0;
      for (const [key, value] of Object.entries(this.black_jack_data)) {
        total += value;
      }
      return total <= 0 ? true : false;
    },
    parseSetting() {
      return this.game_info.config ? JSON.parse(this.game_info.config) : {};
    },
    getEmbedUrl() {
      return this.parseSetting.yt_link
        ? this.parseSetting.yt_link.split("?v=")[1]
        : "";
    },
    wp_theme_url() {
      return this.$store.state.WP_THEME_APP_URL;
    },
  },
  watch: {
    muted(newVal, oldVal) {
      if (newVal) {
        sound.mute();
      } else {
        sound.unmute();
      }
    },
    balance() {
      this.balance_bonus = this.balance;
    },
    disable_bet() {
      if (this.disable_bet) {
        this._clearAll();
      }
    },
    // game_active() {
    //   if (this.game_active && this.game_playing_id == 0) {
    //     this.returnLobby();
    //   }
    // },
  },

  mounted() {
    sound.bgSound();
    this.loadGameMatchData();
 
    const channel = this.$pusher.subscribe("game_match_update_channel");
    channel.bind("game_lock_update", (data) => {
      this.$store.commit("black_jack/SET_LOCK_GAME_MATCH", 1);
    });
  },

  methods: {
    imageUrl(img) {
      let url = `/blackjack/${img}`;
      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }
      return url;
    },

    closeResult() {
      this.dialogVisible = false;

      this.$store.commit("SET_BALANCE", parseFloat(this.blance_match));
    },

    mutedAudio() {
      this.muted = true;
    },

    unMutedAudio() {
      this.muted = false;
    },

    fileAudioStandAndDouble(dealer, player, callback) {
      // console.log("dealer", dealer);
      // console.log("player", player);
      let sound_list_arr = [];

      if (dealer.black_jack == true && player.black_jack == true) {
        sound_list_arr.push("dealer_blackjack");
        sound.result(sound_list_arr, function() {
          if (typeof callback === "function") callback();
        });

        return;
      }
      if (dealer.black_jack == true && player.black_jack == false) {
        sound_list_arr.push("dealer_blackjack");
        sound.result(sound_list_arr, function() {
          if (typeof callback === "function") callback();
        });

        return;
      }
      if (player.result_match.main.type == "won" && dealer.score < 21) {
        sound_list_arr.push(`dealer_${dealer.score}_win`);
      }
      if (player.result_match.main.type == "lost" && dealer.score < 21) {
        sound_list_arr.push(`dealer_${dealer.score}_lose`);
      }
      if (player.result_match.main.type == "lost" && dealer.score == 21) {
        sound_list_arr.push("dealer_21_lose");
      }

      if (player.result_match.main.type == "push") {
        sound_list_arr.push("push_hand");
      }
      if (dealer.score > 21) {
        sound_list_arr.push("dealer_bust");
      }
      if (player.score > 21) {
        sound_list_arr.push("user_bust");
      }

      sound.result(sound_list_arr, function() {
        if (typeof callback === "function") callback();
      });
    },

    fileAudioPlaceBet(dealer, player, callback) {
      let sound_list_arr = [];

      // if (dealer.black_jack == false && player.black_jack == true) {
      //   sound_list_arr.push("got_blackjack");
      // }
      if (dealer.score == 21) {
        sound_list_arr.push("dealer_blackjack");
      }
      if (player.score == 21) {
        sound_list_arr.push("got_blackjack");
      }

      sound.result(sound_list_arr, function() {
        if (typeof callback === "function") callback();
      });
    },

    fileAudioHit(player, callback) {
      let sound_list_arr = [];
      if (player > 21) {
        sound_list_arr.push("user_bust");
      }
      sound.result(sound_list_arr, function() {
        if (typeof callback === "function") callback();
      });
    },

    // fileAudioDouble(player, callback) {
    //   let sound_list_arr = [];
    //   if (dealer.black_jack == true && player.black_jack == false) {
    //     sound_list_arr.push("dealer_blackjack");
    //   }
    //   if (dealer.end_score > 21) {
    //     sound_list_arr.push("dealer_bust");
    //   }

    //   sound.result(sound_list_arr, function() {
    //     if (typeof callback === "function") callback();
    //   });
    // },

    loadGameMatchData() {
      this.$store
        .dispatch("black_jack/loadGameMatchData")
        .then((res) => {
          this.balance_bonus = this.balance;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    loadData() {
      this.$store
        .dispatch("black_jack/loadData", {
          action: "user_request_play_game",
          game_name: "black_jack",
        })
        .then((res) => {
          let _this = this;
          console.log("data", res.data);
          if (res.data.game_active) {
            this.levedbet = true;
            this.is_lock = false;

            if (res.data.game_active.match_data.dealer.cards.length == 1) {
              this.dealer = [
                ...res.data.game_active.match_data.dealer.cards,
                null,
              ];
            }
            if (res.data.game_active.match_data.player[0].cards.length > 2) {
              this.double = true;
            }
            if (res.data.game_active.match_data.can_split) {
              this.split = false;
            }
            if (res.data.game_active.match_data.player[0].can_even_money) {
              setTimeout(() => {
                _this.evenMoney = true;
                _this.$refs.playerCardRef.card_2_blackjack = true;
              }, 7000);

              this.is_lock = true;
            }
            this.player = res.data.game_active.match_data.player[0].cards;
            this.game_match_id = res.data.game_active.id;
            setTimeout(() => {
              _this.playerScore =
                res.data.game_active.match_data.player[0].score;
            }, 5000);
            if (res.data.game_active.match_data.player[0].can_insurance) {
              setTimeout(() => {
                _this.checkBlackjack = true;
              }, 7000);
              this.is_lock = true;
              this.is_lock_sur = false;
            }
            if (
              res.data.game_active.match_data.player.length == 2 &&
              res.data.game_active.match_data.can_split == false
            ) {
              let _this = this;
              _this.hand_id++;
              let temp = this.player.splice(1, 1);
              this.player = res.data.game_active.match_data.player[0].cards;
              this.splitCards.push(temp);
              this.splitScore = this.playerScore / 2;
              this.playerScore = this.splitScore;
              setTimeout(() => {
                _this.playerScore =
                  res.data.game_active.match_data.player[0].score;
              }, 2000);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    _selectBet(bet) {
      this.current_bet = bet;
    },
    _clearAll() {
      this.balance_bonus +=
        this.gamer_place_bet_data.main + this.gamer_place_bet_data.match;
      this.black_jack_data = { main: 0, match: 0 };
      this.$store.commit("black_jack/SET_PLAYING_BET", this.black_jack_data);
      this.$store.commit("SET_BALANCE", this.balance_bonus);
      this.current_bet = "";
      this.levedbet = false;
    },
    _resetGame() {
      (this.please_play_game = false),
        (this.cardsPlayer_1 = ""),
        (this.cardsPlayer_2 = ""),
        // this.dealer = [],
        // this.arrayCardDouble = [],
        (this.dealerScore1 = 0);
      (this.cardsDouble = []), (this.dealer = []);
      this.$refs.dealerCardRef.blackjack = false;
      this.player = [];
      this.result = false;
      this.resultPlay = [null, null, null];
      this.resultSplit = [null, null, null];
      this.playerScore = 0;
      this.dealerScore = 0;
      this.display_bg = false;
      this.splitCards = [];
      this.levedbet = true;
    },
    _addPoint(point) {
      sound.chipBet();
      if (this.balance >= point && this.current_bet == "main") {
        for (let i in this.black_jack_data) {
          if (
            this.current_bet === i &&
            this.parseSetting.main.max !== undefined
          ) {
            if (this.black_jack_data[i] + point > this.parseSetting.main.max) {
              // this.levedbet = true;
              return;
            } else {
              this.black_jack_data[i] += point;
              this.$store.commit(
                "black_jack/SET_PLAYING_BET",
                this.black_jack_data
              );
            }
          }
        }
        this.$store.commit("SET_BALANCE", (this.balance_bonus -= point));
      }
      if (this.balance >= point && this.current_bet == "match") {
        for (let i in this.black_jack_data) {
          if (
            this.current_bet === i &&
            this.parseSetting.match.max !== undefined
          ) {
            if (this.black_jack_data[i] + point > this.parseSetting.match.max) {
              // this.levedbet = true;
              return;
            } else {
              this.black_jack_data[i] += point;
              this.$store.commit(
                "black_jack/SET_PLAYING_BET",
                this.black_jack_data
              );
            }
          }
        }
        this.$store.commit("SET_BALANCE", (this.balance_bonus -= point));
      }
    },

    reset() {
      this.is_lock_sur = true;
      this.display_bg = false;
      let _this = this;
      this.is_placeBet_lock = false;
      (this.black_jack_data = {
        main: 0,
        match: 0,
      }),
        setTimeout(() => {
          (this.please_play_game = true),
            (_this.dealer = []),
            (_this.player = []);
          _this.splitCards = [];
        }, 2000),
        (this.splitScore = 0),
        (this.levedbet = false);
      this.current_bet = "";
      (this.clear = false),
        this.$store.commit("black_jack/SET_PLAYING_BET", { main: 0, match: 0 });
      this.is_lock = true;
      this.endGameAnimation();
      this.resultPlay = [null, null, null];
      this.resultSplit = [null, null, null];
      this.playerScore = 0;
      this.dealerScore = 0;
      // this.$message({
      //   message: "Please place your bets.",
      //   type: "info",
      // });
      // this.checkBlackjack = false;

      // this.insurance = false;
    },

    _onPlaceBet() {
      this.is_placeBet_lock = true;
      this.checkBlackjack = false;
      this.confirmCheck = false;
      this.lengthCardsDealer = 2;
      this.flagSplit = false;

      this.hand_id = 0;
      this.$refs.playerCardRef.restoreAll();
      this.$refs.dealerCardRef.restoreAll();
      this._resetGame();
      (this.splitCards = []), (this.player = []);
      this.dealer = [];
      this.evenMoney = false;
      let _this = this;
      this.confirm_place_bet = false;
      this.double = false;
      this.$store
        .dispatch("black_jack/bj_place_bet", {
          place_bet: this.black_jack_data,
        })
        .then((res) => {
          this.clear = true;

          if (res.data.errors == true) {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
            this.clear = false;
            this.is_placeBet_lock = false;
            this.levedbet = false;
            return;
          }

          if (res.data.next_is_last) {
            this.$message({
              message: "Next hand is the last hand of the shoe.",
              type: "info",
            });
          }
          this.levedbet = true;

          this.dealer = [res.data.game_match.match_data.dealer.cards[0], null];
          this.player = res.data.game_match.match_data.player[0].cards;

          this.game_match_id = res.data.game_match.game_match_id;

          this.confirm_place_bet = false;
          // this.$store.commit("SET_BALANCE", res.data.user_points);
          sound.dealingCards();
          setTimeout(() => {
            sound.dealingCards();
            setTimeout(() => {
              sound.dealingCards();
              setTimeout(() => {
                sound.dealingCards();
                _this.is_lock = false;
                _this.is_lock_sur = false;
                _this.playerScore =
                  res.data.game_match.match_data.player[0].score;
                if (_this.playerScore > 11) {
                  _this.double = true;
                }
                if (
                  res.data.game_match.match_data.player[0].cards[0][0] == "A" ||
                  res.data.game_match.match_data.player[0].cards[1][0] == "A"
                ) {
                  _this.double = false;
                }
                // if (res.data.game_match.match_data.player[1]) {
                //   if (res.data.game_match.match_data.player[1].score > 11) {
                //     _this.double = true;
                //   }
                // }

                let black_jack =
                  res.data.game_match.match_data.player[0].black_jack;
                if (res.data.game_match.match_data.player[0].result_match) {
                  if (
                    res.data.game_match.match_data.player[0].result_match
                      .match != null
                  ) {
                    setTimeout(() => {
                      _this.dialogVisible = true;
                    }, 2000);
                  }
                }
                if (res.data.game_match.match_data.can_split) {
                  _this.split = false;
                }
                if (res.data.game_match.match_data.player[0].can_insurance) {
                  _this.checkBlackjack = true;
                  _this.is_lock = true;
                }

                if (
                  res.data.end_game == true &&
                  res.data.game_match.match_data.dealer.black_jack &&
                  res.data.game_match.match_data.player[0].black_jack == false
                ) {
                  _this.is_lock = true;
                  setTimeout(() => {
                    _this.resultPlay[1] = true;
                    _this.$store.commit(
                      "SET_BALANCE",
                      parseFloat(res.data.user_points)
                    );
                    _this.fileAudioPlaceBet(
                      res.data.game_match.match_data.dealer,
                      res.data.game_match.match_data.player[0],
                      function() {
                        _this.reset();
                      }
                    );
                    _this.$refs.dealerCardRef.blackjack = true;
                  }, 2000);
                  setTimeout(() => {
                    _this.dealer = res.data.game_match.match_data.dealer.cards;
                  }, 1000);

                  return;
                }

                if (
                  res.data.end_game &&
                  res.data.game_match.match_data.player[0].black_jack
                ) {
                  if (
                    res.data.game_match.match_data.player[0].result_match.main
                      .type == "push"
                  ) {
                    this.is_lock = true
                  this.is_lock_sur = true
                    setTimeout(() => {
                      _this.$refs.dealerCardRef.blackjack = true;
                      _this.resultPlay[2] = true;
                    }, 4000);
                  }
                  
                  setTimeout(() => {
                    _this.dealer = res.data.game_match.match_data.dealer.cards;
                    if (res.data.game_match.match_data.dealer.score != 21)
                      setTimeout(() => {
                        _this.resultPlay[0] = true;
                      }, 2000);
                  }, 2000);

                  _this.$refs.playerCardRef.card_1_blackjack = true;
                }

                if (res.data.game_match.match_data.player[0].can_even_money) {
                  _this.is_lock = true;
                  _this.is_lock_sur = false;
                  _this.checkBlackjack = false;

                  _this.$refs.playerCardRef.card_1_blackjack = true;
                  _this.evenMoney = true;

                  _this.fileAudioPlaceBet(
                    res.data.game_match.match_data.dealer,
                    res.data.game_match.match_data.player[0]
                    // function() {
                    //   _this.reset();
                    // }
                  );
                }
                if (res.data.end_game) {
                  // (this.dealer = res.data.game_match.match_data.dealer.cards),
                  // _this.resultPlay[3] = true;
                  this.is_lock = true
                  this.is_lock_sur = true
                  setTimeout(() => {
                    _this.fileAudioPlaceBet(
                      res.data.game_match.match_data.dealer,
                      res.data.game_match.match_data.player[0],
                      function() {
                        _this.reset();
                      }
                    );
                    _this.$refs.playerCardRef.blackjack = true;
                    setTimeout(() => {
                      _this.$store.commit(
                        "SET_BALANCE",
                        parseFloat(res.data.user_points)
                      );
                    }, 2000);
                  }, 2000);
                }
              }, 2000);
            }, 2000);
          }, 2000);
        })
        .catch((error) => {
          this._clearAll();
          this.confirm_place_bet = false;
        });
    },

    _onTipDealer() {
      // this.tip_value = parseInt(this.tip_value)
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
          .dispatch("black_jack/sendTipDealer", this.tip_value)
          .then((res) => {
            this.$store.commit("SET_BALANCE", res.data.user_points);
            this.$message({
              message: this.$t("MSG_TIP_DEALER_SUCCESS"),
              type: "success",
              duration: 6000,
            });
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
        .dispatch("black_jack/openSeat")
        .then((res) => this.loadGameMatchData())
        .catch((error) => console.error(error));
    },

    returnLobby() {
      this.$store
        .dispatch("userQuitGame", this.game_playing_id)
        .then((res) => {
          this.$forceUpdate();
          sound.mute();
        })
        .catch((error) => {});
    },

    clickHit(hit) {
      this.split = true;
      this.is_lock = true;
      setTimeout(() => {
        this.is_lock = false;
      }, 2000);
      if (!this.hand_id) {
        let _this = this;
        this.double = true;
        sound.dealingCards();
        this.action_ctrl = hit;
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: this.action_ctrl,
          })
          .then((res) => {
            if (res.data.end_game && res.data.new_score > 21) {
              if (res.data.game_match.match_data.dealer.score == 21) {
                setTimeout(() => {
                  this.$refs.dealerCardRef.blackjack = true;
                }, 4000);
              }
              setTimeout(() => {
                this.dealer = res.data.game_match.match_data.dealer.cards;
              }, 2000);

              this.player = res.data.game_match.match_data.player[0].cards;
              setTimeout(() => {
                _this.resultPlay[1] = true;
                _this.playerScore =
                  res.data.game_match.match_data.player[0].score;
                _this.is_lock = true;

                this.fileAudioHit(
                  res.data.game_match.match_data.player[0].score,
                  function() {
                    _this.reset();
                  }
                );
              }, 2000);
              return;
            }
            if (res.data.end_game) {
              this.dealerScore1 = res.data.game_match.match_data.dealer.score;
              this.place_double_stand = res.data.user_points;
              this.match_data_player = res.data.game_match.match_data.player[0];
              this.match_data_dealer = res.data.game_match.match_data.dealer;
              this.arrayCardDouble =
                res.data.game_match.match_data.dealer.cards;
              setTimeout(() => {
                this.dealer = [
                  res.data.game_match.match_data.dealer.cards[0],
                  res.data.game_match.match_data.dealer.cards[1],
                ];

                this.pushDealerCards();
              }, 2000);
              // this.dealer = res.data.game_match.match_data.dealer.cards;
              this.player.push(res.data.new_card);
              setTimeout(() => {
                _this.playerScore =
                  res.data.game_match.match_data.player[0].score;
                _this.is_lock = true;
              }, 2000);
            }

            if (res.data.end_game == false) {
              this.player.push(res.data.new_card);
              setTimeout(() => {
                _this.playerScore = res.data.new_score;
              }, 2000);
            }
          });
        // this.$refs.winEffect.runWinEffect();
      } else {
        let _this = this;
        this.double = true;
        sound.dealingCards();
        this.action_ctrl = hit;
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: this.action_ctrl,
            hand_id: this.hand_id,
          })
          .then((res) => {
            if (this.hand_id == 1) {
              this.double = true;
              this.player.push(res.data.new_card);
              setTimeout(() => {
                _this.playerScore = res.data.new_score;
              }, 2000);
              // if (res.data.new_score >= 21) {
              //   setTimeout(() => {
              //     _this.evenMoney = true;
              //   }, 2000);
              // }
              if (res.data.game_match) {
                if (
                  res.data.game_match.match_data.player[0].cards[0][0] == "A" &&
                  res.data.game_match.match_data.player[1].cards[0][0] == "A"
                ) {
                  _this.double = false;
                  if (res.data.game_match.match_data.player[1].score > 11) {
                    this.double = true;
                  }
                    

                  if (res.data.game_match.match_data.player[1].can_insurance) {
                    _this.hand_id++;
                    setTimeout(() => {
                      _this.is_lock = true;
                      _this.splitCards =
                        res.data.game_match.match_data.player[1].cards;
                      setTimeout(() => {
                        _this.splitScore =
                          res.data.game_match.match_data.player[1].score;
                        _this.checkBlackjack = true;
                      }, 2000);
                      _this.$refs.playerCardRef.clickStand();
                    }, 2000);
                    return;
                  }
                  if (
                    res.data.game_match.match_data.player[1].can_insurance ==
                      false &&
                    res.data.game_match.match_data.player[1].black_jack &&
                    res.data.game_match.match_data.player[1].can_even_money ==
                      false
                  ) {
                    if (res.data.game_match.match_data.player[1].score > 11) {
                      _this.double = true;
                    }
                    _this.hand_id++;
                    setTimeout(() => {
                      _this.is_lock = true;
                      _this.splitCards =
                        res.data.game_match.match_data.player[1].cards;
                      setTimeout(() => {
                        _this.$refs.playerCardRef.card_1_blackjack = true;
                        _this.splitScore =
                          res.data.game_match.match_data.player[1].score;
                      }, 2000);
                      _this.$refs.playerCardRef.clickStand();
                      this.dealerScore1 =
                        res.data.game_match.match_data.dealer.score;
                      this.match_data_player =
                        res.data.game_match.match_data.player[0];
                      this.match_data_dealer =
                        res.data.game_match.match_data.dealer;
                      this.arrayCardDouble =
                        res.data.game_match.match_data.dealer.cards;
                      this.cardsPlayer_1 =
                        res.data.game_match.match_data.player[0].result_match.main.type;
                      this.cardsPlayer_2 =
                        res.data.game_match.match_data.player[1].result_match.main.type;
                      this.place_double_stand = parseFloat(
                        res.data.user_points
                      );

                      setTimeout(() => {
                        this.dealer = [
                          res.data.game_match.match_data.dealer.cards[0],
                          res.data.game_match.match_data.dealer.cards[1],
                        ];

                        this.pushDealerCards1();
                      }, 2000);
                    }, 2000);
                    return;
                  }
                  if (
                    res.data.game_match.match_data.player[1].can_insurance ==
                      false &&
                    res.data.game_match.match_data.player[1].black_jack ==
                      false &&
                    res.data.game_match.match_data.player[1].can_even_money ==
                      false
                  ) {
                    _this.hand_id++;
                    setTimeout(() => {
                      _this.$refs.playerCardRef.clickStand();
                      _this.splitCards =
                        res.data.game_match.match_data.player[1].cards;
                      setTimeout(() => {
                        _this.splitScore =
                          res.data.game_match.match_data.player[1].score;
                      }, 2000);
                    }, 2000);
                  }
                }
                if(res.data.game_match.match_data.player[1].cards[0][0] == "A" || res.data.game_match.match_data.player[1].cards[1][0] == "A"){
                      this.double = false
                    }
              }

              if (res.data.new_score >= 21) {
                _this.double = false;
                if (res.data.game_match.match_data.player[1].score > 11) {
                  this.double = true;
                }
                if(res.data.game_match.match_data.player[1].cards[0][0] == "A" || res.data.game_match.match_data.player[1].cards[1][0] == "A"){
                      this.double = false
                    }
                if (res.data.game_match.match_data.player[1].can_insurance) {
                  _this.hand_id++;
                  setTimeout(() => {
                    _this.is_lock = true;
                    _this.splitCards =
                      res.data.game_match.match_data.player[1].cards;
                    setTimeout(() => {
                      _this.splitScore =
                        res.data.game_match.match_data.player[1].score;
                      _this.checkBlackjack = true;
                    }, 2000);
                    _this.$refs.playerCardRef.clickStand();
                  }, 2000);
                }
                if (
                  res.data.game_match.match_data.player[1].can_insurance ==
                    false &&
                  res.data.game_match.match_data.player[1].black_jack &&
                  res.data.game_match.match_data.player[1].can_even_money ==
                    false
                ) {
                  if (res.data.game_match.match_data.player[1].score > 11) {
                    _this.double = true;
                  }
                  if(res.data.game_match.match_data.player[1].cards[0][0] == "A" || res.data.game_match.match_data.player[1].cards[1][0] == "A"){
                      this.double = false
                    }
                  _this.hand_id++;
                  setTimeout(() => {
                    _this.is_lock = true;
                    _this.splitCards =
                      res.data.game_match.match_data.player[1].cards;
                    setTimeout(() => {
                      _this.$refs.playerCardRef.card_1_blackjack = true;
                      _this.splitScore =
                        res.data.game_match.match_data.player[1].score;
                    }, 2000);
                    _this.$refs.playerCardRef.clickStand();
                    this.dealerScore1 =
                      res.data.game_match.match_data.dealer.score;
                    this.match_data_player =
                      res.data.game_match.match_data.player[0];
                    this.match_data_dealer =
                      res.data.game_match.match_data.dealer;
                    this.arrayCardDouble =
                      res.data.game_match.match_data.dealer.cards;
                    this.cardsPlayer_1 =
                      res.data.game_match.match_data.player[0].result_match.main.type;
                    this.cardsPlayer_2 =
                      res.data.game_match.match_data.player[1].result_match.main.type;
                    this.place_double_stand = parseFloat(res.data.user_points);

                    setTimeout(() => {
                      this.dealer = [
                        res.data.game_match.match_data.dealer.cards[0],
                        res.data.game_match.match_data.dealer.cards[1],
                      ];

                      this.pushDealerCards1();
                    }, 2000);
                  }, 2000);
                }
              }
            
            
            } else {
              this.splitCards.push(res.data.new_card);

              setTimeout(() => {
                _this.splitScore = res.data.new_score;
                if (res.data.game_match) {
                  if (
                    res.data.game_match.match_data.player[0].cards[0][0] ==
                      "A" &&
                    res.data.game_match.match_data.player[1].cards[0][0] == "A"
                  ) {
                    if (res.data.game_match.match_data.player[1].score > 11) {
                      _this.double = true;
                    }
                    this.dealerScore1 =
                      res.data.game_match.match_data.dealer.score;
                    this.match_data_player =
                      res.data.game_match.match_data.player[0];
                    this.match_data_dealer =
                      res.data.game_match.match_data.dealer;
                    this.arrayCardDouble =
                      res.data.game_match.match_data.dealer.cards;
                    this.cardsPlayer_1 =
                      res.data.game_match.match_data.player[0].result_match.main.type;
                    this.cardsPlayer_2 =
                      res.data.game_match.match_data.player[1].result_match.main.type;
                    this.place_double_stand = parseFloat(res.data.user_points);

                    setTimeout(() => {
                      this.dealer = [
                        res.data.game_match.match_data.dealer.cards[0],
                        res.data.game_match.match_data.dealer.cards[1],
                      ];

                      this.pushDealerCards1();
                    }, 2000);
                    this.is_lock = true;
                    return;
                  }
                }
                if (_this.splitScore >= 21) {
                  if (res.data.game_match.match_data.player[1].score > 11) {
                    _this.double = true;
                  }
                  this.dealerScore1 =
                    res.data.game_match.match_data.dealer.score;
                  this.match_data_player =
                    res.data.game_match.match_data.player[0];
                  this.match_data_dealer =
                    res.data.game_match.match_data.dealer;
                  this.arrayCardDouble =
                    res.data.game_match.match_data.dealer.cards;
                  this.cardsPlayer_1 =
                    res.data.game_match.match_data.player[0].result_match.main.type;
                  this.cardsPlayer_2 =
                    res.data.game_match.match_data.player[1].result_match.main.type;
                  this.place_double_stand = parseFloat(res.data.user_points);

                  setTimeout(() => {
                    this.dealer = [
                      res.data.game_match.match_data.dealer.cards[0],
                      res.data.game_match.match_data.dealer.cards[1],
                    ];

                    this.pushDealerCards1();
                  }, 2000);
                  this.is_lock = true;
                }
              }, 2000);
            }

            if (!res.data.end_game && res.data.new_score >= 21) {
              _this.hand_id++;
              if (res.data.game_match.match_data.player[1].black_jack) {
                setTimeout(() => {
                  _this.is_lock = true;
                  _this.evenMoney = true;
                  _this.$refs.playerCardRef.card_1_blackjack = true;
                }, 4000);
              } 
              setTimeout(() => {
                _this.$refs.playerCardRef.clickStand();
                _this.splitCards =
                  res.data.game_match.match_data.player[1].cards;
                setTimeout(() => {
                  _this.splitScore =
                    res.data.game_match.match_data.player[1].score;
                }, 2000);
              }, 2000);
            }
          });
      }
    },

    clickStand(stand) {
      if (!this.hand_id) {
        this.is_lock = true;
        this.is_lock_sur = true;
        let _this = this;
        this.action_ctrl = stand;
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: this.action_ctrl,
          })
          .then((res) => {
            this.dealerScore1 = res.data.game_match.match_data.dealer.score;
            this.place_double_stand = parseFloat(res.data.user_points);
            this.match_data_player = res.data.game_match.match_data.player[0];
            this.match_data_dealer = res.data.game_match.match_data.dealer;
            this.arrayCardDouble = res.data.game_match.match_data.dealer.cards;
            setTimeout(() => {
              this.dealer = [
                res.data.game_match.match_data.dealer.cards[0],
                res.data.game_match.match_data.dealer.cards[1],
              ];

              this.pushDealerCards();
            }, 2000);
          });
      } else {
        let _this = this;
        this.action_ctrl = stand;
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: this.action_ctrl,
            hand_id: this.hand_id,
          })
          .then((res) => {
            if (this.hand_id == 1) {
              if (res.data.game_match.match_data.player[1].score > 11) {
                this.double = true;
              }
              if(res.data.game_match.match_data.player[1].cards[0][0] == "A" || res.data.game_match.match_data.player[1].cards[1][0] == "A"){
                      this.double = false
                    }

              if (res.data.game_match.match_data.player[1].can_insurance) {
                _this.hand_id++;
                setTimeout(() => {
                  _this.is_lock = true;
                  _this.splitCards =
                    res.data.game_match.match_data.player[1].cards;
                  setTimeout(() => {
                    _this.splitScore =
                      res.data.game_match.match_data.player[1].score;
                    _this.checkBlackjack = true;
                  }, 2000);
                  _this.$refs.playerCardRef.clickStand();
                }, 2000);
                return;
              }
              if (
                res.data.game_match.match_data.player[1].can_insurance ==
                  false &&
                res.data.game_match.match_data.player[1].black_jack &&
                res.data.game_match.match_data.player[1].can_even_money == false
              ) {
                if (res.data.game_match.match_data.player[1].score > 11) {
                  _this.double = true;
                }
                if(res.data.game_match.match_data.player[1].cards[0][0] == "A" || res.data.game_match.match_data.player[1].cards[1][0] == "A"){
                      this.double = false
                    }
                _this.hand_id++;
                setTimeout(() => {
                  _this.is_lock = true;
                  _this.splitCards =
                    res.data.game_match.match_data.player[1].cards;
                  setTimeout(() => {
                    _this.$refs.playerCardRef.card_1_blackjack = true;
                    _this.splitScore =
                      res.data.game_match.match_data.player[1].score;
                  }, 2000);
                  _this.$refs.playerCardRef.clickStand();
                  this.dealerScore1 =
                    res.data.game_match.match_data.dealer.score;
                  this.match_data_player =
                    res.data.game_match.match_data.player[0];
                  this.match_data_dealer =
                    res.data.game_match.match_data.dealer;
                  this.arrayCardDouble =
                    res.data.game_match.match_data.dealer.cards;
                  this.cardsPlayer_1 =
                    res.data.game_match.match_data.player[0].result_match.main.type;
                  this.cardsPlayer_2 =
                    res.data.game_match.match_data.player[1].result_match.main.type;
                  this.place_double_stand = parseFloat(res.data.user_points);

                  setTimeout(() => {
                    this.dealer = [
                      res.data.game_match.match_data.dealer.cards[0],
                      res.data.game_match.match_data.dealer.cards[1],
                    ];

                    this.pushDealerCards1();
                  }, 2000);
                }, 2000);
                return;
              }
              _this.is_lock = true;
              setTimeout(() => {
                _this.is_lock = false;
                _this.double = false;
              }, 2000);
              if (!res.data.end_game) {
                if (res.data.game_match.match_data.player[1].black_jack) {
                  setTimeout(() => {
                    _this.is_lock = true;
                    _this.evenMoney = true;
                    _this.$refs.playerCardRef.card_1_blackjack = true;
                  }, 3000);
                }
                setTimeout(() => {
                  _this.$refs.playerCardRef.clickStand();
                  _this.splitCards =
                    res.data.game_match.match_data.player[1].cards;
                  setTimeout(() => {
                    _this.splitScore =
                      res.data.game_match.match_data.player[1].score;
                    if (_this.splitScore > 11) {
                      _this.double = true;
                    }
                    if(res.data.game_match.match_data.player[1].cards[0][0] == "A" || res.data.game_match.match_data.player[1].cards[1][0] == "A"){
                      _this.double = false
                     
                    }
                  }, 2000);
                }, 2000);
              }
              _this.hand_id++;
              _this.$refs.playerCardRef.clickStand();
              _this.splitCards = res.data.game_match.match_data.player[1].cards;

              setTimeout(() => {
                if (res.data.game_match.match_data.player[1].can_insurance) {
                  _this.checkBlackjack = true;
                }
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
              }, 2000);
           
            } else {
              this.is_lock = true;
              this.is_lock_sur = true;
              this.dealerScore1 = res.data.game_match.match_data.dealer.score;
              this.match_data_player = res.data.game_match.match_data.player[0];
              this.match_data_dealer = res.data.game_match.match_data.dealer;
              this.arrayCardDouble =
                res.data.game_match.match_data.dealer.cards;
              this.cardsPlayer_1 =
                res.data.game_match.match_data.player[0].result_match.main.type;
              this.cardsPlayer_2 =
                res.data.game_match.match_data.player[1].result_match.main.type;
              this.place_double_stand = parseFloat(res.data.user_points);
              setTimeout(() => {
                this.dealer = [
                  res.data.game_match.match_data.dealer.cards[0],
                  res.data.game_match.match_data.dealer.cards[1],
                ];

                this.pushDealerCards1();
              }, 2000);
            }
          });
      }
    },

    clickDouble(double, face_up) {
      if (!this.hand_id) {
        if (face_up == "cancel") {
          this.faceDown = false;
          this.is_lock = false;
          return;
        }
        if (face_up) {
          this.is_lock_sur = true
          this.$store.commit(
            "SET_BALANCE",
            parseFloat(this.balance - this.black_jack_data.main)
          );
          this.faceDown = false;
          sound.dealingCards();
          let _this = this;
          this.is_lock = true;
          this.action_ctrl = double;

          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: this.action_ctrl,
            })
            .then((res) => {
              _this.$refs.playerCardRef.double_down_2 = true;
              if (res.data.end_game) {
                this.player = [
                  res.data.game_match.match_data.player[0].cards[0],
                  res.data.game_match.match_data.player[0].cards[1],
                  null,
                ];
                this.scoreDoubleYes =
                  res.data.game_match.match_data.player[0].score;
                this.dealerScore1 = res.data.game_match.match_data.dealer.score;
                this.cardsDouble =
                  res.data.game_match.match_data.player[0].cards;
                this.match_data_player =
                  res.data.game_match.match_data.player[0];

                this.match_data_dealer = res.data.game_match.match_data.dealer;

                this.arrayCardDouble =
                  res.data.game_match.match_data.dealer.cards;
                this.place_double_stand = parseFloat(res.data.user_points);
                setTimeout(() => {
                  _this.dealer = [
                    res.data.game_match.match_data.dealer.cards[0],
                    res.data.game_match.match_data.dealer.cards[1],
                  ];
                  _this.pushDealerCards2();
                }, 2000);
                this.is_lock = true;
              }
            });
        } else {
          this.is_lock_sur = true
          this.$store.commit(
            "SET_BALANCE",
            parseFloat(this.balance - this.black_jack_data.main)
          );
          this.faceDown = false;
          sound.dealingCards();
          let _this = this;
          this.is_lock = true;
          this.action_ctrl = double;

          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: this.action_ctrl,
            })
            .then((res) => {
              if (res.data.end_game) {
                this.player = res.data.game_match.match_data.player[0].cards;
                this.dealerScore1 = res.data.game_match.match_data.dealer.score;
                //dd
                if (
                  res.data.game_match.match_data.player[0].result_match.main
                    .type == "bust"
                ) {
                  setTimeout(() => {
                    _this.dealer = res.data.game_match.match_data.dealer.cards;
                    _this.resultPlay[1] = true;
                    _this.fileAudioHit(
                      res.data.game_match.match_data.player[0].score,
                      function() {
                        _this.reset();
                      }
                    );
                    _this.$store.commit(
                      "SET_BALANCE",
                      parseFloat(res.data.user_points)
                    );
                  }, 2000);
                } else {
                  this.place_double_stand = parseFloat(res.data.user_points);
                  this.match_data_player =
                    res.data.game_match.match_data.player[0];
                  this.match_data_dealer =
                    res.data.game_match.match_data.dealer;
                  this.arrayCardDouble =
                    res.data.game_match.match_data.dealer.cards;
                  setTimeout(() => {
                    _this.dealer = [
                      res.data.game_match.match_data.dealer.cards[0],
                      res.data.game_match.match_data.dealer.cards[1],
                    ];

                    _this.pushDealerCards();
                  }, 2000);
                }
                //ss
                setTimeout(() => {
                  _this.playerScore =
                    res.data.game_match.match_data.player[0].score;

                  _this.is_lock = true;
                }, 2000);
              }
            });
        }
      } else {
        if (face_up == "cancel") {
          this.is_lock = false;
          this.faceDown = false;
          return;
        }
        
        if (face_up) {
          this.$store.commit(
            "SET_BALANCE",
            parseFloat(this.balance - this.black_jack_data.main)
          );
          this.faceDown = false;
          sound.dealingCards();
          let _this = this;
          this.is_lock = true;
          this.action_ctrl = double;

          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: this.action_ctrl,
              hand_id: this.hand_id,
            })
            .then((res) => {
              _this.$refs.playerCardRef.double_down_2 = true;
              if (this.hand_id == 1) {
                if (res.data.game_match.match_data.player[1].score > 11) {
                  this.double = true;
                }
                  if(res.data.game_match.match_data.player[1].cards[0][0] == "A" || res.data.game_match.match_data.player[1].cards[1][0] == "A"){
                   this.double = false   
                  }
                if (!res.data.end_game) {
                  if (res.data.game_match.match_data.player[1].black_jack) {
                    setTimeout(() => {
                      _this.is_lock = true;
                      _this.evenMoney = true;
                      _this.$refs.playerCardRef.card_1_blackjack = true;
                    }, 4000);
                  }
                  setTimeout(() => {
                    _this.$refs.playerCardRef.clickStand();
                    _this.splitCards =
                      res.data.game_match.match_data.player[1].cards;
                    setTimeout(() => {
                      _this.splitScore =
                        res.data.game_match.match_data.player[1].score;
                    }, 2000);
                  }, 2000);
                }
                this.flagSplit = true;
                setTimeout(() => {
                  _this.is_lock = false;
                }, 4000);
                _this.cardsDouble =
                  res.data.game_match.match_data.player[0].cards;
                setTimeout(() => {
                  _this.$refs.playerCardRef.clickStand();
                  _this.splitCards =
                    res.data.game_match.match_data.player[1].cards;

                  setTimeout(() => {
                    if (
                      res.data.game_match.match_data.player[1].can_insurance
                    ) {
                      _this.checkBlackjack = true;
                    }
                    this.scoreDoubleYes =
                      res.data.game_match.match_data.player[0].score;
                    _this.splitScore =
                      res.data.game_match.match_data.player[1].score;
                  }, 2000);
                }, 2000);
                this.hand_id++;
                this.player = [
                  res.data.game_match.match_data.player[0].cards[0],
                  res.data.game_match.match_data.player[0].cards[1],
                  null,
                ];
              } else {
                 this.is_lock_sur = true
                this.splitCards = [
                  res.data.game_match.match_data.player[1].cards[0],
                  res.data.game_match.match_data.player[1].cards[1],
                  null,
                ];
                _this.$refs.playerCardRef.double_down_1 = true;
                this.scoreDoubleYes2 =
                  res.data.game_match.match_data.player[1].score;
                this.scoreDoubleYes =
                  res.data.game_match.match_data.player[0].score;
                this.dealerScore1 = res.data.game_match.match_data.dealer.score;
                this.cardsDouble =
                  res.data.game_match.match_data.player[0].cards;
                this.cardsDouble2 =
                  res.data.game_match.match_data.player[1].cards;
                this.match_data_player =
                  res.data.game_match.match_data.player[1];
                this.cardsPlayer_1 =
                  res.data.game_match.match_data.player[0].result_match.main.type;
                this.cardsPlayer_2 =
                  res.data.game_match.match_data.player[1].result_match.main.type;

                this.match_data_dealer = res.data.game_match.match_data.dealer;

                this.arrayCardDouble =
                  res.data.game_match.match_data.dealer.cards;
                this.place_double_stand = parseFloat(res.data.user_points);
                setTimeout(() => {
                  _this.dealer = [
                    res.data.game_match.match_data.dealer.cards[0],
                    res.data.game_match.match_data.dealer.cards[1],
                  ];
                  this.pushDealerCards3();
                }, 2000);
                this.is_lock = true;
              }
            });
        } else {
          this.$store.commit(
            "SET_BALANCE",
            parseFloat(this.balance - this.black_jack_data.main)
          );
          this.is_lock = true;

          this.faceDown = false;
          sound.dealingCards();
          let _this = this;

          this.action_ctrl = double;

          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: this.action_ctrl,
              hand_id: this.hand_id,
            })
            .then((res) => {
              if (res.data.game_match.match_data.player[1].score > 11) {
                this.double = true;
              }
                if(res.data.game_match.match_data.player[1].cards[0][0] == "A" || res.data.game_match.match_data.player[1].cards[1][0] == "A"){
                  this.double = false
                      
              }
              if (this.hand_id == 1) {
                setTimeout(() => {
                  _this.is_lock = false;
                }, 4000);
                if (!res.data.end_game) {
                  if (res.data.game_match.match_data.player[1].black_jack) {
                    setTimeout(() => {
                      _this.is_lock = true;
                      _this.evenMoney = true;
                      _this.$refs.playerCardRef.card_1_blackjack = true;
                    }, 4000);
                  }
                  setTimeout(() => {
                    _this.$refs.playerCardRef.clickStand();
                    _this.splitCards =
                      res.data.game_match.match_data.player[1].cards;
                    setTimeout(() => {
                      _this.splitScore =
                        res.data.game_match.match_data.player[1].score;
                    }, 2000);
                  }, 2000);
                }
                this.hand_id++;
                _this.player = res.data.game_match.match_data.player[0].cards;

                setTimeout(() => {
                  setTimeout(() => {
                    if (
                      res.data.game_match.match_data.player[1].can_insurance
                    ) {
                      _this.checkBlackjack = true;
                    }
                    _this.splitScore =
                      res.data.game_match.match_data.player[1].score;
                  }, 2000);
                  _this.$refs.playerCardRef.clickStand();
                  _this.playerScore =
                    res.data.game_match.match_data.player[0].score;

                  _this.splitCards =
                    res.data.game_match.match_data.player[1].cards;
                }, 2000);
              } else {
                this.is_lock_sur = true
                this.is_lock = true;
                this.dealerScore1 = res.data.game_match.match_data.dealer.score;
                _this.splitCards =
                  res.data.game_match.match_data.player[1].cards;
                this.match_data_player =
                  res.data.game_match.match_data.player[0];
                this.match_data_dealer = res.data.game_match.match_data.dealer;
                this.arrayCardDouble =
                  res.data.game_match.match_data.dealer.cards;
                this.cardsPlayer_1 =
                  res.data.game_match.match_data.player[0].result_match.main.type;
                this.cardsPlayer_2 =
                  res.data.game_match.match_data.player[1].result_match.main.type;
                this.place_double_stand = parseFloat(res.data.user_points);

                setTimeout(() => {
                  _this.splitScore =
                    res.data.game_match.match_data.player[1].score;
                  this.dealer = [
                    res.data.game_match.match_data.dealer.cards[0],
                    res.data.game_match.match_data.dealer.cards[1],
                  ];

                  this.pushDealerCards1();
                }, 2000);
                this.is_lock = true;
              }
            });
        }
      }
    },
    pushDealerCards() {
      let _this = this;
      setTimeout(() => {
        if (this.arrayCardDouble.length == 2) {
          if (_this.match_data_dealer.score > 21) {
            _this.resultPlay[0] = true;
          }
          if (
            _this.match_data_dealer.score == 21 &&
            _this.match_data_player.score == 21
          ) {
            _this.resultPlay[1] = true;
          }
          if (
            _this.match_data_dealer.score == _this.match_data_player.score &&
            _this.match_data_dealer.score != 21
          ) {
            _this.resultPlay[2] = true;
          }
          if (_this.match_data_dealer.score == 21) {
            this.$refs.dealerCardRef.blackjack = true;

            _this.fileAudioStandAndDouble(
              _this.match_data_dealer,
              _this.match_data_player,
              function() {
                _this.reset();
              }
            );
          }
          if (_this.match_data_dealer.score == 21) {
            this.$refs.dealerCardRef.blackjack = true;
            _this.resultPlay[1] = true;
          }
          if (
            _this.match_data_dealer.score < 21 &&
            _this.match_data_dealer.score > _this.match_data_player.score
          ) {
            _this.resultPlay[1] = true;
          }
          if (
            _this.match_data_dealer.score < 21 &&
            _this.match_data_dealer.score < _this.match_data_player.score &&
            _this.match_data_player.score <= 21
          ) {
            _this.resultPlay[0] = true;
          }
          _this.dealerScore = _this.dealerScore1;
          _this.fileAudioStandAndDouble(
            _this.match_data_dealer,
            _this.match_data_player,
            function() {
              _this.reset();
            }
          );

          _this.dealerScore = _this.dealerScore1;
          _this.$store.commit("SET_BALANCE", _this.place_double_stand);
          return;
        }
        _this.dealer.push(_this.arrayCardDouble[_this.lengthCardsDealer]);
        sound.dealingCards();
        if (_this.dealer.length < _this.arrayCardDouble.length) {
          _this.lengthCardsDealer += 1;
          _this.pushDealerCards();
        } else {
          setTimeout(() => {
            if (_this.match_data_dealer.score > 21) {
              _this.resultPlay[0] = true;
            }
            if (
              _this.match_data_dealer.score < 21 &&
              _this.match_data_dealer.score > _this.match_data_player.score
            ) {
              _this.resultPlay[1] = true;
            }
            if (
              _this.match_data_dealer.score < 21 &&
              _this.match_data_dealer.score < _this.match_data_player.score
            ) {
              _this.resultPlay[0] = true;
            }
            if (_this.match_data_dealer.score == 21) {
              _this.resultPlay[1] = true;
            }

            if (
              _this.match_data_dealer.score == _this.match_data_player.score
            ) {
              _this.resultPlay[2] = true;
            }
            _this.dealerScore = _this.dealerScore1;
            _this.fileAudioStandAndDouble(
              _this.match_data_dealer,
              _this.match_data_player,
              function() {
                _this.reset();
              }
            );

            _this.$store.commit("SET_BALANCE", _this.place_double_stand);
          }, 2000);
        }
      }, 2000);
    },

    pushDealerCards2() {
      let _this = this;
      setTimeout(() => {
        if (this.arrayCardDouble.length == 2) {
          setTimeout(() => {
            if (_this.match_data_dealer.score > 21) {
              _this.resultPlay[0] = true;
            }
            if (
              _this.match_data_dealer.score == _this.match_data_player.score
            ) {
              _this.resultPlay[2] = true;
            }

            if (
              _this.match_data_dealer.score < 21 &&
              _this.match_data_dealer.score > _this.match_data_player.score
            ) {
              _this.resultPlay[1] = true;
            }
            if (_this.match_data_player.score > 21) {
              _this.resultPlay[1] = true;
            }
            if (
              _this.match_data_dealer.score < 21 &&
              _this.match_data_dealer.score < _this.match_data_player.score &&
              _this.match_data_player.score <= 21
            ) {
              _this.resultPlay[0] = true;
            }
          }, 1000);
          if (_this.hand_id == 2) {
            _this.splitCards = _this.cardsDouble;
          } else {
            _this.player = _this.cardsDouble;
          }

          _this.dealerScore = _this.dealerScore1;
          if (_this.dealerScore == 21) {
            this.$refs.dealerCardRef.blackjack = true;
          }
          setTimeout(() => {
            _this.playerScore = _this.scoreDoubleYes;
            _this.$store.commit("SET_BALANCE", _this.place_double_stand);
            _this.fileAudioStandAndDouble(
              _this.match_data_dealer,
              _this.match_data_player,
              function() {
                _this.reset();
              }
            );
          }, 2000);
          _this.dealerScore = _this.dealerScore1;
          _this.$store.commit("SET_BALANCE", _this.place_double_stand);
          return;
        }
        _this.dealer.push(_this.arrayCardDouble[_this.lengthCardsDealer]);
        sound.dealingCards();
        if (_this.dealer.length < _this.arrayCardDouble.length) {
          _this.lengthCardsDealer += 1;
          _this.pushDealerCards2();
             } else {
          setTimeout(() => {
            if (_this.match_data_dealer.score > 21) {
              setTimeout(() => {
                _this.resultPlay[0] = true;
              }, 1000);
            }
              if (_this.match_data_dealer.score == 21 ) {
              
              setTimeout(() => {
                _this.resultPlay[1] = true;
              }, 1000);
            }
            if (
              _this.match_data_dealer.score < 21 &&
              _this.match_data_dealer.score > _this.match_data_player.score
            ) {
              setTimeout(() => {
                _this.resultPlay[1] = true;
              }, 1000);
            }
            if (
              _this.match_data_dealer.score < 21 &&
              _this.match_data_dealer.score < _this.match_data_player.score
            ) {
              setTimeout(() => {
                _this.resultPlay[0] = true;
              }, 1000);
            }
            if (
              _this.match_data_dealer.score == _this.match_data_player.score
            ) {
              setTimeout(() => {
                _this.resultPlay[2] = true;
              }, 1000);
            }
            if (_this.hand_id == 2) {
              _this.splitCards = _this.cardsDouble;
            } else {
              _this.player = _this.cardsDouble;
            }
            _this.dealerScore = _this.dealerScore1;
            setTimeout(() => {
              _this.playerScore = _this.scoreDoubleYes;
              _this.fileAudioStandAndDouble(
                _this.match_data_dealer,
                _this.match_data_player,
                function() {
                  _this.reset();
                }
              );
              _this.$store.commit("SET_BALANCE", _this.place_double_stand);
            }, 2000);
          }, 2000);
        }
      }, 2000);
    },
    pushDealerCards3() {
      let _this = this;
      setTimeout(() => {
        if (this.arrayCardDouble.length == 2) {
          setTimeout(() => {
            if (_this.cardsPlayer_1 == "won") {
              _this.resultPlay[0] = true;
            }

            if (_this.cardsPlayer_1 == "bust") {
              _this.resultPlay[1] = true;
            }

            if (_this.cardsPlayer_1 == "lost") {
              _this.resultPlay[1] = true;
            }

            if (_this.cardsPlayer_1 == "push") {
              _this.resultPlay[2] = true;
            }

            if (_this.cardsPlayer_2 == "won") {
              _this.resultSplit[0] = true;
            }

            if (_this.cardsPlayer_2 == "bust") {
              _this.resultSplit[1] = true;
            }

            if (_this.cardsPlayer_2 == "lost") {
              _this.resultSplit[1] = true;
            }

            if (_this.cardsPlayer_2 == "push") {
              _this.resultSplit[2] = true;
            }
          }, 10);

          _this.dealerScore = _this.dealerScore1;
          if (_this.dealerScore == 21) {
            this.$refs.dealerCardRef.blackjack = true;
          }
          _this.player = _this.cardsDouble;

          _this.splitCards = _this.cardsDouble2;
          setTimeout(() => {
            _this.splitScore = _this.scoreDoubleYes2;
            _this.playerScore = _this.scoreDoubleYes;

            _this.$store.commit("SET_BALANCE", _this.place_double_stand);
          }, 2000);
          // then dealer open cards done and có 2 lá
          // _this.$store.commit("SET_BALANCE", _this.place_double_stand);
          setTimeout(() => {
            _this.reset();
          }, 3000);

          return;
        }
        _this.dealer.push(_this.arrayCardDouble[_this.lengthCardsDealer]);
        sound.dealingCards();
        if (_this.dealer.length < _this.arrayCardDouble.length) {
          _this.lengthCardsDealer += 1;
          _this.pushDealerCards3();
        } else {
          setTimeout(() => {
            setTimeout(() => {
              if (_this.cardsPlayer_1 == "won") {
                _this.resultPlay[0] = true;
              }
              if (_this.cardsPlayer_1 == "bust") {
                _this.resultPlay[1] = true;
              }
              if (_this.cardsPlayer_1 == "lost") {
                _this.resultPlay[1] = true;
              }
              if (_this.cardsPlayer_1 == "push") {
                _this.resultPlay[2] = true;
              }
              if (_this.cardsPlayer_2 == "won") {
                _this.resultSplit[0] = true;
              }
              if (_this.cardsPlayer_2 == "bust") {
                _this.resultSplit[1] = true;
              }
              if (_this.cardsPlayer_2 == "lost") {
                _this.resultSplit[1] = true;
              }
              if (_this.cardsPlayer_2 == "push") {
                _this.resultSplit[2] = true;
              }
            }, 2000);
            _this.dealerScore = _this.dealerScore1;
            _this.player = _this.cardsDouble;

            _this.splitCards = _this.cardsDouble2;
            setTimeout(() => {
              _this.splitScore = _this.scoreDoubleYes2;
              _this.playerScore = _this.scoreDoubleYes;

              _this.$store.commit("SET_BALANCE", _this.place_double_stand);
              setTimeout(() => {
                _this.reset();
              }, 2000);
            }, 2000);
          }, 2000);
        }
      }, 2000);
    },

    pushDealerCards4() {
      let _this = this;
      setTimeout(() => {
        if (this.arrayCardDouble.length == 2) {
          if (_this.cardsPlayer_1 == "won") {
            _this.resultPlay[0] = true;
          }

          if (_this.cardsPlayer_1 == "bust") {
            _this.resultPlay[1] = true;
          }

          if (_this.cardsPlayer_1 == "lost") {
            _this.resultPlay[1] = true;
          }

          if (_this.cardsPlayer_1 == "push") {
            _this.resultPlay[2] = true;
          }

          if (_this.cardsPlayer_2 == "won") {
            _this.resultSplit[0] = true;
          }

          if (_this.cardsPlayer_2 == "bust") {
            _this.resultSplit[1] = true;
          }

          if (_this.cardsPlayer_2 == "lost") {
            _this.resultSplit[1] = true;
          }

          if (_this.cardsPlayer_2 == "push") {
            _this.resultSplit[2] = true;
          }

          _this.dealerScore = _this.dealerScore1;
          if (_this.dealerScore == 21) {
            this.$refs.dealerCardRef.blackjack = true;
          }
          _this.player = _this.cardsDouble;

          _this.splitCards = _this.cardsDouble2;
          setTimeout(() => {
            _this.splitScore = _this.scoreDoubleYes2;
            _this.playerScore = _this.scoreDoubleYes;

            _this.$store.commit("SET_BALANCE", _this.place_double_stand);
          }, 2000);
          // then dealer open cards done and có 2 lá
          // _this.$store.commit("SET_BALANCE", _this.place_double_stand);
          setTimeout(() => {
            _this.reset();
          }, 2000);

          return;
        }
        _this.dealer.push(_this.arrayCardDouble[_this.lengthCardsDealer]);
        sound.dealingCards();
        if (_this.dealer.length < _this.arrayCardDouble.length) {
          _this.lengthCardsDealer += 1;
          _this.pushDealerCards4();
        } else {
          setTimeout(() => {
            setTimeout(() => {
              if (_this.cardsPlayer_1 == "won") {
                _this.resultPlay[0] = true;
              }
              if (_this.cardsPlayer_1 == "bust") {
                _this.resultPlay[1] = true;
              }
              if (_this.cardsPlayer_1 == "lost") {
                _this.resultPlay[1] = true;
              }
              if (_this.cardsPlayer_1 == "push") {
                _this.resultPlay[2] = true;
              }
              if (_this.cardsPlayer_2 == "won") {
                _this.resultSplit[0] = true;
              }
              if (_this.cardsPlayer_2 == "bust") {
                _this.resultSplit[1] = true;
              }
              if (_this.cardsPlayer_2 == "lost") {
                _this.resultSplit[1] = true;
              }
              if (_this.cardsPlayer_2 == "push") {
                _this.resultSplit[2] = true;
              }
            }, 2000);
            _this.dealerScore = _this.dealerScore1;
            _this.player = _this.cardsDouble;

            _this.splitCards = _this.cardsDouble2;
            setTimeout(() => {
              _this.splitScore = _this.scoreDoubleYes2;
              _this.playerScore = _this.scoreDoubleYes;

              _this.$store.commit("SET_BALANCE", _this.place_double_stand);
              setTimeout(() => {
                _this.reset();
              }, 2000);
            }, 2000);
          }, 2000);
        }
      }, 2000);
    },
    pushDealerCards1() {
      let _this = this;
      setTimeout(() => {
        if (this.arrayCardDouble.length == 2) {
          if (_this.cardsPlayer_2 == "won") {
            _this.resultSplit[0] = true;
          }
          if (_this.cardsPlayer_2 == "bust") {
            _this.resultSplit[1] = true;
          }
          if (_this.cardsPlayer_2 == "lost") {
            _this.resultSplit[1] = true;
          }
          if (_this.cardsPlayer_2 == "push") {
            _this.resultSplit[2] = true;
          }
          if (_this.flagSplit) {
            _this.player = _this.cardsDouble;
            setTimeout(() => {
              _this.playerScore = _this.scoreDoubleYes;

              if (_this.cardsPlayer_1 == "won") {
                _this.resultPlay[0] = true;
              }
              if (_this.cardsPlayer_1 == "bust") {
                _this.resultPlay[1] = true;
              }
              if (_this.cardsPlayer_1 == "push") {
                _this.resultPlay[2] = true;
              }
              if (_this.cardsPlayer_1 == "lost") {
                _this.resultPlay[1] = true;
              }
            }, 2000);
          } else {
            if (_this.cardsPlayer_1 == "won") {
              _this.resultPlay[0] = true;
            }
            if (_this.cardsPlayer_1 == "bust") {
              _this.resultPlay[1] = true;
            }
            if (_this.cardsPlayer_1 == "lost") {
              _this.resultPlay[1] = true;
            }
            if (_this.cardsPlayer_1 == "push") {
              _this.resultPlay[2] = true;
            }
          }
          _this.dealerScore = _this.dealerScore1;
          if (_this.dealerScore == 21) {
            this.$refs.dealerCardRef.blackjack = true;
          }

          // then dealer open cards done and có 2 lá
          _this.$store.commit("SET_BALANCE", _this.place_double_stand);
          setTimeout(() => {
            _this.reset();
          }, 3000);
          return;
        }
        _this.dealer.push(_this.arrayCardDouble[_this.lengthCardsDealer]);
        sound.dealingCards();
        if (_this.dealer.length < _this.arrayCardDouble.length) {
          _this.lengthCardsDealer += 1;
          _this.pushDealerCards1();
        } else {
          setTimeout(() => {
            if (_this.cardsPlayer_2 == "won") {
              _this.resultSplit[0] = true;
            }
            if (_this.cardsPlayer_2 == "bust") {
              _this.resultSplit[1] = true;
            }
            if (_this.cardsPlayer_2 == "lost") {
              _this.resultSplit[1] = true;
            }
            if (_this.cardsPlayer_2 == "push") {
              _this.resultSplit[2] = true;
            }
            if (_this.flagSplit) {
              _this.player = _this.cardsDouble;
              setTimeout(() => {
                _this.playerScore = _this.scoreDoubleYes;

                if (_this.cardsPlayer_1 == "won") {
                  _this.resultPlay[0] = true;
                }
                if (_this.cardsPlayer_1 == "bust") {
                  _this.resultPlay[1] = true;
                }
                if (_this.cardsPlayer_1 == "lost") {
                  _this.resultPlay[1] = true;
                }
                if (_this.cardsPlayer_1 == "push") {
                  _this.resultPlay[2] = true;
                }
              }, 2000);
            } else {
              if (_this.cardsPlayer_1 == "won") {
                _this.resultPlay[0] = true;
              }
              if (_this.cardsPlayer_1 == "bust") {
                _this.resultPlay[1] = true;
              }
              if (_this.cardsPlayer_1 == "lost") {
                _this.resultPlay[1] = true;
              }
              if (_this.cardsPlayer_1 == "push") {
                _this.resultPlay[2] = true;
              }
            }
            _this.dealerScore = _this.dealerScore1;

            _this.$store.commit("SET_BALANCE", _this.place_double_stand);

            setTimeout(() => {
              _this.reset();
            }, 3000);
          }, 2000);
        }
      }, 2000);
    },

    yes_event(event) {
      if (!this.hand_id) {
        this.evenMoney = false;
        let _this = this;
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: event,
          })
          .then((res) => {
            this.dealer = res.data.game_match.match_data.dealer.cards;
            setTimeout(() => {
              if (res.data.game_match.match_data.dealer.black_jack) {
                _this.$refs.dealerCardRef.blackjack = true;
                _this.$store.commit(
                  "SET_BALANCE",
                  parseFloat(res.data.user_points)
                );
                setTimeout(() => {
                  _this.reset();
                }, 2000);
              } else {
                _this.$store.commit(
                  "SET_BALANCE",
                  parseFloat(res.data.user_points)
                );
                _this.resultPlay[0] = true;
                setTimeout(() => {
                  _this.reset();
                }, 1000);
              }
            }, 2000);
            // this.fileAudioStandAndDouble(
            //   res.data.game_match.match_data.dealer,
            //   res.data.game_match.match_data.player[0],
            //   function() {
            //     this.reset();
            //   }
            // );
            // }
          });
      } else {
        if (this.hand_id == 1) {
          this.evenMoney = false;
          this.is_lock = false;
          let _this = this;
          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: event,
              hand_id: _this.hand_id,
            })
            .then((res) => {
              // this.dealer = res.data.game_match.match_data.dealer.cards;
              _this.hand_id++;
              _this.$refs.playerCardRef.clickStand();
              _this.splitCards.push(
                res.data.game_match.match_data.player[1].cards[1]
              );
              if (res.data.game_match.match_data.player[1].black_jack) {
                setTimeout(() => {
                  _this.evenMoney = true;
                  this.is_lock = true;
                  _this.$refs.playerCardRef.card_1_blackjack = true;
                }, 2000);
              }
              setTimeout(() => {
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
              }, 2000);
            });
        } else {
          this.evenMoney = false;
          this.is_lock = true;
          let _this = this;
          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: event,
              hand_id: _this.hand_id,
            })
            .then((res) => {
              this.scoreDoubleYes2 =
                res.data.game_match.match_data.player[1].score;
              this.scoreDoubleYes =
                res.data.game_match.match_data.player[0].score;
              this.dealerScore1 = res.data.game_match.match_data.dealer.score;
              this.cardsDouble = res.data.game_match.match_data.player[0].cards;
              this.cardsDouble2 =
                res.data.game_match.match_data.player[1].cards;
              this.match_data_player = res.data.game_match.match_data.player[1];
              this.cardsPlayer_1 =
                res.data.game_match.match_data.player[0].result_match.main.type;
              this.cardsPlayer_2 =
                res.data.game_match.match_data.player[1].result_match.main.type;

              this.match_data_dealer = res.data.game_match.match_data.dealer;

              this.arrayCardDouble =
                res.data.game_match.match_data.dealer.cards;
              this.place_double_stand = parseFloat(res.data.user_points);
              setTimeout(() => {
                _this.dealer = [
                  res.data.game_match.match_data.dealer.cards[0],
                  res.data.game_match.match_data.dealer.cards[1],
                ];
                _this.pushDealerCards3();
              }, 2000);
            });
        }
      }
    },

    no_event(event) {
      this.evenMoney = false;
      if (!this.hand_id) {
        let _this = this;
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: event,
          })
          .then((res) => {
            this.dealer = res.data.game_match.match_data.dealer.cards;
            setTimeout(() => {
              if (res.data.game_match.match_data.dealer.black_jack) {
                _this.$refs.dealerCardRef.blackjack = true;

                _this.$store.commit(
                  "SET_BALANCE",
                  parseFloat(res.data.user_points)
                );
                _this.resultPlay[2] = true;
                setTimeout(() => {
                  _this.reset();
                }, 2000);
              } else {
                this.$store.commit(
                  "SET_BALANCE",
                  parseFloat(res.data.user_points)
                );
                _this.resultPlay[0] = true;
                setTimeout(() => {
                  _this.reset();
                }, 2000);
              }
            }, 2000);
          });
      } else {
        if (this.hand_id == 1) {
          this.evenMoney = false;
          this.is_lock = false;
          let _this = this;
          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: event,
              hand_id: _this.hand_id,
            })
            .then((res) => {
              // this.dealer = res.data.game_match.match_data.dealer.cards;
              _this.hand_id++;
              _this.$refs.playerCardRef.clickStand();
              _this.splitCards.push(
                res.data.game_match.match_data.player[1].cards[1]
              );
              if (res.data.game_match.match_data.player[1].black_jack) {
                setTimeout(() => {
                  _this.evenMoney = true;
                  this.is_lock = true;
                  _this.$refs.playerCardRef.card_1_blackjack = true;
                }, 2000);
              }
              setTimeout(() => {
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
              }, 2000);
              // setTimeout(() => {
              //   if (res.data.game_match.match_data.dealer.black_jack) {
              //     _this.$refs.dealerCardRef.blackjack = true;
              //     _this.$store.commit(
              //       "SET_BALANCE",
              //       parseFloat(res.data.user_points)
              //     );
              //   } else {
              //     _this.$store.commit(
              //       "SET_BALANCE",
              //       parseFloat(res.data.user_points)
              //     );
              //   }
              // }, 2000);
            });
        } else {
          this.evenMoney = false;
          this.is_lock = true;
          let _this = this;
          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: event,
              hand_id: _this.hand_id,
            })
            .then((res) => {
              this.scoreDoubleYes2 =
                res.data.game_match.match_data.player[1].score;
              this.scoreDoubleYes =
                res.data.game_match.match_data.player[0].score;
              this.dealerScore1 = res.data.game_match.match_data.dealer.score;
              this.cardsDouble = res.data.game_match.match_data.player[0].cards;
              this.cardsDouble2 =
                res.data.game_match.match_data.player[1].cards;
              this.match_data_player = res.data.game_match.match_data.player[1];
              this.cardsPlayer_1 =
                res.data.game_match.match_data.player[0].result_match.main.type;
              this.cardsPlayer_2 =
                res.data.game_match.match_data.player[1].result_match.main.type;

              this.match_data_dealer = res.data.game_match.match_data.dealer;

              this.arrayCardDouble =
                res.data.game_match.match_data.dealer.cards;
              this.place_double_stand = parseFloat(res.data.user_points);
              setTimeout(() => {
                _this.dealer = [
                  res.data.game_match.match_data.dealer.cards[0],
                  res.data.game_match.match_data.dealer.cards[1],
                ];
                _this.pushDealerCards4();
              }, 2000);
            });
        }
      }
    },

    clickSurrender(surrender) {
      this.action_ctrl = surrender;
      if (!this.hand_id) {
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: this.action_ctrl,
          })
          .then((res) => {
            this.resultPlay[1] = true;

            this.$store.commit("SET_BALANCE", parseFloat(res.data.user_points));
            this.reset();
          });
      } else {
        let _this = this;
        if (this.hand_id == 1) {
          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: this.action_ctrl,
              hand_id: this.hand_id,
            })
            .then((res) => {
              this.hand_id++;
              this.$refs.playerCardRef.clickStand();
              this.resultPlay[1] = true;
              _this.splitCards = res.data.game_match.match_data.player[1].cards;

              setTimeout(() => {
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
              }, 2000);
            });
        } else {
          this.$store
            .dispatch("black_jack/bj_control", {
              game_match_id: this.game_match_id,
              action_ctrl: this.action_ctrl,
              hand_id: this.hand_id,
            })
            .then((res) => {
              this.$store.commit(
                "SET_BALANCE",
                parseFloat(res.data.user_points)
              );
              if (res.data.game_match == null) {
                this.resultSplit[1] = true;
                this.reset();
                return;
              }
              _this.splitCards = res.data.game_match.match_data.player[1].cards;
              this.match_data_player = res.data.game_match.match_data.player[0];
              this.match_data_dealer = res.data.game_match.match_data.dealer;
              this.arrayCardDouble =
                res.data.game_match.match_data.dealer.cards;
              this.cardsPlayer_1 =
                res.data.game_match.match_data.player[0].result_match.main.type;
              this.cardsPlayer_2 =
                res.data.game_match.match_data.player[1].result_match.main.type;
              this.place_double_stand = parseFloat(res.data.user_points);
              this.resultSplit[1] = true;

              setTimeout(() => {
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
                this.dealer = [
                  res.data.game_match.match_data.dealer.cards[0],
                  res.data.game_match.match_data.dealer.cards[1],
                ];

                this.pushDealerCards1();
              }, 2000);
            });
        }
      }
    },
    noInsur() {
      if (!this.hand_id) {
        let _this = this;
        this.checkBlackjack = false;
        this.is_lock = false;
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: "no_insurance",
          })
          .then((res) => {
            let _this = this;
            if (res.data.end_game) {
              _this.is_lock = true;

              setTimeout(() => {
                this.$store.commit(
                  "SET_BALANCE",
                  parseFloat(res.data.user_points)
                );
                this.$refs.dealerCardRef.blackjack = true;
                _this.youLost();
                _this.fileAudioStandAndDouble(
                  res.data.game_match.match_data.dealer,
                  res.data.game_match.match_data.player[0],
                  function() {
                    _this.reset();
                  }
                );
              }, 2000);

              this.dealer = res.data.game_match.match_data.dealer.cards;
              // this.$message({
              //   message: "Dealer doesn't have BlackJack",
              //   type: "info",
              // });
            } else {
              _this.$refs.dealerCardRef.noBlackjack = true;
              
            }
          });
      } else {
      }
    },
    double_double() {
      this.faceDown = true;
      this.is_lock = true;
    },

    checkingBlackjack() {
      if (!this.hand_id) {
        this.split = true;
        let _this = this;
        this.confirmCheck = true;
        this.$refs.dealerCardRef.checkBlackjack = true;
        this.$store
          .dispatch("black_jack/bj_control", {
            game_match_id: this.game_match_id,
            action_ctrl: "insurance",
          })
          .then((res) => {
            setTimeout(() => {
              _this.checkBlackjack = false;
            }, 2000);
            this.totalMoney = res.data.points_insurance;
            if (res.data.win_insurance == true) {
              _this.is_lock = true;
              setTimeout(() => {
                this.$store.commit(
                  "SET_BALANCE",
                  parseFloat(res.data.user_points)
                );
                this.$refs.dealerCardRef.blackjack = true;
                _this.resultPlay[1] = true;
                _this.fileAudioStandAndDouble(
                  res.data.game_match.match_data.dealer,
                  res.data.game_match.match_data.player[0],
                  function() {
                    _this.reset();
                  }
                );
              }, 2000);

              this.dealer = res.data.game_match.match_data.dealer.cards;
            }
            if (res.data.end_game == false) {
              this.$refs.dealerCardRef.checkBlackjack = false;
              this.place_double_stand = parseFloat(res.data.user_points);
              this.split = false
              setTimeout(() => {
                _this.is_lock = false;
                _this.$refs.dealerCardRef.noBlackjack = true;
                
                this.$store.commit(
                  "SET_BALANCE",
                  parseFloat(res.data.user_points)
                );
              }, 1000);
            }
          
          });
      } else {
        if (this.hand_id == 1) {
          // let _this = this;
          // this.confirmCheck = true;
          // this.$refs.dealerCardRef.checkBlackjack = true;
          // this.$store
          //   .dispatch("black_jack/bj_control", {
          //     game_match_id: this.game_match_id,
          //     action_ctrl: "insurance",
          //     hand_id: this.hand_id,
          //   })
          //   .then((res) => {
          //     _this.hand_id++;
          //     this.totalMoney = res.data.points_insurance;
          // setTimeout(() => {
          //   _this.$refs.playerCardRef.clickStand();
          //   _this.splitCards =
          //     res.data.game_match.match_data.player[1].cards;
          //   setTimeout(() => {
          //     _this.checkBlackjack = true;
          //     _this.splitScore =
          //       res.data.game_match.match_data.player[1].score;
          //     _this.confirmCheck = false;
          //   }, 2000);
          // }, 2000);
          // });
        } else {
          // let _this = this;
          // _this.checkBlackjack = false;
          // this.$store
          //   .dispatch("black_jack/bj_control", {
          //     game_match_id: this.game_match_id,
          //     action_ctrl: "insurance",
          //     hand_id: this.hand_id,
          //   })
          //   .then((res) => {
          //     this.totalMoney = res.data.points_insurance;
          //     this.scoreDoubleYes2 =
          //       res.data.game_match.match_data.player[1].score;
          //     this.scoreDoubleYes =
          //       res.data.game_match.match_data.player[0].score;
          //     this.dealerScore1 = res.data.game_match.match_data.dealer.score;
          //     this.cardsDouble = res.data.game_match.match_data.player[0].cards;
          //     this.cardsDouble2 =
          //       res.data.game_match.match_data.player[1].cards;
          //     this.match_data_player = res.data.game_match.match_data.player[1];
          //     this.cardsPlayer_1 =
          //       res.data.game_match.match_data.player[0].result_match.main.type;
          //     this.cardsPlayer_2 =
          //       res.data.game_match.match_data.player[1].result_match.main.type;
          //     this.match_data_dealer = res.data.game_match.match_data.dealer;
          //     this.arrayCardDouble =
          //       res.data.game_match.match_data.dealer.cards;
          //     this.place_double_stand = parseFloat(res.data.user_points);
          //     setTimeout(() => {
          //       _this.dealer = [
          //         res.data.game_match.match_data.dealer.cards[0],
          //         res.data.game_match.match_data.dealer.cards[1],
          //       ];
          //       this.pushDealerCards3();
          //     }, 2000);
          //   });
        }
      }
    },

    clickSplit(split) {
      let _this = this;
      this.action_ctrl = split;
      _this.is_lock = true;
      setTimeout(() => {
        _this.is_lock = false;
      }, 2000);
      this.$store
        .dispatch("black_jack/bj_control", {
          game_match_id: this.game_match_id,
          action_ctrl: this.action_ctrl,
        })
        .then((res) => {
          this.split = true;
          if (res.data.game_match.match_data.player[0].score <= 11) { 
            this.double = false;
          }else{
            this.double = true;
          }
          if(res.data.game_match.match_data.player[0].cards[0][0] == 'A' || res.data.game_match.match_data.player[0].cards[1][0] == 'A' ){
            this.double = false
          }
          if (res.data.errors) {
            _this.$message({
              message: res.data.message,
              type: "warning",
            });
          } else {
            if(res.data.end_game == false){
              this.$store.commit("SET_BALANCE", parseFloat(res.data.user_points));
            }

            if (res.data.game_match.match_data.player[0].cards[0][0] == "A") {
              _this.hand_id++;
              let temp = this.player.splice(1, 1);
              this.player = res.data.game_match.match_data.player[0].cards;
              this.splitCards.push(temp);
              this.splitScore = 11;
              this.playerScore = 11;

              this.double = true;

              setTimeout(() => {
                _this.playerScore =
                  res.data.game_match.match_data.player[0].score;
              }, 2000);
            } else {
              _this.hand_id++;
              let temp = this.player.splice(1, 1);
              this.player = res.data.game_match.match_data.player[0].cards;
              this.splitCards.push(temp);
              this.splitScore = this.playerScore / 2;

              this.playerScore = this.splitScore;

              setTimeout(() => {
                _this.playerScore =
                  res.data.game_match.match_data.player[0].score;
              }, 2000);
            }
          }
          if(res.data.game_match.match_data.player[0].cards[0][0] == 'A' && res.data.game_match.match_data.player[1].cards[0][0] == 'A'
          && res.data.game_match.match_data.player[0].black_jack == false  && res.data.game_match.match_data.player[1].black_jack == false
          ){
            this.is_lock = true
            this.is_lock_sur = true
            let totalSplit = this.balance - parseFloat(this.black_jack_data.main)
            this.$store.commit("SET_BALANCE", parseFloat(totalSplit));
            setTimeout(() => {
              _this.is_lock = true;
              _this.splitCards =
                res.data.game_match.match_data.player[1].cards;
              setTimeout(() => {
                // _this.$refs.playerCardRef.card_1_blackjack = true;
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
              }, 2000);
              _this.$refs.playerCardRef.clickStand();
              this.dealerScore1 =
                res.data.game_match.match_data.dealer.score;
              this.match_data_player =
                res.data.game_match.match_data.player[0];
              this.match_data_dealer =
                res.data.game_match.match_data.dealer;
              this.arrayCardDouble =
                res.data.game_match.match_data.dealer.cards;
              this.cardsPlayer_1 =
                res.data.game_match.match_data.player[0].result_match.main.type;
              this.cardsPlayer_2 =
                res.data.game_match.match_data.player[1].result_match.main.type;
              this.place_double_stand = parseFloat(
                res.data.user_points
              );

              setTimeout(() => {
                this.dealer = [
                  res.data.game_match.match_data.dealer.cards[0],
                  res.data.game_match.match_data.dealer.cards[1],
                ];

                this.pushDealerCards1();
              }, 2000);
            }, 2000);
            return
          }
           if (
             res.data.game_match.match_data.player[0].cards[0][0] == 'A' && res.data.game_match.match_data.player[1].cards[0][0] == 'A'&&
            res.data.game_match.match_data.player[0].black_jack &&
            res.data.game_match.match_data.player[1].black_jack == false &&
            res.data.game_match.match_data.player[0].can_even_money == false
          ){
            this.is_lock = true
            this.is_lock_sur = true
            let totalSplit = this.balance - parseFloat(this.black_jack_data.main)
            this.$store.commit("SET_BALANCE", parseFloat(totalSplit));
                setTimeout(() => {
         
                this.is_lock_sur = true
                this.is_lock = true;
                this.dealerScore1 = res.data.game_match.match_data.dealer.score;
                _this.splitCards =
                  res.data.game_match.match_data.player[1].cards;
                this.match_data_player =
                  res.data.game_match.match_data.player[0];
                this.match_data_dealer = res.data.game_match.match_data.dealer;
                this.arrayCardDouble =
                  res.data.game_match.match_data.dealer.cards;
                this.cardsPlayer_1 =
                  res.data.game_match.match_data.player[0].result_match.main.type;
                this.cardsPlayer_2 =
                  res.data.game_match.match_data.player[1].result_match.main.type;
                this.place_double_stand = parseFloat(res.data.user_points);

              setTimeout(() => {
                _this.fileAudioPlaceBet(
                  [],
                  res.data.game_match.match_data.player[0]
                );
                _this.fileAudioPlaceBet(
                  [],
                  res.data.game_match.match_data.player[1]
                );
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
                // _this.$refs.playerCardRef.card_1_blackjack = true;
              }, 2000);
              // _this.evenMoney = true;
              _this.$refs.playerCardRef.clickStand();

                   setTimeout(() => {
                  _this.splitScore =
                    res.data.game_match.match_data.player[1].score;
                  this.dealer = [
                    res.data.game_match.match_data.dealer.cards[0],
                    res.data.game_match.match_data.dealer.cards[1],
                  ];

                  this.pushDealerCards1();
                }, 2000);

              // _this.hand_id = 2;
              // _this.is_lock = false;

              _this.$refs.playerCardRef.card_2_blackjack = true;
            }, 2000);
            return

          }

              if (
                res.data.game_match.match_data.player[0].cards[0][0] == 'A' && res.data.game_match.match_data.player[1].cards[0][0] == 'A'&&
            res.data.game_match.match_data.player[0].black_jack == false &&
            res.data.game_match.match_data.player[1].black_jack &&
            res.data.game_match.match_data.player[0].can_even_money == false
          ){
             this.is_lock = true
            this.is_lock_sur = true
            let totalSplit = this.balance - parseFloat(this.black_jack_data.main)
            this.$store.commit("SET_BALANCE", parseFloat(totalSplit));
                setTimeout(() => {
         
                this.is_lock_sur = true
                this.is_lock = true;
                this.dealerScore1 = res.data.game_match.match_data.dealer.score;
                _this.splitCards =
                  res.data.game_match.match_data.player[1].cards;
                this.match_data_player =
                  res.data.game_match.match_data.player[0];
                this.match_data_dealer = res.data.game_match.match_data.dealer;
                this.arrayCardDouble =
                  res.data.game_match.match_data.dealer.cards;
                this.cardsPlayer_1 =
                  res.data.game_match.match_data.player[0].result_match.main.type;
                this.cardsPlayer_2 =
                  res.data.game_match.match_data.player[1].result_match.main.type;
                this.place_double_stand = parseFloat(res.data.user_points);

              setTimeout(() => {
                _this.fileAudioPlaceBet(
                  [],
                  res.data.game_match.match_data.player[0]
                );
                _this.fileAudioPlaceBet(
                  [],
                  res.data.game_match.match_data.player[1]
                );
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
                _this.$refs.playerCardRef.card_1_blackjack = true;
              }, 2000);
              // _this.evenMoney = true;
              _this.$refs.playerCardRef.clickStand();

                   setTimeout(() => {
                  _this.splitScore =
                    res.data.game_match.match_data.player[1].score;
                  this.dealer = [
                    res.data.game_match.match_data.dealer.cards[0],
                    res.data.game_match.match_data.dealer.cards[1],
                  ];

                  this.pushDealerCards1();
                }, 2000);

              // _this.hand_id = 2;
              // _this.is_lock = false;

              // _this.$refs.playerCardRef.card_2_blackjack = true;
            }, 2000);
              return
          }
          if (
            res.data.game_match.match_data.player[0].cards[0][0] == 'A' && res.data.game_match.match_data.player[1].cards[0][0] == 'A'&&
            res.data.game_match.match_data.player[0].black_jack &&
            res.data.game_match.match_data.player[1].black_jack &&
            res.data.game_match.match_data.player[0].can_even_money == false
          ) {
               this.is_lock = true
            this.is_lock_sur = true
              let totalSplit = this.balance - parseFloat(this.black_jack_data.main)
            this.$store.commit("SET_BALANCE", parseFloat(totalSplit));
         
            setTimeout(() => {
         
                this.is_lock_sur = true
                this.is_lock = true;
                this.dealerScore1 = res.data.game_match.match_data.dealer.score;
                _this.splitCards =
                  res.data.game_match.match_data.player[1].cards;
                this.match_data_player =
                  res.data.game_match.match_data.player[0];
                this.match_data_dealer = res.data.game_match.match_data.dealer;
                this.arrayCardDouble =
                  res.data.game_match.match_data.dealer.cards;
                this.cardsPlayer_1 =
                  res.data.game_match.match_data.player[0].result_match.main.type;
                this.cardsPlayer_2 =
                  res.data.game_match.match_data.player[1].result_match.main.type;
                this.place_double_stand = parseFloat(res.data.user_points);

              setTimeout(() => {
                _this.fileAudioPlaceBet(
                  [],
                  res.data.game_match.match_data.player[0]
                );
                _this.fileAudioPlaceBet(
                  [],
                  res.data.game_match.match_data.player[1]
                );
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
                _this.$refs.playerCardRef.card_1_blackjack = true;
              }, 2000);
              // _this.evenMoney = true;
              _this.$refs.playerCardRef.clickStand();

                   setTimeout(() => {
                  _this.splitScore =
                    res.data.game_match.match_data.player[1].score;
                  this.dealer = [
                    res.data.game_match.match_data.dealer.cards[0],
                    res.data.game_match.match_data.dealer.cards[1],
                  ];

                  this.pushDealerCards1();
                }, 2000);

              // _this.hand_id = 2;
              // _this.is_lock = false;

              _this.$refs.playerCardRef.card_2_blackjack = true;
            }, 2000);
            return
          }
          if (
            res.data.game_match.match_data.player[0].black_jack 
          ) {
          
            _this.is_lock = true;
            setTimeout(() => {
              _this.is_lock = false;
              // _this.evenMoney = true;
              _this.splitCards = res.data.game_match.match_data.player[1].cards;
              _this.fileAudioPlaceBet(
                [],
                res.data.game_match.match_data.player[0]
              );
              _this.hand_id++;
              _this.$refs.playerCardRef.clickStand();
              _this.$refs.playerCardRef.card_2_blackjack = true;
              setTimeout(() => {
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
              }, 2000);
            }, 2000);
          }


          if (res.data.game_match.match_data.player[0].can_insurance) {
            _this.is_lock = true;
            setTimeout(() => {
              _this.checkBlackjack = true;
            }, 2000);
          }
          if(res.data.end_game){
           
                 this.is_lock = true
            this.is_lock_sur = true
              let totalSplit = this.balance - parseFloat(this.black_jack_data.main)
            this.$store.commit("SET_BALANCE", parseFloat(totalSplit));
         
            setTimeout(() => {
         
                this.is_lock_sur = true
                this.is_lock = true;
                this.dealerScore1 = res.data.game_match.match_data.dealer.score;
                _this.splitCards =
                  res.data.game_match.match_data.player[1].cards;
                this.match_data_player =
                  res.data.game_match.match_data.player[0];
                this.match_data_dealer = res.data.game_match.match_data.dealer;
                this.arrayCardDouble =
                  res.data.game_match.match_data.dealer.cards;
                this.cardsPlayer_1 =
                  res.data.game_match.match_data.player[0].result_match.main.type;
                this.cardsPlayer_2 =
                  res.data.game_match.match_data.player[1].result_match.main.type;
                this.place_double_stand = parseFloat(res.data.user_points);

              setTimeout(() => {
                _this.fileAudioPlaceBet(
                  [],
                  res.data.game_match.match_data.player[0]
                );
                _this.fileAudioPlaceBet(
                  [],
                  res.data.game_match.match_data.player[1]
                );
                _this.splitScore =
                  res.data.game_match.match_data.player[1].score;
                _this.$refs.playerCardRef.card_1_blackjack = true;
              }, 2000);
              // _this.evenMoney = true;
              _this.$refs.playerCardRef.clickStand();

                   setTimeout(() => {
                  _this.splitScore =
                    res.data.game_match.match_data.player[1].score;
                  this.dealer = [
                    res.data.game_match.match_data.dealer.cards[0],
                    res.data.game_match.match_data.dealer.cards[1],
                  ];

                  this.pushDealerCards1();
                }, 2000);

              // _this.hand_id = 2;
              // _this.is_lock = false;

              _this.$refs.playerCardRef.card_2_blackjack = true;
            }, 2000);
            return
          }
        });
    },

    // test
    testSplit() {
      let _this = this;
      let temp = this.player.splice(1, 1);
      this.splitCards.push(temp);
      this.$refs.dealerCardRef.blackjack = true;

      setTimeout(() => {
        _this.player.push("AH");
        setTimeout(() => {
          _this.$refs.playerCardRef.card_2_blackjack = true;
          setTimeout(() => {
            _this.$refs.playerCardRef.clickStand();
            setTimeout(() => {
              _this.splitCards.push("AH");
              setTimeout(() => {
                _this.$refs.playerCardRef.card_1_blackjack = true;
              }, 2000);
            }, 2000);
          }, 1000);
        }, 2000);
      }, 2000);
      this.splitScore = 5;
    },
    youLost() {
      this.resultPlay[0] = true;
    },

    endGameAnimation() {
      this.$refs.dealerCardRef.endGameAnimation();
      this.$refs.playerCardRef.endGameAnimation();
    },
  },

  destroyed() {
    this.$store.commit("black_jack/RESET_CURRENT_BET");
  },
};
</script>

<style>
.game-display {
  padding-top: 0 !important;
  height: 500px;
  position: relative;
}
.none_header1 .el-dialog__header {
  display: none;
}
.wrap-content h3 {
  color: white;
  text-transform: uppercase;
  text-align: center;
  font-size: 20px;
  margin: 0 0 5px 0;
}
.dialog-tip_win_lose1 {
  background-color: #0d6751;
  box-shadow: 2px 2px 20px 1px;
  border: 2px solid #22c99b;
  border-radius: 10px;
  text-align: center;
  width: 20%;
}
.textBg__stand {
  width: 50%;
  font-size: 14px;
  margin: 5px 0;
}
.textBg__match {
  width: 30%;
  font-size: 14px;
}
.textBg {
  color: #93b0a8;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
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

.game-display .start-img {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.game-display .result-img {
  z-index: 11111000;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 17%;
  transform: translateX(-50%) translateY(-50%);
}

.game-display .player-blackjack-img,
.game-display .dealer-blackjack-img {
  position: absolute !important;
  z-index: 11111101111111 !important;
  top: 50%;
  left: 50%;
  height: auto !important;
  width: 124% !important;

  transform: translateX(-50%) translateY(-50%);
}
img.player-blackjack-img.re-styled {
  width: 50% !important;
}

.game-display .start-img .wrap-content {
  width: 100%;
  padding: 0 20px;
}

.game-display .start-img .wrap-content img {
  width: 40%;
}

.game-display .start-img .wrap-content p {
  margin: 0;
  font-size: 1.4rem;
  text-transform: uppercase;
  color: #ffffff;
  font-weight: 600;

  text-align: center;
}
.over-score {
  background-color: #ae0020 !important;
}
.bottom-action .list-btn-bottom .btn-main-match {
  margin: 5px !important;
}
@media screen and (min-width: 375px) and (max-width: 767px) {
  .dialog-tip_win_lose1 {
    width: 68% !important;
  }
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .score-label1 {
    right: 64px !important;
    width: 45px !important;

    height: 45px !important;
  }
}
@media screen and (min-width: 375px) and (max-width: 420px) {
  .textBg .height_text {
    height: 28px !important;
    margin: 6px;
  }
}
@media screen and (min-width: 375px) and (max-width: 481px) {
  .wrap-content h3 {
    font-size: 15px;
  }
  .textBg .height_text {
    height: 25px;
    margin: 5px;
  }
  .game-display .start-img {
    margin-top: 10px;
  }
  .textBg__stand {
    width: 60%;
    font-size: 11px;
  }
  .textBg__match {
    width: 40%;
    font-size: 11px;
    margin-left: 5px;
  }
}
@media screen and (min-width: 375px) and (max-width: 523px) {
  .please_play_game h3 {
    font-size: 15px !important;
  }
}
@media screen and (min-width: 415px) and (max-width: 435px) {
  .score-label1 {
    right: 64px !important;
    width: 45px !important;
    top: 30px !important;
    height: 45px !important;
  }
}
@media screen and (min-width: 436px) and (max-width: 450px) {
  .score-label1 {
    right: 84px !important;
    width: 45px !important;
    top: 30px !important;
    height: 45px !important;
  }
}
@media screen and (min-width: 451px) and (max-width: 600px) {
  .score-label1 {
    right: 20% !important;
    width: 45px !important;
    top: 60px !important;
    height: 45px !important;
  }
}
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .dialog-tip_win_lose1 {
    width: 40% !important;
  }
}

.game-display .insurance {
  width: 100%;
  position: absolute;
}

.game-display .insurance .wrap-insurance {
  text-transform: uppercase;
  color: #ffffff;
  margin: auto;
  width: fit-content;
  display: flex;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  position: relative;
  z-index: 50;
}

.game-display .insurance .wrap-insurance .content {
  background-color: #00a974;
  position: relative;
}

.game-display .insurance .wrap-insurance .content .total-money {
  position: absolute;
  font-size: 0.8rem;
  background-color: #00a974;
  top: -13px;
  right: -37px;
  padding: 4px 10px;
  border: 1px solid;
  border-radius: 6px;
}

.game-display .insurance .wrap-insurance .btn-yes {
  background-color: #00a974;
  cursor: pointer;
}

.game-display .insurance .wrap-insurance .btn-no {
  background-color: #ae0020;
  cursor: pointer;
}
.game-display .insurance .wrap-insurance .btn-cancel {
  background-color: orange !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 17px;
  padding: 0px 14px;

  border: 1px solid;
  border-radius: 6px;
}
.please_play_game {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.please_play_game h3 {
  margin: 0;
  text-transform: uppercase;
  color: white;
  font-size: 24px;
}

.game-display .insurance .wrap-insurance .btn-yes,
.game-display .insurance .wrap-insurance .btn-no,
.game-display .insurance .wrap-insurance .content {
  padding: 7px 14px;
  border: 1px solid;
  border-radius: 6px;
}

@media (max-width: 450px) {
  .game-display {
    height: 350px !important;
  }
  .game-display .start-img .wrap-content {
    width: 100% !important;
  }
  .game-display .start-img .wrap-content p {
    font-size: 15px !important;
  }

  .bottom-action .list-btn-bottom .btn-main-match {
    margin: 3px !important;
  }

  .game-display .result-img {
    width: 19% !important;
  }

  .game-display .blackjack-img {
    width: 48% !important;
  }

  .game-display .insurance .wrap-insurance {
    font-size: 0.9rem !important;
    gap: 6px !important;
  }

  .game-display .insurance .wrap-insurance .btn-yes,
  .game-display .insurance .wrap-insurance .btn-no,
  .game-display .insurance .wrap-insurance .content {
    padding: 5px 5px;
    border: 1px solid;
    border-radius: 3px;
  }

  .game-display .insurance .wrap-insurance .content .total-money {
    top: -13px;
    right: -24px;
    padding: 2px 5px;
  }
}

.sound .muted img {
  width: 25px;
  color: yellow;
}
.sound .muted {
  background-color: transparent;
  border: 0;
  position: absolute;
  right: 12px;
  top: 33px;
}
.sound .unmuted img {
  width: 25px;
  color: yellow;
}
.sound .unmuted {
  background-color: transparent;
  border: 0;

  position: absolute;
  right: 12px;
  top: 33px;
}
.score-label1 {
  position: absolute;
  top: 20px;
  right: 132px;
  width: 55px;
  border-radius: 50%;
  height: 55px;
  border: 2px solid white;
  z-index: 100;
  background-color: #00a974;
  transform: translateY(-25%);
  font-size: 1.8rem;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: math;
}
</style>
