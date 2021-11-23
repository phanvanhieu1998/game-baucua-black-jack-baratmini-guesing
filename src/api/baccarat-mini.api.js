import request from "@/utils/request";

class BaccaratMiniAPI {
  pingGame() {
    return request({
      method: "post",
      params: {
        action: 'user_game_baccarat_mini_ping'
      }
    });
  }
  user_request_play_game(){
	return request({
		method: "post",
		params: {
		  action: 'user_request_play_game',
		  game_name:'baccarat_mini'
		}
	  });
  }
  sendTipDealer(data){
	return request({
		method: "post",
		params: {
		  action: 'send_tip_dealer',
		},
		data
	  });
  }
  getGameBaccaratMiniResult(data){
	return request({
		method: "post",
		params: {
		  action: 'get_game_baccarat_mini_result',
		},
		data
	  });
  }

  placeBet(data){
	return request({
		method: "post",
		params: {
		  action: 'baccarat_mini_place_bet',
		},
		data
	  });
  }

  endGame(){
    return request({
			method: "post",
			params: {
				action: 'new_game_baccarat_mini',
			},
		});
  }
	
  getTableResult(){
    return request({
			method: "post",
			params: {
				action: 'baccarat_mini_update_table_result',
			},
		});
  }

  get_cash_out_info(){
    return request({
        method: "post",
        params: {
          action: 'get_cash_out_info',
        },
      });
  }

  user_cash_out(data){
    return request({
      method: "post",
      params: {
        action: 'user_cash_out',
      },
			data
    });
  }

}

const BaccaratMini = new BaccaratMiniAPI();
export { BaccaratMini as default };
