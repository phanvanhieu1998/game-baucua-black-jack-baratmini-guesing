import request from "@/utils/request";

class BaucuaAPI {

	user_request_play_game(){
		return request({
			method: "post",
			params: {
				action: 'user_request_play_game',
				game_name:'bau_cua'
			}
			});
		}
		sendTipDealer(data){
			return request({
				method: "post",
				params: {
					action: 'user_send_tip',
				},
				data
				});
		}
		
		placeBet(data){
			return request({
				method: "post",
				params: {
					action:'bau_cua_place_bet',
				},
				data
				});
		}

}

const Baucua = new BaucuaAPI();
export { Baucua as default };
