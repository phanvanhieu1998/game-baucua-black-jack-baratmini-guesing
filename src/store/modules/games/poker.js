import Poker from "@/api/poker.api";
import axios from "axios";

const socket_url = process.env.VUE_APP_SOCKET_IO_URL;

const io = require("socket.io-client");
const socket = io(socket_url);
const _ = require('lodash')

socket.removeAllListeners();
/**
 * Vuex state
 */
const state = {
  devUser: '',

  screen_type: 'list',

  socket_url: socket_url,
  current_username: '',
  
  gameReady: false,

  sittingIn: false,
  myTimeLeft: 0,
  mySeat: null,
  myCards: [],
  game_tables_list: [],

  notifications: [{},{},{},{},{},{},{},{},{},{}],
  readyPlayerTimer: [0,0,0,0,0,0,0,0,0,0],
  actionPlayerTimer: [0,0,0,0,0,0,0,0,0,0],
  actionState: '',
  lobbyTables: [],
  isMainGame: false,
  socket: socket,
  current_table_info: {},
  sittingOnTable: null,

  current_table_data: {},

  readyTimeerVisibility: false,
  actionTimeerVisibility: false,

  tableChatList: [],
  pot_amount:null
};

/**
 * Vuex mutations
 */
const mutations = {
  SET_DEV_USER: (state, user) => {
    state.devUser = user;
  },

  SET_POT_AMOUNT:(state, amount) => {
    state.pot_amount = amount;
  },

  SET_GAME_READY: (state, status) => {
    state.gameReady = status;
  },

  SET_MY_TIME_LEFT: (state, timeleft) => {
    state.myTimeLeft = timeleft
  },

  SET_ACTION_STATE: (state, action) => {
    state.actionState = action;
  },

  SET_SITTING_ON_TABLE: (state, table_id) => {
    state.sittingOnTable = table_id
  },

  SET_MY_SEAT: (state, position) => {
    state.mySeat = position
  },

  SET_MY_CARDS: (state, cards) => {
    state.myCards = cards
  },

  SET_SCREEN_TYPE: (state, type) => {
    state.screen_type = type;
  },

  SET_CURRENT_USERNAME: (state, username) => {
    state.current_username = username;
  },

  SET_LOBBY_TABLES: (state, tables) => {
    state.lobbyTables = tables;
  },

  SET_SITTING_IN: (state, status) => {
    state.sittingIn = status;
  },

	SET_GAME_TABLE_LIST: (state, list) => {
    state.game_tables_list = list
  },

  SET_MAIN_GAME: (state, payload) => {
    state.isMainGame = payload
  },

  SET_CURRENT_TABLE_INFO_GAME: (state, game_id) => {
    if(game_id === 0){
      state.current_table_info = {};
    }

    game_id = parseInt(game_id);
    let game = _.chain(state.lobbyTables).filter(function (g) { return g.id === game_id }).first().value();
    state.current_table_info = game;
  },

  SET_CURRENT_TABLE_DATA: (state, table_data) => {
    state.current_table_data = table_data;
  },

  SET_READY_TIMEER_VISIBILITY: (state, status) => {
    state.readyTimeerVisibility = status;
  },

  SET_ACTION_TIMEER_VISIBILITY: (state, status) => {
    state.actionTimeerVisibility = status;
  },

  SET_TABLE_CHAT_LIST: (state, list) => {
    state.tableChatList = list;
  },

  SET_READY_PLAYER_TIMER: (state, arr) => {
    state.readyPlayerTimer = arr;
  },

  SET_ACTION_PLAYER_TIMER: (state, arr) => {
    state.actionPlayerTimer = arr;
  }
};

/**
 * Vuex getters
 */
const getters = {
  tableChatListOk(state){
    return _.orderBy(state.tableChatList, ['id'],['asc']);
  },

  totalBet(state){
    let totalBet = 0;

    if(_.isEmpty(state.current_table_data))
      return totalBet;
    
    if(state.current_table_data.playersSeatedCount < 2)
      return 0;

    let seats = state.current_table_data.seats;

    seats.forEach( seat => {
      if(seat !== null || !_.isEmpty(seat)){
        totalBet = totalBet + parseFloat(seat.bet);
      }
    });
console.log(totalBet)
    return totalBet;
  }
};

/**
 * Vuex actions
 */
const actions = {
  getGameTables({state, commit}){
    return new Promise((resolve, reject) => {
      Poker.getTablesList().then( response => {
        let game_tables = []
        response.game_tables.forEach((e)=>{
          for (const [key, value] of Object.entries(e)) {
            if(key !== 'name' && key !== 'created_at' && key !== 'settings'){
              e[key] = parseInt(value);
            }
        }
        game_tables.push(e)
        })

     

        commit('SET_GAME_TABLE_LIST',game_tables)
        // console.log('v',game_tables)
        
        resolve(response);
       
      }).catch( error => {
        reject(error);
      });
    });
  },

  getLobbyTables({state, commit}){
    return new Promise((resolve, reject) => {
      axios.get(state.socket_url+'/lobby-data')
        .then((response) => {
          let tables = [];

          response.data.forEach( table => {
            if(table !== null) tables.push(table);
          });

          commit('SET_LOBBY_TABLES', tables);
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },


  getTableData({state, commit}, table_id){
    return new Promise((resolve, reject) => {
      axios.get(state.socket_url+'/table-data/'+table_id)
        .then((response) => {
          commit('SET_CURRENT_TABLE_DATA', response.data.table)
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },


  getHistoryChat({commit}, table_id){
    return new Promise((resolve, reject) => {
      Poker.getChatHistory(table_id).then( response => {
        let list = response.data.chat_list || [];
        commit('SET_TABLE_CHAT_LIST', list);
        resolve(response.data);
      }).catch((error) => reject(error));
    });
  },

  addNewChat({state, commit}, msg){
    let list = state.tableChatList;
    list.push(msg);
    commit('SET_TABLE_CHAT_LIST', list);
  }

  // user_request_play_game({state, commit},game_name){
  //   return new Promise((resolve, reject) => {
  
  //     Poker.user_request_play_game(game_name).then( response => {
  //       console.log(game_name)
        
  //       resolve(response);
       
  //     }).catch( error => {
  //       reject(error);
  //     });
  //   });
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
