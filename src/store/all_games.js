import axios from "axios";
const state = {

}

const mutations = {

}

const getters = {

}

const actions = {
  check_game_match_result: (context, game_match_id) => {
    return new Promise((resolve, reject) => {
      axios
        .post(context.rootState.ajax_url + "?action=check_game_match_result", {
          game_match_id: game_match_id,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};