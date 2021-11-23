import axios from "axios";


const data = require("@/components/games/guessing/data");

const state = {
  time_has_passed: 0,

  game_timeleft: 0,
  setting_for_user: {},
  history_game: [],
  pending_game: [],
  game_list: [],
  game_list1: [],
  selectedValue: [],
  selected_games_values: [],
  game_info: {},
  typeCurrenDefault: false,
  isLock: false,
  currentGame: "",
  value_bet_game: [],

  filter_type: 'full',

  options: {
    full: {
      label: "FULL",
      opts: {
        value1: 10,
        value2: 5,
        value3: 10,
        value4: 5,
      },
    },
    n1st_half: {
      label: "1ST HALF",
      opts: {
        value1: 10,
        value2: 5,
        value3: 10,
        value4: 5,
      },
    },
    n2nd_half: {
      label: "2ND HALF",
      opts: {
        value1: 10,
        value2: 5,
        value3: 10,
        value4: 5,
      },
    },
    qlines: {
      label: "QLINES",
      opts: {
        value1: 10,
        value2: 5,
        value3: 10,
        value4: 5,
      },
    },
  },
  valueBet: {
    single: 0,
    ar: 0,
    teaser: 0,
    parlay: 0,
  },
};

const mutations = {
  SET_FILTER_GAME_TYPE: (state, type) => {
    state.filter_type = type
  },

  SET_TIME_HAS_PASSED: (state, time_total) => {
    state.time_has_passed = time_total
  },

  SET_FILTER_GAME: (state, listGame) => {
    state.game_list = listGame;
    // if (listGame == "") {
    //   state.game_list = state.game_list1;
    //   return;
    // }
    // let gameFilter = [];
    // state.game_list1.forEach((e) => {
    //   console.log('ddd',listGame)
    //   if (e.type == listGame) {
    //     gameFilter.push(e);
    //   }
    // });
    // state.game_list = gameFilter;
  },
  SET_SELECTED_VALUE: (state, data) => {
    if (state.selectedValue.length < 4) {
      state.selectedValue.push(data);
    }
    
  },
  
  SET_ID: (state, data) => {
  
   
    const index = state.pending_game.findIndex(
      (e) =>
        e.ID == data.game_playing.id
      
    );
    
    state.pending_game.splice(index, 1);
  },

  SET_GAME_SELECTED_VALUES: (state, list) => {
    state.selected_games_values = list;
  },

  SET_ISLOCK: (state, data) => {
    state.isLock = data;
  },
  SET_TYPE_GAME: (state, data) => {
    state.typeCurrenDefault = data;
  },
  SET_GAME_LIST: (state, data) => {
    state.game_list = data
    // data.forEach((e)=>{
    //   if(e.type == 'full'){
    //     state.game_list.push(e);
    //   }
    // })
   
  },
    SET_GAME_LIST1: (state, data) => {
      state.game_list1 = data;
    },
    SET_CLEAR_ALL: (state, data) => {
      state.selectedValue = data;
    },
    SET_VALUE_BET: (state, data) => {
      state.valueBet = data;
    },
    SET_GAME_INFO: (state, info) => {
      state.game_info = info;
    },

  SET_GAME_HISTORY: (state, data) => {
    state.history_game = data;
  },
  SET_GAME_PENDING: (state, data) => {
    state.pending_game = data;
  },
  SET_UNSHIFT: (state, data) => {
    state.pending_game.unshift(data);
  },
  SET_SETTING_FOR_USER: (state, data) => {
    state.setting_for_user = data;
  },
  SET_VALUE_BET_GAME: (state, data) => {
    if (data.length == 0) {
      state.value_bet_game = data;
      return;
    }
    if (state.value_bet_game.length < 4) {
      
     let checkLength = _.filter(state.value_bet_game, function(o) { return data.id == o.id && data.key == o.key });
      if(checkLength.length === 0){
        state.value_bet_game.push(data);
      }
      
    }
    console.log('xxx')
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
  loadData: (context) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=guessing_load_game_data")
        .then((response) => {
          resolve(response);
          context.commit("SET_GAME_LIST", response.data.games_active);
          //context.commit("SET_GAME_LIST1", response.data.games_active);
          context.commit("SET_GAME_HISTORY", response.data.history_game);
          context.commit("SET_GAME_PENDING", response.data.pending_game);
          if (response.data.setting_for_user) {
            context.commit(
              "SET_SETTING_FOR_USER",
              response.data.setting_for_user
            );
          } else {
            context.commit(
              "SET_SETTING_FOR_USER",
              response.data.game_info.config
            );
          }
        })
        .catch((error) => reject(error));
    });
  },

  placeBet: (context, data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          context.rootState.ajax_url + "?action=guessing_place_bet",

          data
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },

  deleteResult: (context, data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
      axios
        .post(
          context.rootState.ajax_url + "?action=guessing_del_history_game",

          data
        )
        .then((response) => {
          resolve(response);
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
        .post(
          context.rootState.ajax_url + "?action=guessing_user_send_tip",
          data
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },
};

const getters = {

  game_list_filter(state){
    //Order game by time left
    let list = _.sortBy(state.game_list, ['timeleft']);
    return list;
    // if(state.filter_type === 'all' || state.filter_type === '')
    //   return state.game_list;
    // return state.game_list.filter( g => g.type === state.filter_type)
  },

  fullTotal(state){
    return state.game_list.filter( g => g.type === 'full').length;
  },

  n1stHalfTotal(state){
    return state.game_list.filter( g => g.type === 'n1st_half').length;
  },

  n2ndHalfTotal(state){
    return state.game_list.filter( g => g.type === 'n2nd_half').length;
  },

  qLinesTotal(state){
    return state.game_list.filter( g => g.type === 'qlines').length;
  },

  gamesTotal(state, getters){
    return {
      full: getters.fullTotal,
      n1st_half: getters.n1stHalfTotal,
      n2nd_half: getters.n2ndHalfTotal,
      qlines: getters.qLinesTotal,
    }
  }

  // initBettings(state) {
  //   let options = {};
  //   for (const [key, opt] of Object.entries(state.options)) {
  //     let option = {};
  //     for (const [_key, val] of Object.entries(opt.opts)) {
  //       option[_key] = 0;
  //     }
  //     options[key] = option;
  //   }
  //   options.id = state.currentID;
  //   return options;
  // },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
