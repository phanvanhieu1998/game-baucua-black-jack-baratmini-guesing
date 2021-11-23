import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PopConfirm from "@/components/modal/PopConfirm";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import translationsEn from "./store/en_lang";

const pusher_api_key = process.env.VUE_APP_PUSHER_API_KEY;
const pusher_cluster = process.env.VUE_APP_PUSHER_CLUSTER;

Vue.use(require("vue-pusher"), {
  api_key: pusher_api_key,
  options: {
    cluster: pusher_cluster,
    encrypted: true,
  },
});

Vue.component("PopConfirm", PopConfirm);
Vue.config.productionTip = false;
Vue.use(ElementUI);

import vuexI18n from "vuex-i18n";
Vue.use(vuexI18n.plugin, store);

Vue.i18n.add("en", translationsEn);
Vue.i18n.set("en");

//filter currency
Vue.filter("price", function (value, is_symbol) {
  let val = Number.parseFloat(value);
  let symbol = '$';

  if(typeof is_symbol === 'undefined')
    is_symbol = true

  if(!is_symbol){
    symbol = '';
  }

  //val = (val/1).toFixed(2).replace('.', ',')
  return symbol + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});


router.beforeEach((to, from, next) => {
  //console.log(from, to)

  if(to.name === 'PokerMainGame'){
    store.commit('poker/SET_MAIN_GAME', true);
  }else{
    store.commit('poker/SET_MAIN_GAME', false);
  }

  next();
})

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app_games");
