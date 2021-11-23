<template>
  <div class="modal">
    <div class="show__card">
      <div class="show__card--result">
        <div :class="[{ active: shake }]" class="bowl shake-slow">
          <div>
            <img class="show--disk" :src="cardUrl('disk')" />
          </div>
          <div v-for="(item, index) in resultArray" :key="index">
            <div v-if="index == 0">
              <img class="show--dice1" :src="cardUrl(`${item}Cube`)" />
            </div>
            <div v-if="index == 1">
              <img class="show--dice2" :src="cardUrl(`${item}Cube`)" />
            </div>
            <div v-if="index == 2">
              <img class="show--dice3 " :src="cardUrl(`${item}Cube`)" />
            </div>
          </div>
          <div>
            <img
              id="show--bowl"
              :class="[
                { 'open--bowl': openBowl },
                { 'close-the-bowl': openBowl == false },
              ]"
              :src="cardUrl('bowl')"
            />
          </div>
        </div>
        <div :class="{ 'start--section': start == true }">
          <div
            :style="{ display: start == false ? 'none' : null }"
            class="start"
          >
            <el-button @click="startGame">Start The Game</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import 'csshake/dist/csshake-slow.css'
export default {
  data() {
    return {
      listDice: [],
    };
  },
  methods: {
    cardUrl(card) {
      let url = `/baucua/${card}.png`;

      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }

      return url;
    },
    startGame() {
      this.$emit("start-game", "lala");
    },
  },

  props: {
    openBowl: {
      default: () => {},
      type: Boolean,
    },
    shake: {
      default: () => {},
      type: Boolean,
    },
    result: {
      default: () => {},
      type: Array,
    },
    start: {
      default: () => {},
      type: Boolean,
    },
  },
  computed: {
    resultArray() {
      return (this.listDice = this.result);
    },
  },
};
</script>
<style>
@import url("lac.css");

.show__card {
  width: 100%;
  height: auto;
  background-color: #1e6942;
  display: flex;
  justify-content: center;
  align-items: center;
}
.show__card--result {
  position: relative;
}

.start--section {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.show--disk {
  width: 60%;
  position: absolute;
  top: 14%;
  left: 20%;
}
#show--bowl {
  margin-top: 10px;
  width: 60%;
  position: relative;
  left: 20%;
}
.bowl {
  position: relative;
}
.show--dice1 {
  width: 70px;
  position: absolute;
  top: 40%;
  right: 60%;
}

.show--dice2 {
  width: 70px;
  position: absolute;
  top: 30%;
  right: 50%;
}
.show--dice3 {
  width: 70px;
  position: absolute;
  top: 50%;
  right: 50%;
}

.open--bowl {
  animation: showDice linear 3s forwards;
  animation-delay: 3s;
}
.start {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 1;
  z-index: 2;
  margin-top: -22px;
  margin-left: calc(-193px / 2);
}
.start .el-button {
  background-color: #0c6751;
  color: white;
  text-transform: uppercase;
  font-size: 18px;
}
@keyframes showDice {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(220px);
  }
}

@media screen and (min-width: 520px) and (max-width: 600px) {
  .show--dice1 {
    width: 50px;
    position: absolute;
    top: 40%;
    right: 60%;
  }
  .show--dice2 {
    width: 50px;
    position: absolute;
    top: 30%;
    right: 52%;
  }
  .show--dice3 {
    width: 50px;
    position: absolute;
    top: 50%;
    right: 50%;
  }

  .show--disk {
    width: 55%;
    position: absolute;
    top: 14%;
    left: 25%;
  }
  #show--bowl {
    margin-top: 10px;
    width: 55%;
    position: relative;
    top: 20%;
    left: 25%;
  }
  .start {
    position: absolute;
    top: 45%;
    right: 39%;
    opacity: 1;
    z-index: 2;
  }
  .start .el-button {
    background-color: orange;
    color: white;
    font-size: 10px;
  }
  @keyframes showDice {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(150px);
    }
  }
}
@media screen and (min-width: 415px) and (max-width: 519px) {
  .show--dice1 {
    width: 40px;
    position: absolute;
    top: 40%;
    right: 60%;
  }
  .show--dice2 {
    width: 40px;
    position: absolute;
    top: 30%;
    right: 52%;
  }
  .show--dice3 {
    width: 40px;
    position: absolute;
    top: 50%;
    right: 50%;
  }
  .show--disk {
    width: 55%;
    position: absolute;
    top: 16%;
    left: 25%;
  }
  #show--bowl {
    margin-top: 10px;
    width: 55%;
    position: relative;
    top: 20%;
    left: 25%;
  }
  @keyframes showDice {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(120px);
    }
  }
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .show--dice1 {
    width: 40px;
    position: absolute;
    top: 30%;
    right: 55%;
  }
  .show--dice2 {
    width: 40px;
    position: absolute;
    top: 20%;
    right: 45%;
  }
  .show--dice3 {
    width: 40px;
    position: absolute;
    top: 45%;
    right: 45%;
  }
  .show--disk {
    width: 55%;
    position: absolute;
    top: 16%;
    left: 25%;
  }
  #show--bowl {
    margin-top: 10px;
    width: 55%;
    position: relative;
    top: 20%;
    left: 25%;
  }
  @keyframes showDice {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(120px);
    }
  }
}
</style>
