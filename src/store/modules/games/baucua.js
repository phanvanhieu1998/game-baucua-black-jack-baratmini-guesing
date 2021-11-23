import Baucua from "@/api/baucua";
const sound_obj = require('@/store/baccarat-mini-sound.json')

const state = {

	sound_obj : sound_obj,
	listIconPlaceBet:{
		nai:0,
		tom:0,
		ca:0,
		bau:0,
		ga:0,
		cua:0
	},
	game_info: {},
	result:[],
	won_lost:0,
	amount:0,
	totalMoney:0
};

const mutations = {
	SET_GAME_INFO:(state,data) => state.game_info = data,
	SET_LIST_ICOM_PLACE_BET:(state,data) => state.listIconPlaceBet = data,
	SET_RESULT:(state,data) => state.result = data,
	SET_WIN_LOST:(state,data) => state.won_lost = data,
	SET_AMOUNT:(state,data) => state.amount = data,
	SET_TOTAL_MONEY:(state,data) => state.totalMoney = data

};

const getters = {
  
};
const actions = {

  loadGameMatchData({ commit, state }) {
    return new Promise((resolve, reject) => {
      Baucua.user_request_play_game().then((response) => {
				commit('SET_GAME_INFO',response.game_info)
		    resolve(response)
			
      }).catch((error) => {
        reject(error);
      });
    });
  },

  sendTipDealer({ commit, state },tip) {
    return new Promise((resolve, reject) => {
			
		let data = {
			game_name:state.game_info.name,
			tip_dealer:tip
		}
		Baucua.sendTipDealer(data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  placeBet({ commit, state },data) {
    return new Promise((resolve, reject) => {
      Baucua.placeBet(data)
        .then((response) => {
					commit('SET_RESULT',response.result)
				if(response.won_lost !== null && response.won_lost !== undefined ){
					commit('SET_WIN_LOST',response.won_lost.type)
					commit('SET_AMOUNT',response.won_lost.amount)
				}
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
