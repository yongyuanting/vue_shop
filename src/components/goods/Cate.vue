<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!--      表格-->
      <!--      分页区域-->
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table执行列的定义
    }
  },
  created () {
    this.getCateList()
  }
  ,
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('/categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      // console.log(res.data)
      this.catelist = res.data.result
      console.log(res.data.result)
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>

</style>
