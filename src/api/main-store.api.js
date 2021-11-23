import request from "@/utils/request";

class MainStoreAPI {
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

const MainStore = new MainStoreAPI();
export { MainStore as default };