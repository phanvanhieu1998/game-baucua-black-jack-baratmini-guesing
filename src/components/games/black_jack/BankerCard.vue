<template>
  <div class="banker-card">
    <div class="wrap-list-card">
      <img
        class="dealer-blackjack-img"
        v-if="blackjack"
        :src="imageUrl('blackjack.png')"
        alt=""
      />
      <div class="list-card">
        <div
          :class="{
            'show-card': card !== null && !end_game,
            'ani-end-game': end_game,
          }"
          class="flip-card"
          v-for="(card, index) in cards"
          :key="card + index"
        >
          <div v-if="card !== null" class="front-card">
            <img :src="cardUrl(card)" alt="" />
          </div>
          <div class="back-card">
            <div v-if="!card && checkBlackjack" class="checking-blackjack">
              CHECKING...
            </div>
            <div v-if="!card && noBlackjack" class="no-blackjack">
              NO BLACKJACK
            </div>
            <img :src="cardUrl('img_back_card')" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["cards"],

  data() {
    return {
      checkBlackjack: false,
      noBlackjack: false,
      blackjack: false,
      end_game: false,
    };
  },

  methods: {
    imageUrl(img) {
      let url = `/blackjack/${img}`;
      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }
      return url;
    },

    cardUrl(card) {
      let url = `/blackjack/cards/${card}.png`;

      if (process.env.NODE_ENV !== "development") {
        url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
      }

      return url;
    },

    endGameAnimation() {
      this.checkBlackjack = false;
      this.noBlackjack = false;
      this.blackjack = false;
      this.end_game = true;
    },

    restoreAll() {
      this.checkBlackjack = false;
      this.noBlackjack = false;
      this.blackjack = false;
      this.end_game = false;
    },
  },
};
</script>

<style scoped>
.banker-card {
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -15px;
}

.wrap-list-card {
  position: relative;
}

.list-card {
  display: flex;
  perspective: 1000px;
  width: fit-content;
  margin: 0 auto;
  position: relative;
  justify-content: space-evenly;
}

.flip-card {
  position: relative;
  width: 50%;
  height: auto;
  perspective: 1000px;
  animation-duration: 2s;
  animation-name: fly-in;
  transform-style: preserve-3d;
  animation-fill-mode: forwards;
  visibility: hidden;
  margin: 0 5px;
  transition: all 3s ease-in-out !important;
}

.front-card,
.back-card {
  position: absolute;
  backface-visibility: hidden;
  transition: 0.6s;
  transform-style: preserve-3d;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

img,
.front-card,
.back-card,
.flip-card {
  width: 120px;
  height: 190px;
}

.back-card .checking-blackjack {
  border: 1px solid;
  border-radius: 6px;
  background-color: #00a974;
  position: absolute;
  font-size: 1.2rem;
  font-weight: 600;
  width: 94%;
  padding: 7px 3px;
  top: 50%;
  color: #ffffff;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-card .no-blackjack {
  border: 1px solid;
  border-radius: 6px;
  background-color: #303133;
  position: absolute;
  font-size: 0.7rem;
  font-weight: 600;
  width: 94%;
  padding: 7px 3px;
  top: 50%;
  color: #ffffff;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.front-card {
  transform: rotateY(180deg);
}

.flip-card:nth-of-type(1) {
  animation-delay: 2s;
  animation-name: fly-in;
}

.flip-card:nth-of-type(2) {
  animation-delay: 6s;
  animation-name: fly-in-face-down;
}

.flip-card:nth-of-type(2).show-card {
  animation-name: face-up !important;
  animation-delay: 0s !important;
}

.ani-end-game:nth-child(1) {
  animation-name: ani-end-game-1 !important;
  animation-duration: 2s !important;
  animation-delay: 0s !important;
}
.ani-end-game:nth-child(2) {
  animation-name: ani-end-game-2 !important;
  animation-duration: 2s !important;
  animation-delay: 0s !important;
}
.ani-end-game:nth-child(3) {
  animation-name: ani-end-game-3 !important;
  animation-duration: 2s !important;
  animation-delay: 0s !important;
}
.ani-end-game:nth-child(4) {
  animation-name: ani-end-game-4 !important;
  animation-duration: 2s !important;
  animation-delay: 0s !important;
}
.ani-end-game:nth-child(n + 5) {
  animation-name: ani-end-game-5 !important;
  animation-duration: 2s !important;
  animation-delay: 0s !important;
}

@keyframes face-up {
  0% {
    visibility: visible;
  }
  100% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(-180deg);
  }
}

@keyframes fly-in {
  0% {
    visibility: visible;
    transform: translateY(-500px);
  }
  50% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(-180deg);
  }
}

@keyframes fly-in-face-down {
  0% {
    visibility: visible;
    transform: translateY(-500px);
  }
  50% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0);
  }
}

@keyframes ani-end-game-1 {
  0% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(-300px) translateZ(-500px) translateY(-300px)
      rotateY(260deg);
  }
}
@keyframes ani-end-game-2 {
  0% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(-400px) translateZ(-500px) translateY(-300px)
      rotateY(260deg);
  }
}
@keyframes ani-end-game-3 {
  0% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(-500px) translateZ(-500px) translateY(-300px)
      rotateY(260deg);
  }
}
@keyframes ani-end-game-4 {
  0% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(-600px) translateZ(-500px) translateY(-300px)
      rotateY(260deg);
  }
}
@keyframes ani-end-game-5 {
  0% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(-700px) translateZ(-500px) translateY(-300px)
      rotateY(260deg);
  }
}

@media (max-width: 715px) {
  img,
  .front-card,
  .back-card,
  .flip-card {
    width: 120px !important;
    height: 180px !important;
  }
}

@media (max-width: 585px) {
  img,
  .front-card,
  .back-card,
  .flip-card {
    width: 70px !important;
    height: 100px !important;
  }

  .flip-card {
    margin: 0 2px !important;
  }

  .back-card .checking-blackjack {
    font-size: 0.7rem !important;
    padding: 5px 1px !important;
    border: 1px solid !important;
    border-radius: 3px !important;
  }

  .back-card .no-blackjack {
    font-size: 0.5rem !important;
    padding: 5px 1px !important;
    border: 1px solid !important;
    border-radius: 3px !important;
  }
}

@media (max-width: 320px) {
  img,
  .front-card,
  .back-card,
  .flip-card {
    width: 60px !important;
    height: 88px !important;
  }

  .flip-card {
    margin: 0 1.3px !important;
  }
}
</style>
