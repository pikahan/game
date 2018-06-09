<template>
  <canvas :id="id" :width="width" :height="height"></canvas>
</template>

<script>
  import {createImg, intersect} from "../common/js/Game";
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
        paddle: {
          type: Object,
          default: () => {
            return { width: 64, height: 16, speed: 10 }
          }
        },
        ball: {
          type: Object,
          default: () => {
            return { width: 7, height: 7, speed: 3 }
          }
        },

      },
      data() {
        return {
          id: 'id-canvas',
          paddleX : 250,
          paddleY: 350,
          ballX: 200,
          ballY: 250,
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
            speed: this.paddle.speed,
          }
          o.moveLeft = () => {
            o.x -= o.speed
          }
          o.moveRight = () => {
            o.x += o.speed
          }

          o.collision = (imgObj) => {

            // 判断矩形相交
            const param1 = Object.assign({x: o.x, y: o.y}, this.paddle)
            const param2 = Object.assign({x: imgObj.x, y: imgObj.y}, this.ball)
            if (intersect(param1, param2)) {
              imgObj.speedY *= -1
            }
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
        Ball(src, x, y) {
          const img = createImg(src)
          const o = {
            img,
            x,
            y,
            speedX: this.ball.speed,
            speedY: this.ball.speed,
            fired: false,
          }

          o.fire = () => {
            o.fired = true
          }

          o.move = () => {
            if (o.fired) {
              if (o.x < 0 || o.x > this.width - this.ball.width) {
                o.speedX *= -1
              }
              if (o.y < 0 || o.y > this.height - this.ball.height) {
                console.log(o.img.naturalWidth)

                o.speedY *= -1
              }

              // move
              o.x += o.speedX
              o.y += o.speedY
            }
          }

          return o
        }
  },
      mounted() {
        const game = this.Game(this.id)
        const paddle = this.Paddle(paddleBase64, this.paddleX, this.paddleY)
        const ball = this.Ball(ballBase64, this.ballX, this.ballY)

        game.registerAction('a', () => {
          paddle.moveLeft()
        })

        game.registerAction('d', () => {
          paddle.moveRight()
        })

        game.registerAction('f', () => {
          ball.fire()
        })

        game.update = () => {
          ball.move()
          paddle.collision(ball)
        }

        game.draw = () => {
          game.drawImg(paddle)
          game.drawImg(ball)
        }
      },

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #id-canvas
    border 1px solid black
</style>
