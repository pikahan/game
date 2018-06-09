import Vue from 'vue'
import Router from 'vue-router'
import Game from '@/components/game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Game
    }
  ]
})
