import axios from "axios";
const state = {
  gamer_place_bet_data: {
    main: 0,
    match: 0,
  },
  game_info: {},
  game_active: false,
  game_match_info: {},
  game_playing_id: null,
  gamer_match: {},
  disable_bet: false,
  result_match:null,
  blance_match:0,
  game_save:{},
  game_match_id:0,
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
    if(state.game_match_info === null)
      return;
      
    state.game_match_info.lock_status = status;
  },

  SET_GAMER_MATCH: (state, match) => {
    state.gamer_match = match;
  },

  SET_GAME_ACTIVE: (state, status) => {
    state.game_active = status;
  },
  SET_SAVE_GAME_ACTIVE: (state, status) => {
    state.save_game_active = status;
  },
  
  SET_SAVE_GAME: (state, game_save) => {
    state.game_save = game_save;
  },
  UPDATE_SEAT: (state) => {
    state.gamer_match.seat = "1";
  },
  
  SET_GAME_MATCH_ID: (state,game_match_id) => {
    state.game_match_id = game_match_id;
  },

  RESET_CURRENT_BET: (state) => {
    state.gamer_place_bet_data = {
      main: 0,
      match: 0,
    };
  },

  SET_DISABLE_BET: (state, status) => {
    state.disable_bet = status;
  },
  SET_RESULT_MATCH: (state, result_match) => {
    state.result_match = result_match;
  },
  SET_BALANCE_MATCH: (state, blance_match) => {
    state.blance_match = blance_match;
  },
};

const actions = {
  loadGameMatchData: (context) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=load_black_jack_game_math")
        .then((response) => {
          //console.log(response.data.game_active);
          context.commit("SET_GAME_ACTIVE", response.data.game_active);
       
          
          context.commit("SET_GAME_PLAYING_ID", response.data.game_playing_id);
          context.commit("SET_GAME_TYPE_INFO", response.data.game_info);
          context.commit("SET_GAME_MATCH_INFO", response.data.game_match_info);
          context.commit("SET_GAMER_MATCH", response.data.gamer_match);

          if (response.data.gamer_match !== null && response.data.gamer_match.place_bet !== null) {
            context.commit(
              "SET_PLAYING_BET",
              JSON.parse(response.data.gamer_match.place_bet)
            );
          }

          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

  bj_place_bet: (context,data) => {
   
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=bj_place_bet",data )
        .then((response) => {
          resolve(response);
          context.commit("SET_GAME_MATCH_ID", response.data.game_match.game_match_id);
       
          context.commit("SET_BALANCE_MATCH",response.data.user_points );
          if(response.data.game_match.match_data.player[0].result_match){
            context.commit("SET_RESULT_MATCH", response.data.game_match.match_data.player[0].result_match);
          
          }
         
        })
        .catch((error) => reject(error));
    });
  },
  
  loadData: (context,data) => {
 
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=user_request_play_game" ,data)
        .then((response) => {
          context.commit("SET_SAVE_GAME", response);
          resolve(response);
         
        })
        .catch((error) => reject(error));
    });
  },
  bj_control: (context,data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=bj_control",data )
        .then((response) => {
         
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },


  sendTipDealer: (context, tip) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=bj_user_send_tip", {
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
          game_name: "black_jack",
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

  sendMessage: (context, message) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=user_send_message", {
          content_message: message,
          game_playing_id: context.state.game_playing_id,
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
