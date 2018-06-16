<template>
  <div>
    <canvas :id="id" :width="width" :height="height"></canvas>
    <div class="reset">
      <el-button type="info" @click="reset">重新开始</el-button>
    </div>
  </div>

</template>

<script>
  import {createImg, intersect, drawScore} from "../common/js/Game";
  import {ballBase64, paddleBase64, blockBase64} from "../common/js/base64";
  import {levels} from "../common/js/levels";

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
            return { width: 64, height: 16, speed: 6,  }
          }
        },
        ball: {
          type: Object,
          default: () => {
            return { width: 7, height: 7, speed: 3 }
          }
        },
        block: {
          type: Object,
          default: () => {
            return{ width: 32, height: 16 }
          }
        }
      },
      data() {
        return {
          id: 'id-canvas',
          paddleX : 250,
          paddleY: 350,
          ballX: 278,
          ballY: 342,
          pause: false,
          level: 0,
          score: 0,
          paddleObj: null,
          ballObj: null,
          blockList: []
        }
      },
      created() {
      },
      methods: {
        Block(src, x, y) {
          const img = createImg(src)
          const o = {
            img,
            x,
            y,
            width: this.block.width,
            height: this.block.height,
            alive: true,
          }

          o.kill = () => {
            o.alive = false
          }

          o.collision = (imgObj) => {
            if(!o.alive) return false

            // 判断矩形相交
            const param2 = Object.assign({x: imgObj.x, y: imgObj.y}, this.ball)
            return intersect(o, param2)
          }
          return o
        },
        Paddle(src, x, y) {
          const img = createImg(src)
          const o = {
            img,
            x,
            y,
            speed: this.paddle.speed,
          }

          o.move = (x) => {
            if (x < 0) {
              x = 0
            }
            if (x > this.width - this.paddle.width) {
              x = this.width - this.paddle.width
            }
            o.x = x
          }

          o.moveLeft = (ball) => {
            o.move(o.x - o.speed)
            if (!ball.fired) {
              ball.x = o.x + this.paddle.width / 2 - 3
            }
          }
          o.moveRight = (ball) => {
            o.move(o.x + o.speed)
            if (!ball.fired) {
              ball.x = o.x + this.paddle.width / 2 - 3
            }
          }

          o.collision = (imgObj) => {

            // 判断矩形相交
            const param1 = Object.assign({x: o.x, y: o.y}, this.paddle)
            const param2 = Object.assign({x: imgObj.x, y: imgObj.y}, this.ball)
            return intersect(param1, param2)
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
              if (g.keydowns[key] && g.actions[key]) {
                g.actions[key]()
              }
            }

            // update
            g.update()

            // clear
            g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height)

            // draw
            g.draw()

            // score
            drawScore(ctx, this.level+1, this.score, 10, canvas.height - 20)
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
            speedY: -this.ball.speed,
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
              if (o.y < 0) {
                o.speedY *= -1
              }
              if (o.y > this.height - this.ball.height) {
                this.pause = true
                this.lose(this.score)
              }

              // move
              o.x += o.speedX
              o.y += o.speedY
            }

          }
          return o
        },
        allBeKilled(blockList) {
          for (let i = 0; i < blockList.length; i++) {
            let block = blockList[i]
            if (block.alive) {
              return false
            }
          }
          return true
        },
        plus() {
          this.score += 100
        },
        levelChange(i, levels) {
          const newBlocks = []
          levels[i].forEach(pos => {
            newBlocks.push(this.Block(blockBase64, pos[0], pos[1]))
          })
          return newBlocks
        },
        init(ball, paddle) {
          ball.x = this.ballX
          ball.y = this.ballY
          paddle.x = this.paddleX
          paddle.y = this.paddleY
          ball.fired = false
        },
        lose(score) {
          const h = this.$createElement;

          this.$notify({
            title: '你输了',
            message: h('i', { style: 'color: teal'}, `你的分数是${score} 上传成绩中......`)
          })

          this.$emit('uploadScore', this.score);
        },
        reset() {
          this.init(this.ballObj, this.paddleObj)
          this.pause = false
          this.level = 0
          this.score = 0
          this.blockList = this.levelChange(0, levels)
        },
        win() {
          const h = this.$createElement;

          this.$notify({
            title: '你赢了',
            message: h('i', { style: 'color: teal'}, `5秒后进入下一关`)
          })


        }
  },
      mounted() {
        const game = this.Game(this.id)
        const paddle = this.paddleObj = this.Paddle(paddleBase64, this.paddleX, this.paddleY)
        const ball = this.ballObj = this.Ball(ballBase64, this.ballX, this.ballY)
        this.blockList = []

        this.blockList = this.levelChange(0, levels)

        game.registerAction('a', () => {
          paddle.moveLeft(ball)
        })

        game.registerAction('d', () => {
          paddle.moveRight(ball)
        })

        game.registerAction('f', () => {
          ball.fire()
        })

        game.update = () => {
          if (this.pause) {
            return
          }

          ball.move()

          // 判断paddle相撞
          if (paddle.collision(ball)) {
            ball.speedY *= -1
            if((ball.x <= paddle.x && ball.x >= paddle.x - this.ball.width)
              || (ball.x <= paddle.x + this.paddle.width && ball.x >= paddle.x + this.paddle.width - this.ball.width)) {
              ball.speedX *= -1
            }
          }

          // 判断block相撞
          this.blockList.forEach(block => {
            if (block.collision(ball)) {
              ball.speedY *= -1
              block.kill()
              this.plus()

              // 检测是否打完所有砖块
              if (this.blockList.length > 0 && this.allBeKilled(this.blockList)) {
                this.pause = true
                this.win()
                setTimeout(()=>{
                  this.level++
                  this.pause = false
                  this.init(ball, paddle)
                  this.blockList = this.levelChange(this.level, levels)
                }, 5000)
                return
              }
            }
          })

        }

        // pause
        window.addEventListener('keydown', ev => {
          if (ev.key === 'p') {
            this.pause = !this.pause
          }
        })

        // draw
        game.draw = () => {
          game.drawImg(paddle)
          game.drawImg(ball)

          this.blockList.forEach((block) => {
            if (block.alive) {
              game.drawImg(block)
            }
          })

        }
      },

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #id-canvas
    border 1px solid black
    background aliceblue

  .reset
    margin-top -90px
</style>
