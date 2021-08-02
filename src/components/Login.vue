<template>
  <div class="login_container">
    <div class="login_box">
      <!--        头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--      登录表单区-->
      <el-form class="login_form" v-bind:model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!--        用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon--" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <div class="btns">
          <el-button type="primary" @click="Login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [{
          required: true,
          message: '请输入登录名',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '长度在 3 到 10 个字符之间',
          trigger: 'blur'
        }],
        // 验证密码是否合法
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '长度在 3 到 10 个字符之间',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      // 这个this就指向当前这个组件的实例对象VM
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    Login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 如果返回的是一个promise，可以使用async/await简化，await绑定async
        // 只有data属性有用，其他都是别人帮忙封装的，只要data
        const { data: res } = await this.$http.post('login', this.loginForm)
        const result = await this.$http.post('login', this.loginForm)
        console.log(res)
        console.log(result)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败！')
        }
        this.$message.success('登录成功！')
        /**
         * 1.将登陆成功后的token，保存到客户端的sessionStorage中
         *  1.1 项目中除了登录之外的其他接口，必须在登陆之后才能访问
         *  1.2 token只能在当前网站打开期间生效，所以讲token保存在sessionStorage中
         * 2.通过编程式导航跳转到后台主页，路由地址是/home
         */
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

//正中间
.login_box {
  width: 450px;
  height: 300px;
  background-color: wheat;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px skyblue;
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translate(-50%, 50%);
    background-color: wheat;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #ccc;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 10px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  //float: right;
  display: flex;
  justify-content: flex-end;
}
</style>
