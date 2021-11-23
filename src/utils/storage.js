import Cookies from "js-cookie";

const current_game_key_name = "9xac_current_game_name";

const tmp_balance = "9xac_tmp_balance";
const old_game_name_end = "9xac_old_game_name_end";
export default class StorageGame {
  static setCurrentGame(value) {
    return Cookies.set(current_game_key_name, value);
  }
  static getKey(user_id) {
    return `9xac_tmp_balance_${user_id}`;
  }
  static getCurrentGame() {
    return Cookies.get(current_game_key_name);
  }
  static removeCurrentGame() {
    return Cookies.remove(current_game_key_name);
  }

  static setTmpBalance(value, user_id) {
    return Cookies.set(StorageGame.getKey(user_id), value);
  }

  static getTmpBalance(user_id) {
    return Cookies.get(StorageGame.getKey(user_id));
  }

  static removeTmpBalance(user_id) {
    return Cookies.remove(StorageGame.getKey(user_id));
  }
  static setOldGame(value) {
    return Cookies.set(old_game_name_end, value);
  }

  static getOldGame() {
    return Cookies.get(old_game_name_end);
  }

  static removeOldGame() {
    return Cookies.remove(old_game_name_end);
  }
}
