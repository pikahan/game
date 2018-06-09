<template>
  <canvas :id="id" :width="width" :height="height"></canvas>
</template>

<script>
  import {createImg} from "../common/js/Game";
  import {ballBase64, paddleBase64, blockBase64} from "../common/js/base64";

  export default {
      props: {
        width: {
          type: Number,
          default: 600
        },
        height: {
          type: Number,
          default: 400
        },
        speed: {
          type: Number,
          default: 10
        }
      },
      data() {
        return {
          id: 'id-canvas',
          initX : 250,
          initY: 350
        }
      },
      created() {
      },
      methods: {
        Paddle(src, x, y) {
          const img = createImg(src)
          const o = {
            img,
            x,
            y,
            speed: this.speed,
          }
          o.moveLeft = () => {
            o.x -= o.speed
          }
          o.moveRight = () => {
            o.x += o.speed
          }
          return o
        },
        Game(id) {
          const canvas = document.getElementById(id)
          const ctx = canvas.getContext('2d')
          const g = {
            ctx,
            canvas,
            keydowns: {},
            actions: {},
          }

          window.addEventListener('keydown', ev => {
            g.keydowns[ev.key] = true
          })

          window.addEventListener('keyup', ev => {
            g.keydowns[ev.key] = false
          })


          // register
          g.registerAction = (key, callback) => {
            g.actions[key] = callback
          }

          // draw
          g.drawImg = (imgObj) => {
            g.ctx.drawImage(imgObj.img, imgObj.x, imgObj.y)
          }

          setInterval(() => {

            // events
            const keys = Object.keys(g.keydowns)
            for (let i = 0; i < keys.length; i++) {
              let key = keys[i]
              if (g.keydowns[key]) {
                g.actions[key]()
              }
            }

            // update
            g.update()

            // clear
            g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height)

            // draw
            g.draw()
          }, 1000/60)

          return g
        },
  },
      mounted() {
        const game = this.Game(this.id)
        const paddle = this.Paddle(paddleBase64, this.initX, this.initY)


        game.registerAction('a', () => {
          paddle.moveLeft()
        })

        game.registerAction('d', () => {
          paddle.moveRight()
        })

        game.update = () => {

        }

        game.draw = () => {
          game.drawImg(paddle)
        }
      },

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #id-canvas
    border 1px solid black
</style>
