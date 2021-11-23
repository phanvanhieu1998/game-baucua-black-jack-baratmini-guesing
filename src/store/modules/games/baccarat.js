import axios from "axios";
const state = {
  gamer_place_bet_data: {
    banker: 0,
    banker_dragon: 0,
    player: 0,
    player_dragon: 0,
    tie: 0,
  },
  game_active: false,
  game_info: {},
  gamer_match: {},
  game_match_info: {},
  game_playing_id: null,
  
  game_table_length: {
    table1: {
      row: 13,
      col: 75,
    },
    table2: {
      row: 6,
      col: 75,
    },
  },
  game_table_1: [],
  game_table_2: [],
  disable_bet: false,
};

const mutations = {
  SET_PLAYING_BET: (state, value) => {
    state.gamer_place_bet_data = value;
  },

  SET_GAME_PLAYING_ID: (state, id) => {
    state.game_playing_id = id;
  },

  SET_GAME_TYPE_INFO: (state, info) => {
    state.game_info = info;
  },

  SET_GAME_MATCH_INFO: (state, info) => {
    state.game_match_info = info;
  },

  SET_LOCK_GAME_MATCH: (state, status) => {
    state.game_match_info.lock_status = status;
  },

  SET_GAMER_MATCH: (state, match) => {
    state.gamer_match = match;
  },
  SET_GAME_ACTIVE: (state, status) => {
    state.game_active = status;
  },
  UPDATE_SEAT: (state) => {
    state.gamer_match.seat = "1";
  },

  RESET_CURRENT_BET: (state) => {
    state.gamer_place_bet_data = {
      banker: 0,
      banker_dragon: 0,
      player: 0,
      player_dragon: 0,
      tie: 0,
    };
  },
  SET_DISABLE_BET: (state, status) => {
    state.disable_bet = status;
  },
};

const getters = {
  isLock: (state) => {
    if (state.game_match_info === null) return false;

    return state.game_match_info?.lock_status === 1 ||
      state.game_match_info?.lock_status === "1"
      ? true
      : false;
  },

  isClose: (state) => {
    if (state.game_match_info === null) return false;

    return state.game_match_info?.status === 0 ||
      state.game_match_info?.status === "0"
      ? true
      : false;
  },

  game_match_table: (state) => {
    let game_match = state.game_match_info;
    let table_data =
      game_match.table_data !== undefined
        ? JSON.parse(game_match.table_data)
        : {};
    return table_data;
  },

  initGameTable1: (state, getters) => {
    let tableData = [];
    let table_data = getters.game_match_table?.table1;

    for (let i = 0; i < state.game_table_length.table1.row; i++) {
      tableData[i] = [];

      for (let j = 0; j < state.game_table_length.table1.col; j++) {
        tableData[i][j] = table_data !== undefined ? table_data[i][j] : "";
      }
    }

    return tableData;
  },

  initGameTable2: (state, getters) => {
    let tableData = [];
    let table_data = getters.game_match_table?.table2;

    for (let i = 0; i < state.game_table_length.table2.row; i++) {
      tableData[i] = [];

      for (let j = 0; j < state.game_table_length.table2.col; j++) {
        tableData[i][j] = table_data !== undefined ? table_data[i][j] : "";
      }
    }

    return tableData;
  },
};
const actions = {
  loadGameMatchData: (context) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=load_baccarat_game_math", {
          action: "load_baccarat_game_math",
        })
        .then((response) => {
          context.commit("SET_GAME_ACTIVE", response.data.game_active);
          context.commit("SET_GAME_PLAYING_ID", response.data.game_playing_id);
          context.commit("SET_GAME_TYPE_INFO", response.data.game_info);
          context.commit("SET_GAME_MATCH_INFO", response.data.game_match_info);
          context.commit("SET_GAMER_MATCH", response.data.gamer_match);
          console.log(response.data.gamer_match);
          if (
            response.data.gamer_match !== null &&
            response.data.gamer_match.place_bet !== null
          ) {
            context.commit(
              "SET_PLAYING_BET",
              JSON.parse(response.data.gamer_match.place_bet)
            );
          }
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },

  placeBet: (context) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=baccarat_place_bet", {
          action: "baccarat_place_bet",
          place_bet: state.gamer_place_bet_data,
          game_playing_id: context.state.game_playing_id,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },

  sendTipDealer: (context, tip) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=send_tip_dealer", {
          action: "send_tip_dealer",
          game_playing_id: context.state.game_playing_id,
          tip_dealer: tip,
        })
        .then((response) => {
          resolve(response);
		 
        })
        .catch((error) => reject(error));
    });
  },

  openSeat: (context) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=user_update_seat_status", {
          game_playing_id: context.state.game_playing_id,
          game_name: "baccarat",
        })
        .then((response) => {
          context.commit("UPDATE_SEAT");
          resolve(response);
        })
        .catch((error) => {
          reject(error);
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
