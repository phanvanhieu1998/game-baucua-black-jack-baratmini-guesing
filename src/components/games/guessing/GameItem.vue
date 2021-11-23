<template>
  <div
    v-if="timeleft > 0 && filter_type == game.type"
    :class="[`game-${game.type}`]"
    class="guessing-game-item"
    @click="selectGame"
  >
    <div disabled class="type__game">
      <el-row>
        <el-col :xs="24" class="type_game-label" :span="4"
          >{{ _label(game.type) }}:
        </el-col>

        <el-col :xs="24" :span="20">
          <el-row>
            <el-col :span="24">
              <div class="value__settings">
                <div style="display:flex">
                  <div
                    style="display:flex"
                    v-for="(value, key) in game.options_val"
                    :key="key"
                  >
                    <el-button
                      class="disabled"
                      :disabled="isLocked"
                      style="padding:0"
                      :class="[
                        `game-${game.type}`,
                        { current: isCurrentPick(key) },
                      ]"
                      @click="pickVal(key, value, game.id)"
                      >{{ value }}
                    </el-button>
                  </div>
                </div>
                <div class="minute">{{ timeleft | show_time }}</div>
              </div>
            </el-col>

            <el-col :span="4"></el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      current: "",
      typeCurrent: "",
      timeleft: 0,
      timer: null,
    };
  },

  filters: {
    show_time: function(value) {
      if (value <= 0) return "0.0";
      let totalSeconds = value;

      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;
      if (hours == 0 && minutes == 0) {
        return `${seconds} seconds`;
      }
      if (hours == 0) {
        return `${minutes} mins`;
      }
      if (minutes == 0) {
        return `${hours}h`;
      }
      return `${hours}h:${minutes}mins`;
    },
  },

  props: {
    game: {
      type: Object,
      default: () => {},
    },
  },

  mounted() {
    //this.timeleft = (this.game.timeleft / 60).toFixed(0);
    this.timeleft = this.game.timeleft;
    this.timer_start();
  },

  computed: {
    ...mapState({
      options: (state) => state.guessing.options,
      typeCurrenDefault: (state) => state.guessing.typeCurrenDefault,
      isLock: (state) => state.guessing.isLock,
      selected_games_values: (state) => state.guessing.selected_games_values,
      game_list: (state) => state.guessing.game_list,
      filter_type: (state) => state.guessing.filter_type,
    }),

    isLockk() {
      return this.isLock;
    },

    //Dùng để disable các game khác kiểu, vì rules của game chỉ có thể chọn được các game cùng kiểu
    isLocked() {
      let _this = this;
      let pickedGame = this.selected_games_values;

      let find = _.filter(pickedGame, (g) => {
        return g.game.type === _this.game.type;
      });

      return find.length === 0 && pickedGame.length > 0 ? true : false;
    },
  },

  methods: {
    timer_start() {
      let _this = this;
      if (this.timer !== null) return;
      this.timer = setInterval(function() {
        if (_this.timeleft > 0) {
          _this.timeleft--;
          _this.game.timeleft = _this.timeleft;
        } else if (_this.timeleft == 0) {
          _this.timer_stop();
          _this.remove_game_expired();
        }
      }, 1000);
    },

    timer_stop() {
      clearInterval(this.timer);
      this.timer = null;
      // let selected_games_values = this.selected_games_values;

      // const index = selected_games_values.findIndex(
      //   (e) => e.id == this.game.id
      // );

      // selected_games_values.splice(index, 1);
      // this.$store.commit(
      //   "guessing/SET_GAME_SELECTED_VALUES",

      //   selected_games_values
      // );
    },

    //Chỉ xóa những game hết hạn vẫn giữa lại game còn thời gian
    remove_game_expired() {

      let selected_games_values = this.selected_games_values;
      let _this = this;

      let indexs = [];
      _.filter(selected_games_values, (_g, index) => {
        if (_g.game.id === _this.game.id && _this.timeleft === 0) {
          indexs.push(index);
        }
        return indexs;
      });

      for (var i = indexs.length - 1; i >= 0; i--)
        selected_games_values.splice(indexs[i], 1);
     
      this.$store.commit(
        "guessing/SET_GAME_SELECTED_VALUES",
        selected_games_values
      );

      let game_list = _.filter(this.game_list, function(g) {
        return g.id !== _this.game.id;
      });
      console.log(_this.game.id);
      this.$store.commit("guessing/SET_GAME_LIST", game_list);   
      this.$emit('check_game_expired',_this.game.id)
    },

    isCurrentPick(val_key) {
      let _this = this;
      let selected_games_values = this.selected_games_values;
      let find = _.filter(selected_games_values, (g) => {
        return g.val_key === val_key && g.game.id === _this.game.id;
      });
      return find.length > 0 ? true : false;
    },

    _label(key) {
      let label = this.options[key].label;

      return label;
    },

    //Xử lý việc pick chọn, chọn một giá trị trong một game bất kỳ
    //Và không được chọn lại giá trị đã pick
    pickVal(val_key, value, id) {
      this.$emit('clear__value',true)
      let a = {
        id: id,
        key: val_key,
        val: value,
      };
      this.$store.commit("guessing/SET_VALUE_BET_GAME", a);

      let _this = this;

      let obj = {
        val_key: val_key,
        game: this.game,
      };

      let selected_games_values = this.selected_games_values;
      let find = _.filter(selected_games_values, (g) => {
        return g.val_key === val_key && g.game.id === _this.game.id;
      });

      if (find.length === 0 && selected_games_values.length < 4)
        selected_games_values.push(obj);

      this.$store.commit(
        "guessing/SET_GAME_SELECTED_VALUES",
        selected_games_values
      );
    },

    //Will remove
    selectedValue(typeGame, selectedValue, key) {
      this.current = key;
      this.typeCurrent = typeGame;

      this.$store.commit("guessing/SET_SELECTED_VALUE", selectedValue);
      this.$store.commit("guessing/SET_ISLOCK", true);
      this.$store.commit("guessing/SET_TYPE_GAME", this.typeCurrent);
    },
    selectGame() {
      // this.$store.commit("guessing/SET_GAME_SELECTED", this.game);
      this.$store.commit("guessing/SET_GAME_TIMELEFT", this.timeleft);
    },
  },
};
</script>
<style>
.value__settings .current {
  background-color: black;
  color: white;
}
.value__settings .current:hover {
  background-color: black;
  color: white;
}
.value__settings .current:focus {
  background-color: black;
  color: white;
}
.minute {
  font-weight: 600;
  line-height: 30px;
  margin-right: 5px;
}
</style>
