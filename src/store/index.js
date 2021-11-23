//Main Store
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import StorageGame from "@/utils/storage";
Vue.use(Vuex);
Vue.use(VueAxios, axios);
Vue.use(require("vue-moment"));

import MainStore from "@/api/main-store.api";

import all_games from "@/store/all_games";
import baccarat from "@/store/modules/games/baccarat";
import baccarat_mini from "@/store/modules/games/baccarat_mini";
import black_jack from "@/store/modules/games/black_jack";
import baucua from "@/store/modules/games/baucua";
import living_betting from "@/store/modules/games/living_betting";
import guessing from "@/store/modules/games/guessing";
import poker from "@/store/modules/games/poker";

const site_url = process.env.VUE_APP_SITE_URL;

export default new Vuex.Store({
  state: {
    name: "9Xac Game",
    resourceUrl: "https://media.huzhop.com/9xac",
    user_id: 0,
    WP_THEME_APP_URL:
      process.env.NODE_ENV === "development"
        ? "/"
        : `${site_url}/wp-content/themes/nine-xac/app/`,
    group_chat_url: `${site_url}/group-chat/`,
    ajax_url: `${site_url}/ajax.php`,
    isLoggedIn:
      typeof APP_USER_LOGGEDIN === "undefined" || APP_USER_LOGGEDIN === 0
        ? false
        : true,

    user_name: "",
    user_info: {},
    balance: 0,
    game_list: [],

    current_game_name: StorageGame.getCurrentGame()
      ? StorageGame.getCurrentGame()
      : "",

    cashier: {
      credit: 0,
      withdrawal: 0,
      cashout: 0,
    },
  },

  mutations: {
    setUserId: (state, userId) => {
      state.user_id = userId;
    },
    setUserLogin: (state, status) => {
      state.isLoggedIn = status;
    },

    SET_USER_INFO: (state, info) => {
      state.user_info = info;
    },

    SET_USER_NAME: (state, name) => {
      state.user_name = name;
    },

    SET_CURRENT_GAME_NAME: (state, game_name) => {
      state.current_game_name = game_name;
     
    },

    SET_BALANCE: (state, value) => {
      state.balance = value;
    },

    SET_GAME_LIST: (state, list) => {
      state.game_list = list;
    },

    SET_CASHIER: (state, obj) => {
      state.cashier = obj;
    },
  },

  getters: {},

  actions: {
    get_cash_out_info({ commit, state }) {
      return new Promise((resolve, reject) => {
        MainStore.get_cash_out_info()
          .then((response) => {
            commit("SET_CASHIER", response.cashier);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    user_cash_out({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        MainStore.user_cash_out(data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    appLoad: ({ state, commit }) => {
      return new Promise((resolve, reject) => {
        axios
          .post(state.ajax_url + "?action=app_load", {
            action: "app_load",
          })
          .then(function(response) {
            commit("SET_BALANCE", response.data.balance_total);
            commit("SET_USER_NAME", response.data.user_name);
            commit("SET_GAME_LIST", response.data.game_list);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },

    login: ({ state }, data) => {
      return new Promise((resolve, reject) => {
        data = Object.assign({}, { action: "do_login" }, data);

        axios
          .post(state.ajax_url + "?action=do_login", data)
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },

    onVerify: (context, data) => {
      return new Promise((resolve, reject) => {
        axios
          .post(context.state.ajax_url + "?action=verify_phone_number", {
            action: "verify_phone_number",
            phone: data.phone,
            code: data.code,
          })
          .then((response) => {
            if (!response.data.errors) {
              context.commit("setUserLogin", true);
              context.commit("SET_BALANCE", response.data.balance_total);
              context.commit("SET_USER_NAME", response.data.user_name);
            }
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    joinGame: ({ state, commit }, game_name) => {
      console.log('game gi day',game_name)
      return new Promise((resolve, reject) => {
        axios
          .post(state.ajax_url + "?action=user_request_play_game", {
            action: "user_request_play_game",
            game_name: game_name,
          })
          .then((response) => {
            if(response.data.errors == false){
              resolve(response);
            }else{
              alert(response.data.message)
            }
            
            
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    cancelJoinGame: ({ state, commit }, gameId) => {
      return new Promise((resolve, reject) => {
        axios
          .post(state.ajax_url + "?action=cancel_request_play_game", {
            action: "cancel_request_play_game",
            request_id: gameId,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    userQuitGame: (context, gameId) => {
      return new Promise((resolve, reject) => {
        axios
          .post(context.state.ajax_url + "?action=user_quit_game", {
            action: "user_quit_game",
            game_playing_id: gameId,
          })
          .then((response) => {
            StorageGame.removeCurrentGame();
            StorageGame.removeTmpBalance(context.state.user_id);
            context.commit("SET_CURRENT_GAME_NAME", "");
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    loadUserInfo: (context) => {
      return new Promise((resolve, reject) => {
        axios
          .post(context.state.ajax_url + "?action=load_user_info", {
            action: "load_user_info",
          })
          .then((response) => {
            context.commit("SET_USER_INFO", response.data.user_info);
            context.commit("SET_BALANCE", response.data.user_info.balance);
            context.commit("setUserId", parseInt(response.data.user_info.ID));
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    userPing: (context) => {
      if (!context.state.current_game_name) return;
      if (context.state[context.state.current_game_name] === undefined) return;

      return new Promise((resolve, reject) => {
        axios
          .post(context.rootState.ajax_url + "?action=user_game_ping", {
            action: "user_game_ping",
            game_playing_id:
              context.state[context.state.current_game_name].game_playing_id,
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
  },

  modules: {
    all_games,
    baccarat,
    baccarat_mini,
    black_jack,
    baucua,
    living_betting,
    guessing,
    poker
  },
});
