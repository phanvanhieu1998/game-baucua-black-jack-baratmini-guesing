<template>
	<div class="list-card">
        <div class="flip-card" v-for="(card, index) in cards" :key="card + index" >
			<div class="front-card">
				<!-- <img :src="require(`@/assets/images/cards/${card}.png`)" alt=""> -->
				<img :src="cardUrl(card)" alt="">
			</div>
			<div class="back-card">
				<img :src="cardUrl('img_back_card')" alt="">
			</div>
		</div>
	</div>
</template>

<script>
export default {
    props: ["cards"],
    methods: {
        cardUrl(card){
            let url = `/baccarat-mini/cards/${card}.png`;

            if(process.env.NODE_ENV !== 'development'){
                url = process.env.VUE_APP_SITE_URL+'/game-data'+url;
            }

            return url;
        }
    },
}
</script>

<style scoped>
	.list-card{
    	display: flex;
		perspective: 1000px;
		width: 100%;
		margin: 0 auto;
	
        flex-wrap: wrap;
        position: relative;
		
		justify-content: space-evenly;
	}

	.flip-card {
		position: relative;
		width: 50%;
		height: auto;
		perspective: 1000px;
		animation-name:fly-in;
		animation-duration:3.5s;
		transform-style: preserve-3d;
		animation-fill-mode: forwards;
		transform: translateX(-500px) translateZ(-500px) translateY(500px) rotateY(260deg);
		visibility: hidden;
		margin: 0 2%;
		
	}

	.front-card, .back-card {
		position: absolute;
		backface-visibility: hidden;
		transition: 0.8s;
		transform-style: preserve-3d;
		border-radius: 10px;
		border: 2px solid rgba(0,0,0, 0.1); 
	}

	img, .front-card, .back-card, .flip-card {
		width: 160px;
        height: 230px;
	}

	.front-card {
		transform: rotateY(180deg);
	}



	@keyframes fly-in {
        0% {
            visibility: visible;
            transform: translateX(-500px) translateZ(-500px) translateY(500px) rotateY(260deg);
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

	.flip-card:nth-of-type(1){ animation-delay: 0;}
	.flip-card:nth-of-type(2){ animation-delay: 4s;}
	.flip-card:nth-of-type(3){ 
		margin-right: 53%;
        animation-delay: 8s;
        animation-name: card3-fly-in;
    }

    @keyframes card3-fly-in {
        0% {
            visibility: visible;
            transform: translateX(-500px) translateZ(-500px) translateY(500px) rotateY(260deg);
        }
        50% {
            visibility: visible;
            transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
        }
        100% {
            visibility: visible;
            transform: translateX(32px) translateZ(0) translateY(-35px) rotateY(-180deg) rotateZ(90deg);
        }
    }

    @media (max-width: 715px) {
        img, .front-card, .back-card, .flip-card {
            width: 130px;
            height: 186px;
        }

        @keyframes card3-fly-in {
            0% {
                visibility: visible;
                transform: translateX(500px) translateZ(-500px) translateY(500px) rotateY(260deg);
            }
            50% {
                visibility: visible;
                transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
            }
            100% {
                visibility: visible;
                transform: translateX(25px) translateZ(0) translateY(-20px) rotateY(-180deg) rotateZ(90deg);
            }
        }
    }

    @media (max-width: 585px) {
        img, .front-card, .back-card, .flip-card {
            width: 110px;
            height: 158px;
        }

        @keyframes card3-fly-in {
            0% {
                visibility: visible;
                transform: translateX(500px) translateZ(-500px) translateY(500px) rotateY(260deg);
            }
            50% {
                visibility: visible;
                transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
            }
            100% {
                visibility: visible;
                transform: translateX(21px) translateZ(0) translateY(-20px) rotateY(-180deg) rotateZ(90deg);
            }
        }
    }

    @media (max-width: 500px) {
        img, .front-card, .back-card, .flip-card {
            width: 90px;
            height: 129px;
        }

        @keyframes card3-fly-in {
            0% {
                visibility: visible;
                transform: translateX(500px) translateZ(-500px) translateY(500px) rotateY(260deg);
            }
            50% {
                visibility: visible;
                transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
            }
            100% {
                visibility: visible;
                transform: translateX(15px) translateZ(0) translateY(-10px) rotateY(-180deg) rotateZ(90deg);
            }
        }
    }

    @media (max-width: 415px) {
        img, .front-card, .back-card, .flip-card {
            width: 85px;
            height: 115px;
        }

        @keyframes card3-fly-in {
            0% {
                visibility: visible;
                transform: translateX(500px) translateZ(-500px) translateY(500px) rotateY(260deg);
            }
            50% {
                visibility: visible;
                transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
            }
            100% {
                visibility: visible;
                transform: translateX(11px) translateZ(0) translateY(-10px) rotateY(-180deg) rotateZ(90deg);
            }
        }
    }

    @media (max-width: 320px) {
        img, .front-card, .back-card, .flip-card {
            width: 70px;
            height: 115px;
        }

        @keyframes card3-fly-in {
            0% {
                visibility: visible;
                transform: translateX(500px) translateZ(-500px) translateY(500px) rotateY(260deg);
            }
            50% {
                visibility: visible;
                transform: translateX(0) translateZ(0) translateY(0) rotateY(0);
            }
            100% {
                visibility: visible;
                transform: translateX(20px) translateZ(0) translateY(-10px) rotateY(-180deg) rotateZ(90deg);
            }
        }
    }
</style>