<template>
  <div class="share-cards">
    <div class="list-card" >
      <div 
          class="flip-card"
          :class="{'face-down': card === null}"
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
 props: ["cards"],
 data(){
   return{
    //cards: ['2H','4D', 'AS']  
   }
 },
 methods:{
    cardUrl(card) {
      card = card.toUpperCase()
    let url = `/poker/images/cards/${card}.png`;
    if (process.env.NODE_ENV !== "development") {
      url = process.env.VUE_APP_SITE_URL + "/game-data" + url;
    }
    return url;
  },
 }
}
</script>

<style>
.share-cards .flip-card {
  position: relative;
  width: 56px;
  min-height: 88px;
  height: auto;
  perspective: 1000px;
  animation-name: fly-in-face-up;
  animation-duration: 2s;
  transform-style: preserve-3d;
  animation-fill-mode: forwards;
  /* visibility: hidden;  */
  margin: 0 5px;
}
.share-cards .front-card img{
  width: 52px!important;
  height: 80px !important;
}
.share-cards .flip-card img{
   width: 52px !important;
  height: 80px !important;
}
.share-cards .list-card {
  display: flex;
  perspective: 1000px;
  width: fit-content;
  margin: 0 auto;
  position: relative;
  justify-content: space-evenly;
}
/* .front-card{
  transform: rotateY(180deg);
    position: absolute;
   backface-visibility: hidden ;  
   transition: 0.6s; 
   transform-style: preserve-3d;
  border-radius: 10px;
  
} */
.share-cards .front-card,
 .share-cards .back-card {
  position: absolute;
  backface-visibility: hidden;
  transition: 0.6s;
  transform-style: preserve-3d;
  border-radius: 10px;
}
.front-card {
  transform: rotateY(180deg);
}

/* .back-card {
  backface-visibility: hidden;
 
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
}  */
/* .front-card {
  transform: rotateY(180deg);
} */
.flip-card:nth-of-type(1) {
  animation-delay: 0s;
  animation-duration: 2s !important;
}
.flip-card:nth-of-type(2) {
  animation-delay: 0s;
  animation-duration: 2s !important;
  
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
@media screen and (min-width: 375px) and (max-width: 570px) {
 .share-cards .front-card img{
    width: 35px !important;
    height: 50px !important;
  }
  .share-cards .flip-card img{
     width: 35px !important;
    height: 50px !important;
  }
  .share-cards .flip-card {
    position: relative;
    width: 30px;
  }
}
</style>