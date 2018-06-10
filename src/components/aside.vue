<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="排行榜" name="1">
        <el-table
          :data="phb"
          style="width: 100%"
          :default-sort="{prop:'score', order: 'descending'}"
          align="left">
          <el-table-column
            prop="rank"
            label="名次"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名"
            width="70">
          </el-table-column>
          <el-table-column
            prop="score"
            label="分数"
            width="70">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="控制说明" name="2">
        <div>ad键左右移动,f键开始</div>
      </el-collapse-item>

    </el-collapse>
  </div>
</template>

<script>
    export default {
      data() {
        return {
          activeName: '1',
          phb: []
        }
      },
      created() {
        this.$axios.get('/api/data')
          .then(req => {
            console.log(req.data)
            this.phb = this.getData(req.data)
          })
      },
      methods: {
        getData(data) {
          const ret = []
          let i = 1
          for (let name in data) {
            ret.push({rank: i++,name, score: data[name]})
          }
          return ret
        }
      }
    }
</script>

<style scoped>

</style>
