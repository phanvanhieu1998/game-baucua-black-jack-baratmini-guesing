import request from "@/utils/request";
import axios from "axios";

class PokerAPI {
  getTablesList(){
    return request({
      method: "post",
      params: {
        action: 'get_poker_game_tables',
      }
    });
  }

  user_request_play_game(game_name){
    return request({
      method: "post",
      params: {
        action: 'user_request_play_game',
      },
      game_name
    });
  }

  getChatHistory(table_id){
    const site_url = process.env.VUE_APP_SITE_URL;
    return axios.get(`${site_url}/wp-json/st-game/poker/chat/${table_id}`);
  }
}

const Poker = new PokerAPI();
export { Poker as default };
