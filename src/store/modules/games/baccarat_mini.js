import BaccaratMini from "@/api/baccarat-mini.api";
const sound_obj = require("@/store/baccarat-mini-sound.json");

const state = {
  balance: 0,
  game_match_time_game: 0,
  time_server: 0,
  game_info: {},
  gamer_match: {},
  gamer_place_bet_data: {
    banker: 0,
    banker_dragon: 0,
    player: 0,
    player_dragon: 0,
    tie: 0,
  },
  sound_obj: sound_obj,
  game_playing_id: null,
  disable_bet: false,
  result_table_data: [],
  win_lose: "",
  amount: 0,
  reset_balance: 0,
};

const mutations = {
  SET_GAME_TYPE_INFO: (state, info) => {
    state.game_info = info;
  },
  SET_GAMER_MATCH: (state, match) => {
    state.gamer_match = match;
  },
  SET_PLAYING_BET: (state, value) => {
    state.gamer_place_bet_data = value;
  },
  SET_GAME_PLAYING_ID: (state, id) => {
    state.game_playing_id = id;
  },
  SET_GAME_MATCH_TIME_GAME: (state, time_game) => {
    state.game_match_time_game = time_game;
  },
  SET_TIME_SERVER: (state, time_server) => {
    state.time_server = time_server;
  },
  SET_RESET_BET: (state, reset_bet) => {
    state.gamer_place_bet_data = reset_bet;
  },

  SET_RESULT_TABLE_DATA: (state, arr) => {
    state.result_table_data = arr;
  },
  SET_BALANCE: (state, balance) => {
    state.balance = balance;
  },
  SET_WIN_LOST: (state, win_lose) => {
    state.win_lose = win_lose;
  },
  SET_AMOUNT: (state, amount) => {
    state.amount = amount;
  },
  RESET_BALANCE: (state, data) => {
    state.reset_balance = data;
  },
};

const getters = {};
const actions = {
  pingGame({ commit, state }) {
    return new Promise((resolve, reject) => {
      BaccaratMini.pingGame()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  loadGameMatchData({ commit, state }) {
    return new Promise((resolve, reject) => {
      BaccaratMini.user_request_play_game()
        .then((response) => {
          commit("SET_GAME_TYPE_INFO", response.game_info);
          commit("SET_GAMER_MATCH", response.gamer_match);
          commit("SET_GAME_PLAYING_ID", response.game_playing_id);
          commit("SET_GAME_MATCH_TIME_GAME", response.game_match.time_game);
          commit("SET_TIME_SERVER", response.time_server);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  endGame({ commit, state }) {
    return new Promise((resolve, reject) => {
      BaccaratMini.endGame()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  sendTipDealer({ commit, state }, tip) {
    return new Promise((resolve, reject) => {
      let data = {
        tip_dealer: tip,
        game_playing_id: state.game_playing_id,
      };
      BaccaratMini.sendTipDealer(data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getGameBaccaratMiniResult({ commit, state }) {
    return new Promise((resolve, reject) => {
      let data = {
        game_playing_id: state.game_playing_id,
      };
      BaccaratMini.getGameBaccaratMiniResult(data)
        .then((response) => {
          //commit('SET_BALANCE',response.balance)
          if (
            response.game_playing.won_lost !== null &&
            response.game_playing.won_lost !== undefined
          ) {
            commit("SET_WIN_LOST", response.game_playing.won_lost.type);
            commit("SET_AMOUNT", response.game_playing.won_lost.amount);
          }

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  placeBet({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      BaccaratMini.placeBet(data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getTableResult({ commit, state }) {
    return new Promise((resolve, reject) => {
      BaccaratMini.getTableResult().then((response) => {
        //console.log('Get table result')
        if (response.table_result.length >= 84) {
          setTimeout(() => {
            commit("SET_RESULT_TABLE_DATA", response.table_result);
          }, 5000);
        } else {
          commit("SET_RESULT_TABLE_DATA", response.table_result);
        }
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
