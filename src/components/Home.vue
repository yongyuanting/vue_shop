<template>
  <el-container class="home-container">
    <!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/3.jpg" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--    主体区域-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--        侧边栏菜单区域-->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="skyblue"
                 :collapse-transition="true"
                 :unique-opened="true"
                 :collapse="isCollapse"
                 :router="true"
                 :default-active="activePath">
          <!--          一级菜单-->
          <el-submenu :key="item.id" :index="item.id + ''" v-for="item in menulist">
            <!--            一级菜单的模板区域-->
            <template #title>
              <!--              i是图标 span是文本-->
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item :key="subitem.id" :index="'\/'+ subitem.path + ''" v-for="subitem in item.children"
                          @click="saveNavState(subitem.path)">
              <template #title>
                <!--              i是图标 span是文本-->
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      右侧内容主体区域-->
      <el-main>
        <!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconObj: {
        125: 'iconfont icon-icon-huichang',
        103: 'iconfont icon-icon-shoudongtiaozheng',
        101: 'iconfont icon-icon-diankadingdanchaxun',
        102: 'iconfont icon-icon-huichangchongzhijilu',
        145: 'iconfont icon-icon-zhuceguanli'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  name: 'Home',
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮切换菜单的折叠和展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }

    img {
      display: flex;
      align-items: center;
      width: 60px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.iconfont {
  margin-right: 20px;
  font-size: 20px;
}

.toggle-button {
  background-color: #4A5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
