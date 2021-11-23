<template>
  <div
    class="living-betting-game-item"
    :class="[`lbgt-${game.type}`]"
    @click="selectGame"
    v-if="timeleft > 0"
  >
    <div class="type__game">
      <el-row>
        <el-col class="type_game-label" :xs="6" :sm="4"
          >{{ _label(game.type) }}:
        </el-col>

        <el-col :xs="18" :sm="20">
          <el-row class="line--hight">
            <div class="list--game">
              <el-col :xs="24" :span="9">
                <span style="padding-left:5px">{{ game.title }}</span>
              </el-col>
              <el-col :xs="24" :span="15">
                <div class="list--game-style-responsive">
                  <div
                    class="wrap-button"
                    v-for="(option_val, key) in game.settings"
                    :key="key"
                  >
                    <el-button
                      @click="haha(key, game.id, game.type)"
                      :class="[
                        `list-button-${game.type}`,
                        {
                          'current--bet':
                            currentBet == key && currentID == game.id,
                        },
                      ]"
                      class="button--common"
                    >
                      {{ _label(key) }} (<span v-if="option_val > 0"
                        >+{{ option_val }}</span
                      ><span v-else>{{ option_val }}</span
                      >)
                    </el-button>
                  </div>

                  <div class="level--bet">
                    <span
                      style="padding-left:5px;font-weight: 600;"
                      :class="[
                        { valueBet: bettings[game.type][this.currentBet] == 0 },
                      ]"
                      class="content__list--game--value--bet"
                      v-if="game.id == initBettings.id"
                    >
                      {{ bettings[game.type][this.currentBet] | price }}
                    </span>
                  </div>
                </div>
              </el-col>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      timeleft: 0,
      timer: null,
      currentBet: "",
      typeGameValueGame: [],
      currentTypeGame: "",
    };
  },
  props: {
    game: {
      type: Object,
      default: () => {},
    },
    bettings: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      options: (state) => state.living_betting.options,
      currentID: (state) => state.living_betting.currentID,
    }),
    ...mapGetters({
      initBettings: "living_betting/initBettings",
    }),

    reset() {
      return this.currentBet;
    },
  },
  mounted() {
    this.timeleft = this.game.timeleft;
    this.timer_start();
  },
  watch: {
    reset(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("reset");
      }
    },
  },
  methods: {
    timer_start() {
      let _this = this;
      if (this.timer !== null) return;
      this.timer = setInterval(function() {
        if (_this.timeleft > 0) {
          _this.timeleft--;
        } else {
          _this.timer_stop();
        }
      }, 1000);
    },
    haha(key, id, type) {
      this.$store.commit("living_betting/SET_CURRENT_ID", id);
      this.$store.commit("living_betting/SET_CURRENT_KEY", key);

      this.currentBet = key;
      this.currentTypeGame = type;
      this.typeGameValueGame = [type, key];

      this.$emit("currentBet", this.typeGameValueGame, key);
    },

    timer_stop() {
      clearInterval(this.timer);
      this.timer = null;
    },
    _label(key) {
      let label = key;

      for (const [_key, opt] of Object.entries(this.options)) {
        if (key === _key) {
          label = opt.label;
        } else {
          for (const [__key, val] of Object.entries(opt.opts)) {
            if (key === __key) {
              label = val;
            }
          }
        }
      }

      return label;
    },
    selectGame() {
      this.$store.commit("living_betting/SET_GAME_SELECTED", this.game);
      this.$store.commit("living_betting/SET_GAME_TIMELEFT", this.timeleft);
    },
  },
};
</script>
<style scoped>
.wrap-button .current--bet {
  background-color: black;
}

.valueBet {
  display: none;
}
</style>
