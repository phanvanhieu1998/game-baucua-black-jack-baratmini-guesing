import axios from "axios";
const example_data = require("@/components/games/living_betting/data-example");
const guide_play = require("@/components/games/living_betting/guide-play");

const state = {
  options: {
    possession: {
      label: "POSSESSION",
      opts: {
        td: "TD",
        fg: "FG",
        punt: "PUNT",
      },
    },
    n3rd_down: {
      label: "3RD DOWN",
      opts: {
        yes: "YES",
        no: "NO",
      },
    },
    red_zone: {
      label: "RED ZONE",
      opts: {
        rushing: "RUSHING TD",
        passing: "PASSING TD",
      },
    },
  },

  bettings_data: {},
  guide_play: guide_play,
  // game_list: example_data,
  game_list: [],
  game_list_place_bet: [],
  game_selected: {},
  game_timeleft: 0,
  game_timer: null,
  doneGame: [],
  game_info: {},
  currentID: 0,
  currentKey: "",
};

const mutations = {
  SET_GAME_LIST: (state, data) => {
    state.game_list = data;
  },

  SET_DELETE: (state, index) => {
    state.doneGame.splice(index, 1);
  },
  SET_GAME_INFO: (state, config) => {
    state.game_info = config;
  },
  SET_CURRENT_ID: (state, id) => {
    state.currentID = id;
  },
  SET_CURRENT_KEY: (state, key) => {
    state.currentKey = key;
  },

  SET_ID: (state, data) => {
    const index = state.game_list_place_bet.findIndex(
      (e) => e.game_lb_playing_id == data.id
    );
    if (state.game_list_place_bet[index] != undefined) {
      let a = state.game_list_place_bet[index].type;
      let b = state.game_list_place_bet[index].title;

      data.type = a;
      data.title = b;
    }

    state.doneGame.unshift(data);

    state.game_list_place_bet.splice(index, 1);
  },

  SET_GAME_LIST_PLACE_BET: (state, data) => {
    state.game_list_place_bet.unshift(data);
  },

  SET_BETTINGS_DATA: (state, payload) => {
    state.bettings_data = payload;
  },

  SET_GAME_SELECTED: (state, game) => {
    state.game_selected = game;
  },
  SET_HISTORY: (state, history) => {
    state.doneGame = history;
  },
  SET_PENDING_GAME: (state, pending) => {
    state.game_list_place_bet = pending;
  },

  SET_GAME_TIMELEFT: (state, timeleft) => {
    state.game_timeleft = timeleft;

    const start = () => {
      state.game_timer = setInterval(function() {
        if (state.game_timeleft > 0) {
          state.game_timeleft--;
        } else {
          stop();
          // state.game_selected = {};
          // state.game_timeleft = 0;
          // state.game_timer = null;
        }
      }, 1000);
    };

    const stop = () => {
      clearInterval(state.game_timer);
      state.game_timer = null;
    };

    if (state.game_timer !== null) {
      stop();
      start();
    } else {
      start();
    }
  },
};

const actions = {
  placeBet: (context, data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          context.rootState.ajax_url + "?action=place_bet_lb",

          data
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },
  deleteHistory: (context, data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          context.rootState.ajax_url + "?action=del_history_game",

          data
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },
  loadData: (context) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=load_lb_game_data")
        .then((response) => {
          resolve(response);

          context.commit(
            "SET_GAME_INFO",
            response.data.game_info.config.config
          );

          context.commit("SET_GAME_LIST", response.data.list_games_active);
          context.commit("SET_HISTORY", response.data.history);
          context.commit("SET_PENDING_GAME", response.data.pending_game);
        })
        .catch((error) => reject(error));
    });
  },
  sendTipDealer: (context, tip) => {
    return new Promise((resolve, reject) => {
      let data = {
        tip_dealer: tip,
      };

      axios
        .post(context.rootState.ajax_url + "?action=user_send_tip_lb", data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },
};

const getters = {
  initBettings(state) {
    let options = {};

    for (const [key, opt] of Object.entries(state.options)) {
      let option = {};
      for (const [_key, val] of Object.entries(opt.opts)) {
        option[_key] = 0;
      }

      options[key] = option;
    }
    options.id = state.currentID;

    return options;
  },
  filterGamePending(state) {
    let bettings = "";

    state.game_list.forEach((item) => {
      if (item.id == state.currentID) {
        let key = state.currentKey;
        console.log("key", key);
        console.log("value", item.settings[key]);
        bettings = {
          [key]: item.settings[key],
        };
      }
    });
    return bettings;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
