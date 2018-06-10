<template>
  <div id="app">
    <el-container>
      <el-container>
        <el-header>
          <Bar></Bar>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
      <el-aside width="200px" class="hidden-xs-only"><Aside></Aside></el-aside>
    </el-container>
  </div>
</template>

<script>
  import Bar from '@/components/bar'
  import Aside from '@/components/aside'
export default {
  data() {
    return {

    }
  },
  methods: {

  },
  components: {
    Bar, Aside
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "./common/style/reset.styl"
  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: #2c3e50
    margin-top: 60px
    min-width: 650px
    .el-container
      min-width 650px


  .el-header, .el-footer
    background-color: #E9EEF3
    color: #333
    text-align: center
    line-height: 60px
    min-width 650px



  .el-aside
    background-color: #D3DCE6
    color: #333
    text-align: center
    line-height: 200px


  .el-main
    background-color: #B3C0D1
    color: #333
    text-align: center
    line-height: 160px
    min-width 650px


  body > .el-container
    margin-bottom: 40px


  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside
    line-height: 260px


  .el-container:nth-child(7) .el-aside
    line-height: 320px

</style>
