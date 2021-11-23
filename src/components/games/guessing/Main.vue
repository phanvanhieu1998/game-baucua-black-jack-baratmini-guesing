<template>
  <div class="guessing-game-main">
    <div
      id="scr"
      v-if="game_list_filter.length != 0"
      class="guessing-game-list scroll--list--game"
    >
      <div id="setHeight">
        <GameItem
        
          v-for="game in game_list_filter"
          :key="game.id"
          :game="game"
          @clear__value="clear__value"
          @check_game_expired="check_game_expired"
        ></GameItem>
        <div style="text-align: center;" class="noGame" v-if="isNoGameInFilter">
          <span
            >{{textarea}}</span
          >
        </div>
      </div>
    </div>

    <div style="text-align: center;" class="noGame" v-else>
      <span
        >{{textarea}}</span
      >
    </div>

    <div class="filter_game">
      <div class="note_qlines">
        <div @click="scrollBottom">
          <img
            slot="reference"
            style="width:35px;float:right;margin-right:5px;cursor: pointer;"
            src="@/assets/images/arrow-up-solid.svg"
          />
        </div>
        <div
          @click="filterGameDisplay(item.type)"
          class="filter_list_game"
          :class="[
            `filter-${item.title}`,
            { current: item.type == filter_type },
          ]"
          v-for="(item, index) in filterGame"
          :key="index"
        >
          {{ item.title }}
        </div>

        <div style="display:block" @click="scrollWin">
          <img
            slot="reference"
            style="width:35px;float:right;margin-right:5px;cursor: pointer;"
            src="@/assets/images/arrow-down-solid.svg"
          />
        </div>
      </div>
      <div v-if="display_note" style="padding-top: 10px;text-align: center;">
        <span class="note_text"
          >QLINES SPREAD AND TOTAL IS FOR 1st QUARTER ONLY.</span
        >
      </div>
    </div>

    <div class="selected_value">
      <div class="box-selected_value" v-for="i in 4" :key="i">
        <span v-if="selected_games_values[i - 1]">
          {{
            selected_games_values[i - 1].game["options_val"][
              selected_games_values[i - 1].val_key
            ]
          }}
        </span>
      </div>
    </div>
    <div
      v-if="note_teaser"
      style="text-align: center;margin-top:10px;padding:0 10px"
    >
      <span class="note_text">
        FOOTBALL: T2+6, T3+9, T4+11 | BASKETBALL: T2+5, T3+7, T4+9 | TIE = LOST
      </span>
    </div>

    <div
      v-if="note_parlay"
      style="text-align: center;margin-top:10px;padding:0 10px"
    >
      <span class="note_text">
        PARLAY: P2 - 2.5/1, P3 - 6/1, P4 - 10/1
      </span>
    </div>

    <div class="betting_door_list">
      <div v-for="(value, key) in bettingListDoor" :key="key">
        <el-badge
          :value="valueBet[key] | price"
          :hidden="valueBet[key] == 0"
          type="success"
        >
          <el-button
            class="betting_door_list_1"
            :class="{ 'current-bet': current == key }"
            :disabled="isPlaceBetLock(key)"
            @click="currentBet(key)"
          >
            {{ key }}
          </el-button>
        </el-badge>
      </div>
    </div>
    <div style="padding:0 0 10px 0" class="betting_door_list">
      <el-popconfirm
        title="Go to game LIVE PLAY, Are you sure?"
        @confirm="nextGame"
        cancel-button-text="Cancel"
        confirm-button-text="Ok"
      >
        <el-button slot="reference" class="betting_door_list_1">
          LIVE PLAY
        </el-button>
      </el-popconfirm>
    </div>

    <div class="list-balance-min-max">
      <div class="min-max list-balance-min-max_balance">
        BALANCE: {{ balance | price }}
      </div>

      <div class="min-max list-balance-min-max_min">
        MIN: {{ setting_for_user.min | price }}
      </div>

      <div class="min-max list-balance-min-max_max">
        MAX: {{ setting_for_user.max | price }}
      </div>
    </div>

    <div class="list__img--bet--level">
      <div class="image-level-bet">
        <button
          :disabled="current == ''"
          @click="_addPoint(n)"
          v-for="n in [1, 5, 25, 100]"
          :key="n"
        >
          <img :src="`${wp_theme_url}images/chip_${n}.png`" />
        </button>
      </div>
    </div>

    <div class="list__bet__tip__clear">
      <PopConfirm
        :isVisible="confirm_place_bet"
        @cancel="confirm_place_bet = false"
        @confirm="place_bet"
        :title="$t('MSG_CONFIRM_PLACE_BET')"
      >
        <div slot="children">
          <el-button
            style="    padding: 0 5px;"
            :disabled="isPlaceBet"
            @click="confirm_place_bet = true"
            class="btn-choice-bet place-tip-clear"
          >
            PLACE BET
          </el-button>
        </div>
      </PopConfirm>

      <div class="tip__dealer">
        <el-button
          class="place-tip-clear "
          @click="dialog_tip = true"
          type="success"
          >TIP WATERBOY</el-button
        >
      </div>

      <div>
        <el-button
          style="  width: 100% ;padding: 0 5px;"
          class="place-tip-clear"
          type="success"
          @click="clear_all"
          >CLEAR ALL</el-button
        >
      </div>
    </div>

    <div class="pending--result">
      <span>PENDING BETS AND RESULTS:</span>
    </div>

    <div>
      <div
        class="game__result"
        :class="[`lbgt-${game.type}`]"
        v-for="game in history_game"
        :key="game.id"
        :game="game"
      >
        <el-row>
          <el-col :xs="5" class="responsive__type__game" :span="3">
            <span> {{ typeGame(game.type) }}: </span>
          </el-col>

          <el-col :xs="19" class="gamme--result" :span="21">
            <el-row>
              <el-col :xs="24" :span="10">
                <div>
                  <el-button
                    :class="[`game-${game.type}`]"
                    class="about_bet"
                    v-for="(item, index) in game.betting.games"
                    :key="index"
                    >{{ item.val }}</el-button
                  >
                </div>
              </el-col>
              <el-col :xs="24" :span="14">
                <div class="return_result">
                  <div
                    style="display:flex"
                    v-if="game.betting_result.type == 'cancelled'"
                  >
                    <div>
                      <div class="type_game_pending">
                        {{ game.betting.option }}
                      </div>
                      <span style="margin-right:10px">
                        [RISKING: ${{
                          parseFloat(game.betting.amount) +
                            parseFloat(game.betting.fee)
                        }}
                        | RESULT: CANCELLED]
                      </span>
                    </div>
                    <div class="xx">
                      <img
                        class="clear__game"
                        @click="deleteGame(game.id)"
                        slot="reference"
                        src="@/assets/images/times-solid.svg"
                      />
                    </div>
                  </div>

                  <div style="display:flex" v-else>
                    <div v-if="game.betting.fee">
                      <div class="type_game_pending">
                        {{ game.betting.option }}
                      </div>
                      <span
                        v-if="game.betting_result.type == 'win'"
                        style="margin-right:10px"
                      >
                        [RISKING: ${{
                          parseFloat(game.betting.amount) +
                            parseFloat(game.betting.fee)
                        }}
                        | RESULT: +{{ game.betting_result.amount }}]
                      </span>
                      <span style="margin-right:10px" v-else>
                        [RISKING: ${{
                          parseFloat(game.betting.amount) +
                            parseFloat(game.betting.fee)
                        }}
                        | RESULT: -{{ game.betting_result.amount }}]
                      </span>
                    </div>

                    <div v-else>
                      <div class="type_game_pending">
                        {{ game.betting.option }}
                      </div>
                      <span
                        v-if="game.betting_result.type == 'win'"
                        style="margin-right:10px"
                      >
                        [RISKING: ${{ game.betting.amount }} | RESULT: +{{
                          game.betting_result.amount
                        }}]
                      </span>
                      <span style="margin-right:10px" v-else>
                        [RISKING: ${{ game.betting.amount }} | RESULT: -{{
                          game.betting_result.amount
                        }}]
                      </span>
                    </div>

                    <div class="xx">
                      <img
                        class="clear__game"
                        @click="deleteGame(game.id)"
                        slot="reference"
                        src="@/assets/images/times-solid.svg"
                      />
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div
        class="game__pending"
        v-for="game in pending_game"
        :key="game.id"
        :game="game"
        :class="[`lbgt-${game.type}`]"
      >
        <div class="game__pending_title">
          <el-row>
            <el-col :xs="5" :span="3">
              <span class="responsive_type-game">
                {{ _label(game.type) }}:
              </span>
            </el-col>

            <el-col :xs="19" class="value_bet_pending" :span="21">
              <el-row>
                <el-col :xs="24" :span="12">
                  <div>
                    <el-button
                      :class="[`game-${game.type}`]"
                      class="about_bet"
                      v-for="(item, index) in game.betting.games"
                      :key="index"
                      >{{ item.val }}</el-button
                    >
                  </div>
                </el-col>
                <el-col class="llll" :xs="24" :span="12">
                  <div class="respnsive_game_gue">
                    <div class="type_game_pending">
                      {{ game.betting.option }}
                    </div>
                    <span v-if="game.betting.fee" class="pending">
                      [RISKING: ${{
                        parseFloat(game.betting.amount) +
                          parseFloat(game.betting.fee)
                      }}
                      | PENDING]</span
                    >
                    <span class="pending" v-else>
                      [RISKING: ${{ game.betting.amount }} | PENDING]</span
                    >
                  </div>
                </el-col>
              </el-row>
              <div class="value_bet_pending_content"></div>
            </el-col>
          </el-row>
        </div>
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
import { mapState, mapGetters, mapMutations } from "vuex";
import GameItem from "./GameItem";
export default {
  data() {
    return {
    
      textarea:'',
      note_parlay: false,
      note_teaser: false,
      display_note: false,
      current_type: "full",
      scrollWin1: 0,
      type_game: {},
      game: [],
      bettingListDoor: { single: 0, ar: 0, teaser: 0, parlay: 0 },
      current: "",
      dialog_tip: false,
      confirm_place_bet: false,
      tip_value: 1,
      filterGame: [
        {
          title: "FULL",
          type: "full",
        },
        {
          title: "1ST HALF",
          type: "n1st_half",
        },
        {
          title: "2ND HALF",
          type: "n2nd_half",
        },
        {
          title: "QLINES",
          type: "qlines",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      balance: (state) => state.balance,
      game_list: (state) => state.guessing.game_list,
      game_list1: (state) => state.guessing.game_list1,
      selectedValue: (state) => state.guessing.selectedValue,
      valueBet: (state) => state.guessing.valueBet,
      selected_games_values: (state) => state.guessing.selected_games_values,
      pending_game: (state) => state.guessing.pending_game,
      history_game: (state) => state.guessing.history_game,
      options: (state) => state.guessing.options,
      user_id: (state) => state.user_id,
      currentGame: (state) => state.guessing.currentGame,
      value_bet_game: (state) => state.guessing.value_bet_game,
      setting_for_user: (state) => state.guessing.setting_for_user,
      game_timeleft: (state) => state.guessing.game_timeleft,
      filter_type: (state) => state.guessing.filter_type,
    }),

    ...mapGetters({
      game_list_filter: "guessing/game_list_filter",
      gamesTotal: "guessing/gamesTotal",
    }),

    isNoGameInFilter() {
      let __return = false;

      this.filterGame.forEach((f) => {
        if (this.filter_type === f.type && this.gamesTotal[f.type] === 0) {
          __return = true;
        }
      });

      return __return;
    },

    wp_theme_url() {
      return this.$store.state.WP_THEME_APP_URL;
    },
    totalPlaceBet() {
      let total = 0;
      for (const [key, value] of Object.entries(this.bettingListDoor)) {
        total += parseFloat(value);
      }
      return total;
    },
    isPlaceBet() {
      let total = 0;
      for (const [key, value] of Object.entries(this.bettingListDoor)) {
        total += parseInt(value);
      }
      return total > 0 ? false : true;
    },
    // parseSetting() {
    //   return this.setting_for_user;
    // },
  },
  //Mô tả cho hàm

  mounted() {
  
    this.filterGameDisplay("full");
    const channel = this.$pusher.subscribe("guessing");
    channel.bind("new_game", (data) => {
      
      data.forEach((new_game) => {
        
        let list = this.game_list;
        list.push(new_game);
        this.$store.commit("guessing/SET_GAME_LIST", list);
        console.log('list',list)
      });
    });
    channel.bind("admin_del_game", (data) => {
      let index = this.game_list.findIndex((e) => e.id == data.game_id);

      this.game_list.splice(index, 1);
    });

    channel.bind(`game_result_${this.user_id}`, (data) => {
      this.history_game.unshift(data.game_playing);
      this.$store.commit("SET_BALANCE", parseFloat(data.user_points));
      this.$store.commit("guessing/SET_ID", data);
    });

    channel.bind(`update_game_result_${this.user_id}`, (data) => {
      this.history_game.forEach((e) => {
        if (e.id == data.game_playing.id) {
          e.betting_result = data.game_playing.betting_result;
        }
      });
      this.$store.commit("SET_BALANCE", parseFloat(data.user_points));
    });

    this.loadData();
  },

  components: {
    GameItem,
  },
  methods: {

    scrollWin() {
      if (document.getElementById("setHeight") != null) {
        if (
          this.scrollWin1 <
          document.getElementById("setHeight").clientHeight - 385
        ) {
          document.getElementById("scr").scrollTo(0, (this.scrollWin1 += 65));
        }
      }
    },
    scrollBottom() {
      if (this.scrollWin1 > 0) {
        document.getElementById("scr").scrollTo(0, (this.scrollWin1 -= 65));
      }
    },
    isPlaceBetLock(key) {
      let is_lock = false;
      let pickedGames = this.selected_games_values;

      //single | ar | teaser | parlay
      switch (key) {
        case "single":
          is_lock = pickedGames.length !== 1 ? true : false;
          
          break;
        case "ar":
          if (pickedGames.length !== 2) {
            is_lock = true;
          } else {
            let ctype = "";
            pickedGames.forEach((_g) => {
              if (ctype === "") {
                ctype = _g.game.type;
              } else if (ctype !== _g.game.type) {
                is_lock = true;
              }
            });
          }
          break;
        case "teaser":
          if (pickedGames.length < 2) {
            is_lock = true;
          } else {
            pickedGames.forEach((_g) => {
              if (_g.game.type !== "full") {
                is_lock = true;
              }
            });
          }
          break;
        case "parlay":
          if (pickedGames.length < 2) {
            is_lock = true;
          } else {
            let ctype = "";
            pickedGames.forEach((_g) => {
              if (ctype === "") {
                ctype = _g.game.type;
              } else if (ctype !== _g.game.type) {
                is_lock = true;
              }
            });     
          }
          break;

        default:
          break;
      }
      
      return is_lock;
    },
    typeGame(value) {
      let label = this.options[value].label;
      return label;
    },
    _label(key) {
      let label = this.options[key].label;
      return label;
    },
    loadData() {
      this.$store.dispatch("guessing/loadData").then((res) => {
        this.textarea = res.data.guessing_msg
        
      });
    },
    deleteGame(id) {
      let idGameDel = {
        game_playing_id: id,
      };
      this.$store.dispatch("guessing/deleteResult", idGameDel).then(() => {
        this.loadData();
      });
    },
    //Mô tả cho hàm
    filterGameDisplay(game_type) {
      //this.$store.commit("guessing/SET_FILTER_GAME", game);
      //this.current_type = game;
      this.$store.commit("guessing/SET_FILTER_GAME_TYPE", game_type);

      game_type == "qlines"
        ? (this.display_note = true)
        : (this.display_note = false);
    },
    //Mô tả cho hàm

    nextGame() {
      this.$emit("back-living", true);
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
    clear__value(){
      this.clear__all()
    },
    //Mô tả cho hàm
    currentBet(value) {

      this.current = value;
     
      if (value == "teaser") {
        this.note_teaser = true;
      } else {
        this.note_teaser = false;
      }
      if (value == "parlay") {
        this.note_parlay = true;
      } else {
        this.note_parlay = false;
      }
      this.clear__all1()
    },
    //Mô tả cho hàm
    clear__all(){
   
      // this.$store.commit("guessing/SET_CURRENT_GAME", "");
      // this.$store.commit("guessing/SET_VALUE_BET_GAME", []);
     this.current = "";
      let new_balance =
        parseFloat(this.balance) + parseFloat(this.totalPlaceBet);
      this.$store.commit("SET_BALANCE", parseFloat(new_balance.toFixed(2)));
      //Xử lý back lại tiền
      //this.$store.commit("guessing/SET_CLEAR_ALL", []);
      // this.$store.commit("guessing/SET_GAME_SELECTED_VALUES", []);
      this.bettingListDoor = { single: 0, ar: 0, teaser: 0, parlay: 0 };
      this.$store.commit("guessing/SET_VALUE_BET", this.bettingListDoor);
      this.note_teaser = false;
      this.note_parlay = false;
    },
        clear__all1(){
   
      // this.$store.commit("guessing/SET_CURRENT_GAME", "");
      // this.$store.commit("guessing/SET_VALUE_BET_GAME", []);
  
      let new_balance =
        parseFloat(this.balance) + parseFloat(this.totalPlaceBet);
      this.$store.commit("SET_BALANCE", parseFloat(new_balance.toFixed(2)));
      //Xử lý back lại tiền
      //this.$store.commit("guessing/SET_CLEAR_ALL", []);
      // this.$store.commit("guessing/SET_GAME_SELECTED_VALUES", []);
      this.bettingListDoor = { single: 0, ar: 0, teaser: 0, parlay: 0 };
      this.$store.commit("guessing/SET_VALUE_BET", this.bettingListDoor);
      // this.note_teaser = false;
      // this.note_parlay = false;
    },
    clear_all() {
    
      // this.$store.commit("guessing/SET_CURRENT_GAME", "");
      this.$store.commit("guessing/SET_VALUE_BET_GAME", []);
      this.current = "";
      let new_balance =
        parseFloat(this.balance) + parseFloat(this.totalPlaceBet);
      this.$store.commit("SET_BALANCE", parseFloat(new_balance.toFixed(2)));
      //Xử lý back lại tiền
      //this.$store.commit("guessing/SET_CLEAR_ALL", []);
      this.$store.commit("guessing/SET_GAME_SELECTED_VALUES", []);
      this.bettingListDoor = { single: 0, ar: 0, teaser: 0, parlay: 0 };
      this.$store.commit("guessing/SET_VALUE_BET", this.bettingListDoor);
      this.note_teaser = false;
      this.note_parlay = false;
    },
    // GameEndTime(){
    
    //   let arr = []
    //   let ar = []
    //   this.value_bet_game.forEach((e)=>{
    //     arr.push(e.id)
    //   })
    //    this.game_list_filter.forEach((e)=>{
    //     ar.push(e.id)
    //   })
    //   let a = 
    //   console.log(arr,ar)
    // },
    //Mô tả cho hàm
    check_game_expired(idGame){
      while(true){
        let index = this.value_bet_game.findIndex((e) => e.id == idGame)
       
        if(index != -1){
            this.value_bet_game.splice(index,1)
        }else{
          break
        }


      }
     
    

      if(this.isPlaceBetLock(this.current)){
      
        this.current = ''
                  let new_balance =
        parseFloat(this.balance) + parseFloat(this.totalPlaceBet);
      this.$store.commit("SET_BALANCE", parseFloat(new_balance.toFixed(2)));
        this.bettingListDoor = { single: 0, ar: 0, teaser: 0, parlay: 0 };
          this.$store.commit("guessing/SET_VALUE_BET", this.bettingListDoor);
 
      
      }
    },
 
    place_bet() {
      this.confirm_place_bet = false;
      
      let data = {
        games: this.value_bet_game,
        option: this.current,
        amount: this.totalPlaceBet,
      };


      this.$store.dispatch("guessing/placeBet", data).then((res) => {
        if (this.totalPlaceBet < this.setting_for_user.min) {
          this.$message({
            message: res.data.message,
            type: "error",
          });
          this.clear_all();
          return;
        }
        if (res.data.errors) {
          // let new_balance =
          //   parseFloat(this.balance) + parseFloat(this.totalPlaceBet);
          // this.$store.commit("SET_BALANCE", parseFloat(new_balance.toFixed(2)));
          this.$message({
            message: res.data.message,
            type: "error",
          });

          this.clear_all();
        } else {
          this.$store.commit("SET_BALANCE", parseFloat(res.data.user_points));
          this.$store.commit("guessing/SET_UNSHIFT", res.data.game_playing);
          this.note_parlay = false;
          this.note_teaser = false;
          this.$message({
            message:
              "Your entry has been registered. You're all set. Good luck!!!",
            type: "success",
          });
          this.$store.commit("guessing/SET_VALUE_BET_GAME", []);
          this.current = "";
          this.$store.commit("guessing/SET_GAME_SELECTED_VALUES", []);
          this.bettingListDoor = { single: 0, ar: 0, teaser: 0, parlay: 0 };
          this.$store.commit("guessing/SET_VALUE_BET", this.bettingListDoor);
        }
      });
    },
    //Mô tả cho hàm
    _addPoint(point) {
      let current_bet_key = this.current;
      if (this.balance >= point) {
        if (
          parseInt(this.bettingListDoor[current_bet_key]) + point >
          this.setting_for_user.max
        ) {
          console.log("max roi");
          return;
        } else {
          this.bettingListDoor[current_bet_key] =
            parseInt(this.bettingListDoor[current_bet_key]) + point;
          let new_balance = parseFloat(this.balance) - point;
          this.$store.commit("SET_BALANCE", new_balance.toFixed(2));
          this.$store.commit("guessing/SET_VALUE_BET", this.bettingListDoor);
        }
      }
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
          .dispatch("guessing/sendTipDealer", this.tip_value)
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
  },
  destroyed() {
    this.$pusher.subscribe("guessing").unbind("new_game")

  },
};
</script>

<style>
@import "./style.css";
</style>
