<template>
  <div class="player-card">
    <img
      style="position: absolute;z-index: 1111110111111111"
      class="player-blackjack-img 
re-styled"
      v-if="card_1_blackjack"
      :src="imageUrl('blackjack.png')"
      alt=""
    />
    <div
      :class="{ 'card-overlap': blurCard_1 }"
      v-if="splitCards.length"
      class="list-card split-card"
    >
      <div
        style="position: absolute; z-index: 1111110111111111"
        v-if="splitScore"
        :class="{ 'over-score': splitScore > 21 }"
        class="score-label hieu"
      >
        {{ splitScore }}
      </div>

      <div
        :class="{
          'first-split-effect': index == 0,
          'show-card':
            card !== null && !double_down_1 && index !== 2 && !end_game,
          'face-down': card === null,
          'double-card': double_down_1 && index == 2,
          'ani-end-game': end_game,
        }"
        class="flip-card"
        v-for="(card, index) in splitCards"
        :key="card + index"
      >
        <div v-if="card !== null" class="front-card">
          <img :src="cardUrl(card)" alt="" />
        </div>
        <div class="back-card">
          <img :src="cardUrl('img_back_card')" alt="" />
        </div>
      </div>
    </div>
      
    <div :class="{ 'card-overlap': blurCard_2 }" class="list-card">
      <div
        style=" position: absolute;z-index: 1111110111111111"
        v-if="score"
        :class="{ 'over-score': score > 21 }"
        class="score-label"
      >
        {{ score }}
      </div>
      <img
        style="position: absolute; z-index: 1111110111111111"
        class="player-blackjack-img"
        v-if="card_2_blackjack"
        :src="imageUrl('blackjack.png')"
        alt=""
      />
      <div
        :class="{
          'show-card':
            card !== null && !double_down_2 && index !== 2 && !end_game,
          'face-down': card === null,
          'double-card': double_down_2 && index == 2,
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
          <img :src="cardUrl('img_back_card')" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["cards", "score", "splitCards", "splitScore"],

  data() {
    return {
      blurCard_1: true,
      blurCard_2: false,
      card_1_blackjack: false,
      card_2_blackjack: false,
      double_down_1: false,
      double_down_2: false,
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

    clickStand() {
      this.blurCard_1 = false;
      this.blurCard_2 = true;
    },

    endGameAnimation() {
      this.blurCard_1 = true;
      this.blurCard_2 = false;
      this.card_1_blackjack = false;
      this.card_2_blackjack = false;
      (this.double_down_1 = false),
        (this.double_down_2 = false),
        (this.end_game = true);
    },

    restoreAll() {
      this.blurCard_1 = true;
      this.blurCard_2 = false;
      this.card_1_blackjack = false;
      this.card_2_blackjack = false;
      (this.double_down_1 = false),
        (this.double_down_2 = false),
        (this.end_game = false);
    },
  },
};
</script>

<style scoped>
.player-card {
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 20px;
}

.score-label {
  z-index: 10000000 !important;
  position: absolute;
  top: -3px;
  right: -35px;
  width: 45px;
  border-radius: 50%;
  height: 45px;
  border: 2px solid white;
  z-index: 10000;
  background-color: #00a974;
  transform: translateY(-25%);
  font-size: 1.8rem;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: math;
}

.list-card {
  display: flex;
  perspective: 1000px;
  width: fit-content;
  margin: 0 auto;
  position: relative;
  justify-content: space-evenly;
  z-index: 5;
}

.split-card {
  position: absolute;
  top: 30px;
  z-index: 2 !important;
}

.split-card .first-split-effect {
  animation-name: face-up !important;
  animation-delay: 0s !important;
}

.card-overlap {
  opacity: 0.7;
  z-index: 1;
  top: -20%;
}

.flip-card {
  position: relative;
  width: 50%;
  height: auto;
  perspective: 1000px;
  animation-name: fly-in-face-up;
  animation-duration: 2s;
  transform-style: preserve-3d;
  animation-fill-mode: forwards;
  visibility: hidden;
  margin: 0 5px;
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

.front-card {
  transform: rotateY(180deg);
}

.flip-card:nth-of-type(1) {
  animation-delay: 0s;
  animation-duration: 2s !important;
}

.flip-card:nth-of-type(2) {
  animation-delay: 4s;
  animation-duration: 2s !important;
}

.double-card {
  animation-name: face-up !important;
  animation-delay: 0s !important;
}

.face-down {
  animation-name: fly-in-face-down !important;
}

.over-score {
  background-color: #ae0020 !important;
}
.list-card.split-card.card-overlap {
  top: -20px;
}
.score-label.hieu {
  top: 5px;
  z-index: 100000000000000 !important;
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

@keyframes fly-in-face-up {
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

@keyframes face-up {
  0% {
    visibility: visible;
  }
  100% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(-180deg);
  }
}

@keyframes ani-end-game-1 {
  0% {
    visibility: visible;
    transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
  }
  100% {
    visibility: visible;
    transform: translateX(-300px) translateZ(-500px) translateY(-700px)
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
    transform: translateX(-400px) translateZ(-500px) translateY(-700px)
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
    transform: translateX(-500px) translateZ(-500px) translateY(-700px)
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
    transform: translateX(-600px) translateZ(-500px) translateY(-700px)
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
    transform: translateX(-700px) translateZ(-500px) translateY(-700px)
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
    z-index: -10 !important;
  }

  .score-label {
    width: 40px !important;
    top: -12px !important;
    right: -33px !important;
    height: 40px !important;
  }
  .score-label.hieu {
    top: 6px !important;
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

  .score-label {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>
