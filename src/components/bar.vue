<template>
  <div class="bar">
    <span class="logo"><img src="../common/image/logo.png" alt="logo"></span>
    <div v-if="!isLogined" class="btn-group">
      <el-button type="text" @click="openLogin"><el-tag>登录</el-tag></el-button>
    </div>
    <div class="user" v-else>
      <span>你好{{username}}</span>
    </div>
  </div>
</template>

<script>
    export default {
      props: {

      },
      data() {
        return {
          username: '',
          isLogined: false,
        }
      },
      methods: {
        openLogin() {
          this.$prompt('请输入用户名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator(value) {
              if (value.length >= 6) {
                return '用户名必须小于6个字符'
              } else if (/[\s<>{}]/.test(value)) {
                return '请勿输入非法字符'
              } else {
                return true
              }
            }
          }).then(({ value }) => {
            this.isLogined = true
            this.username = value
            this.$emit('getName', value)
            this.$message({
              type: 'success',
              message: '登录成功 '
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消登录'
            });
          });
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .bar
    display flex
    justify-content center
    .logo
      display flex
      align-items center
      line-height 60px
      height 60px
      position absolute
      left 30%
      img
        height 32px
        width 32px
    .btn-group
      position absolute
      left 40%

</style>
