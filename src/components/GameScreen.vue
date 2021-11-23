<template>
  <el-card
    shadow="never"
    :body-style="{ padding: '0px', height: '100%' }"
    class="game-screen-wrapper"
  >
    <component
      v-if="current_game_name"
      :is="gameCom.Main"
      @quit-game="quitGame"
      @back-living="directJoinLiving"
      @back-guessing="directJoinGuessing"
    ></component>

    <div class="game-screen" :class="{ 'on-cashout': show_cashout }" v-else>
      <!--      <span class="version">v0.4.8.03.26</span>-->
      <div class="game-banner">
        <img :src="`${wp_theme_url}images/casino.png`" alt="#" />
      </div>
      <div class="game-welcom" @click="show_cashout = true">
        <h5>
          {{ $t("WELCOME", "Welcome") }},
          {{ user_name ? user_name.toUpperCase() : "" }}
        </h5>
        <span>{{ $t("BALANCE", "Balance") }}: {{ balance | price }}</span>
      </div>
      <Cashout
        v-if="show_cashout"
        :balance="balance"
        @back-list="show_cashout = false"
      ></Cashout>
      <div class="game-list" v-else>
        <el-button
          :loading="loading && game.name === current_select"
          @click="_onSelectGame(game)"
          :class="['game-item', { disabled: game.status == '0' }]"
          v-for="game in game_list"
          :key="game.id"
          :disabled="game.status == '0'"
        >
          {{ game.title }}
        </el-button>
        <el-button class="game-item" @click="show_cashout = true">
          Cashier
        </el-button>
      </div>

      <a :href="logout_url" class="logout-button">Logout</a>
    </div>
    <el-dialog
      custom-class="waiting-dialog"
      :title="$t('JOIN_GAME', 'Join Game')"
      :show-close="false"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <span>{{ title_modal }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="onCancelJoinGame"
          >Cancel</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      custom-class="endgame-dialog"
      :show-close="false"
      center
      :visible.sync="dialog_result_endgame"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
    >
      <div class="endgame-container">
        <h3>You {{ getWinLose }}: {{ getAmoutMatchResult | price }}</h3>
        <!-- <h5>{{ $t('WAIT_FOR_NEW_NAME') }}</h5> -->
        <el-button @click="closeDialogEndgame" type="warning">Close</el-button>
      </div>
    </el-dialog>

    <PokerSetUserDialog ref="poker_set_user_dialog" @set-success="setUserPokerSuccess"></PokerSetUserDialog>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import StorageGame from "@/utils/storage";
import Cashout from "./common/Cashout.vue";

import PokerSetUserDialog from "@/components/games/poker/SetUserNameForDev.vue";

export default {
  components: { Cashout, PokerSetUserDialog },
  data() {
    return {
      show_cashout: false,
      dialogVisible: false,
      request_error: false,
      loading: false,
      current_select: "",
      game_playing_id: 0,
      title_modal: this.$t(
        "WAIT_FOR_ADMIN_ACCEPT",
        "Waiting for admin to accept request..."
      ),
      gameCom: {
        Main: null,
      },
      dialog_result_endgame: false,

      match_result: {
        type: "win",
        amout: 0,
      },
    };
  },

  computed: {
    ...mapState({
      game_list: (state) => state.game_list,
      current_game_name: (state) => state.current_game_name,
      balance: (state) => state.balance,
      user_name: (state) => state.user_name,
      user_id: (state) => state.user_id,
    }),

    loadGameMainCurrent() {
      return () =>
        import(
          /* webpackChunkName: "game-[request]" */ `../components/games/${this.current_game_name}/Main.vue`
        );
    },

    wp_theme_url() {
      return this.$store.state.WP_THEME_APP_URL;
    },

    getWinLose() {
      return this.match_result.type === "win" ? "Won" : "Lost";
    },

    getAmoutMatchResult() {
      return this.match_result.amount;
    },

    logout_url() {
      return typeof APP_WORDPRESS_LOGOUT !== "undefined"
        ? APP_WORDPRESS_LOGOUT
        : "";
    },
  },

  watch: {
    current_game_name(newVal, oldVal) {
      if (newVal === "") {
        this.gameCom.Main = null;
        console.log("Xóa null");
      }
    },
  },

  mounted() {
    this.$store.dispatch("loadUserInfo");
    const channel = this.$pusher.subscribe("games_channel");
    channel.bind("join_game", (data) => {
      console.log(data);

      switch (data.request_status) {
        case "accept":
          if (
            parseInt(data.game_playing_id) === parseInt(this.game_playing_id)
          ) {
            this.$store.commit("SET_CURRENT_GAME_NAME", data.current_game);
            this.loadCom();
            StorageGame.setCurrentGame(data.current_game);

            this.$store.commit(
              `${this.current_game_name}/SET_DISABLE_BET`,
              false
            );
            this.loading = false;
            this.dialogVisible = false;
          }
          break;
        case "deny":
          if (
            parseInt(data.game_playing_id) === parseInt(this.game_playing_id)
          ) {
            console.log(1);
            this.$message.error(this.$t("MSG_ERROR_ADMIN_NOT_ACCEPT"));
            this.$store.commit("SET_CURRENT_GAME_NAME", data.current_game);
            this.$store.commit(
              `${this.current_game_name}/SET_DISABLE_BET`,
              false
            );
            this.loadCom();

            StorageGame.removeCurrentGame();
            this.loading = false;
            this.dialogVisible = false;
          } else {
            console.log(2);
          }

          break;
        case "end_game":
          if (data.game_name === this.current_game_name) {
            this.$store
              .dispatch("loadUserInfo")
              .then((res) => {
                console.log(res);
                StorageGame.setTmpBalance(
                  res.data.user_info.balance,
                  this.user_id
                );
                if (
                  data.game_name === this.current_game_name &&
                  this.$store.state[data.game_name].gamer_match.place_bet
                ) {
                  this.dialog_result_endgame = true;
                }
              })
              .catch((error) => console.error(error));
            this.loadCom();

            this.$store.commit(
              `${this.current_game_name}/SET_DISABLE_BET`,
              true
            );
          }

          if (
            data.game_name === this.current_game_name &&
            this.$store.state[data.game_name].gamer_match !== null &&
            this.$store.state[data.game_name].gamer_match?.place_bet
          ) {
            console.log(data);
            let game_match_id = parseInt(data.game_match_id);

            this.$store
              .dispatch("all_games/check_game_match_result", game_match_id)
              .then((res) => {
                this.match_result = res.data.result;
                this.dialog_result_endgame = true;
              })
              .catch((error) => {
                console.log(error);
              });
          }
          break;
        default:
          break;
      }

      if (
        data.game_status === "new_game" &&
        data.game_name === StorageGame.getCurrentGame()
      ) {
        console.log("run this code");
        this.$store.commit(`${this.current_game_name}/SET_DISABLE_BET`, false);
        this.loadUserInfo();
        if (data.keep_game) {
          this.$store.dispatch(
            `${StorageGame.getCurrentGame()}/loadGameMatchData`
          );
        } else {
          StorageGame.removeCurrentGame();
          this.$store.commit("SET_CURRENT_GAME_NAME", "");
          this.loadApp();
        }
      }
    });
    if (this.current_game_name) {
      this.loadCom();
    }
  },
  methods: {
    loadApp() {
      this.$store
        .dispatch("appLoad")
        .then((res) => {
          //console.log(res)
        })
        .catch((err) => {
          //console.log(err)
        });
    },

    loadUserInfo() {
      this.$store
        .dispatch("loadUserInfo")
        .then((res) => {
          console.log(res);
          StorageGame.setTmpBalance(res.data.user_info.balance, this.user_id);
        })
        .catch((error) => console.error(error));
    },

    quitGame() {
      console.log("Quit game");
      //this.gameCom.Main = null;
    },

    loadCom() {
      this.loadGameMainCurrent().then(({ default: COM }) => {
        this.gameCom.Main = COM;
      });
    },

    directJoinLiving() {
      this.$store.commit("SET_CURRENT_GAME_NAME", "living_betting");
      StorageGame.setCurrentGame("living_betting");
      this.loadCom();
    },
    directJoinGuessing() {
      this.$store.commit("SET_CURRENT_GAME_NAME", "guessing");
      StorageGame.setCurrentGame("guessing");
      this.loadCom();
    },

    setUserPokerSuccess(status){
      if(status){
        this.$router.push('/poker');
      }
    },

    _goToPoker(){
      let game_name = 'poker';
      this.current_select = game_name;

      //Để dev thôi, live bỏ đi
      this.$refs.poker_set_user_dialog.open();

      //this.$router.push('/poker');
      return true;
    },

    _onSelectGame(game) {
      let _this = this;

      if(game.name === 'poker'){
        return this._goToPoker();
      }

      this.loading = true;
      StorageGame.setTmpBalance(this.balance, this.user_id);
      //this.dialogVisible = true;
      this.current_select = game.name;
      this.$store
        .dispatch("joinGame", game.name)
        .then((res) => {
          let special_game = [
            "black_jack",
            "living_betting",
            "bau_cua",
            "football",
            "guessing",
          ];

          if (special_game.includes(game.name)) {
            _this.$store.commit("SET_CURRENT_GAME_NAME", game.name);
            StorageGame.setCurrentGame(game.name);
            _this.loadCom();
            this.loading = false;
            return;
          }

          this.game_playing_id = res.data.game_playing_id;
          let gamer_match = res.data.gamer_match;
          let status = parseInt(gamer_match.status);
          console.log(game.name);

          if (status === 3) {
            //Join game but show deny screen
            _this.$store.commit("SET_CURRENT_GAME_NAME", game.name);
            StorageGame.setCurrentGame(game.name);
            this.loadCom();
            this.loading = false;
          } else if (status === 2) {
            //Join game and can place bet
            _this.$store.commit("SET_CURRENT_GAME_NAME", game.name);
            StorageGame.setCurrentGame(game.name);
            _this.loadCom();
            this.loading = false;
          } else {
            this.dialogVisible = true;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.dialogVisible = false;
          this.$message.error(this.$t("MSG_ERROR_GAME_NOT_ACTIVE"));
        });
    },

    onCancelJoinGame() {
      this.$store
        .dispatch("cancelJoinGame", this.game_playing_id)
        .then((res) => {
          this.dialogVisible = false;
          this.loading = false;
        })
        .catch((error) => {
          this.dialogVisible = false;
          this.loading = false;
        });
    },

    closeDialogEndgame() {
      this.dialog_result_endgame = false;
    },
  },
};
</script>
<style>
.game-screen-wrapper .game-welcom {
  margin-bottom: 30px;
}
.game-screen-wrapper .on-cashout .game-welcom {
  margin-bottom: 0px;
}
.game-screen {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-image: url("../assets/images/bg.jpg");
  background-position: center;
  height: 100%;
  overflow: scroll;
  justify-content: center;
}
.game-screen::-webkit-scrollbar {
  width: 0;
  display: none !important;
}
.game-banner {
  padding: 0 60px 20px;
  margin-top: 20px;
}
.game-banner img {
  width: 100%;
  display: block;
  object-fit: cover;
}
.game-welcom {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 2px solid white;
  border-radius: 10px;
  width: 300px;
  height: 50px;
  color: #ffffff;
  background-color: #1e6942;
  box-shadow: 0 0 2px #f9fbfa, 0 0 2px rgb(0 0 0), inset 0 0 2px rgb(0 0 0);
  cursor: pointer;
}

.game-welcom h5 {
  margin: 10px 0 0;
  font-size: 16px;
}

.game-welcom span {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
}

.game-list {
  grid-template-columns: auto auto auto;
  padding: 10px;
  display: grid;
}

.game-item {
  text-align: center !important;
  margin: 10px !important;
  border: 2px solid white !important;
  border-radius: 10px !important;
  background-color: #1e6942 !important;
  color: #ffffff !important;
  font-size: 16px !important;
  box-shadow: 0 0 2px, 0 0 2px rgb(0 0 0), inset 0 0 2px rgb(0 0 0);
  width: 150px;
  height: 50px;
  font-weight: bold !important;
}
.game-item:focus {
  outline: none;
  box-shadow: 2px 2px 49px -7px rgba(92, 81, 81, 0.74);
}

.waiting-dialog {
  border: 2px solid #22c99b;
  border-radius: 10px !important;
  width: 90% !important;
  max-width: 650px;
}
.endgame-dialog {
  border: 2px solid #22c99b;
  border-radius: 10px !important;
  width: 90% !important;
  max-width: 650px;
  background-color: #1e6942 !important;
  color: #ffffff;
}
.endgame-dialog .el-dialog__title {
  color: #ffffff;
  font-weight: bold;
}
.endgame-container {
  color: #ffffff;
  text-align: center;
}

@media only screen and (max-width: 575px) {
  .game-list {
    grid-template-columns: auto auto;
    padding: 10px;
    display: grid;
  }
  .on-cashout .game-banner img {
    width: 250px;
  }
  .game-item {
    width: 135px;
  }

  .game-welcom {
    width: 285px;
  }

}
span.version {
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  display: block;
  margin-top: 10px;
  line-height: 20px;
  margin-bottom: 10px;
}

a.logout-button {
  background-color: #1e6842;
  display: inline-block;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 5px;
  border: 2px solid #f4e7b0;
}
</style>
