<template>
  <div class="user-cards">
    <div class="list-card" >
      
      <div 
          class="flip-cards"
          :class="{'face-down': card === null}"
          v-for="(card, index) in cards"
          :key="card + index"
        
      >
        <div  class="front-cards">
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

.user-cards .flip-cards {
  position: relative;
  width: 50%;
  height: auto;
  perspective: 1000px;
  animation-name: fly-in-face-up-my-card;
  animation-duration: 2s;
  transform-style: preserve-3d;
  animation-fill-mode: forwards;
  visibility: hidden;
  margin: 0 5px;

}
.user-cards .front-cards img{
  width: 60px !important;
  height: 100px !important;
}

.user-cards .flip-cards img{
   width: 60px !important;
  height: 100px !important;
  
}

.user-cards .list-card {
  display: flex;
  perspective: 1000px;
  width: fit-content;
  margin: 0 auto;
  position: relative;
  justify-content: space-evenly;
  width: 130px;
}
.user-cards .front-cards {
  transform: rotateY(180deg);
    position: absolute;
   backface-visibility: hidden ;  
   transition: 0.6s; 
   transform-style: preserve-3d;
  border-radius: 10px;
  
}
.user-cards .back-card{
       position: absolute;
   backface-visibility: hidden ;  
   transition: 0.6s; 
   transform-style: preserve-3d;
  border-radius: 10px;
 
}

/* .back-card {
  backface-visibility: hidden;
 
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
}  */
/* .front-card {
  transform: rotateY(180deg);
} */

/* .flip-cards:nth-of-type(1) {
  animation-delay: 0s;
  animation-duration: 2s !important;
} */

.user-cards .flip-cards:nth-of-type(2) {
  animation-delay: 2s;
  animation-duration: 2s !important;
  
}

@keyframes fly-in-face-up-my-card {
  0% {
    visibility: visible;
    /* transform: translateY(-500px); */
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
@media screen and (min-width: 375px) and (max-width: 550px) {
.user-cards .front-cards img{
  width: 50px !important;
  height: 90px !important;
}

.user-cards .flip-cards img{
 width: 50px !important;
height: 90px !important;
}
 
}
@media screen and (min-width: 375px) and (max-width: 570px) {
.user-cards .list-card {
  display: flex;
  perspective: 1000px;
  width: fit-content;
  margin: 0 auto;
  position: relative;
  justify-content: space-evenly;
  width: 110px;
}

}
</style>