import Vue from 'vue'
import VueRouter from 'vue-router'
import GameScreen from '../components/GameScreen.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'GameScreen',
    component: GameScreen
  },
  {
    path: '/poker',
    name: 'PokerTableList',
    // route level code-splitting
    // this generates a separate chunk (poker.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "poker" */ '../views/poker/PokerListTables.vue')
  },

  {
    path: '/poker/table-:max_slot/:table_id',
    name: 'PokerMainGame',
    // route level code-splitting
    // this generates a separate chunk (poker.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "poker" */ '../views/poker/PokerMainGame.vue')
  },

]

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
