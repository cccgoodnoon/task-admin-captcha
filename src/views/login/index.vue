<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="Email"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          
        />
        <!-- @keyup.enter.native="handleLogin" -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      
      
      <el-form-item prop="captcha">
          <el-input v-model="loginForm.captcha" placeholder="请输入验证码" class="identifyinput"></el-input>
      </el-form-item>

      <div>
        <img :src="imgUrl" alt="" style="margin-bottom:30px; ">
        <!-- <input type="hidden" name="captchaKey" v-model="loginForm.captchaKey"/> -->
      </div>

      <!-- <div>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="getVerifyKey">获取</el-button>
      </div> -->

      <div>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="handleLogin">Login</el-button>
      </div>
      <!-- <div>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="ToRegister">Register</el-button>
      </div> -->
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import api from "../../utils/auth"

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: '353524452@qq.com',
        password: '123456789',
        captcha:'',
        captchaKey: '',
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur'}],
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur'}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      imgUrl: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted(){
    this.getVerifyKey();
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const { email, password ,captcha, captchaKey } = this.loginForm
          const data = { "email": email.trim(), "password": password }
          const params = { "captcha": captcha.trim(), "captchaKey": captchaKey }
          console.log(params);
          this.$store.dispatch('user/login',{data, params}).then(() => {
            console.log('登录成功')
            this.$router.push({ path: this.redirect || '/' })   // 登录成功之后重定向到首页
            this.loading = false
          }).catch(() => {
            this.loading = false
          })

          // this.$store.dispatch('user/login', this.loginForm).then(() => {
          //   console.log('登录成功')
          //   this.$router.push({ path: this.redirect || '/' })   // 登录成功之后重定向到首页
          //   this.loading = false
          // }).catch(() => {
          //   this.loading = false
          // })
          
          // const { email, password ,captcha, captchaKey } = this.loginForm
          // const data = { "email": email.trim(), "password": password }
          // const params = { "captcha": captcha.trim(), "captchaKey": captchaKey }
          // api._postin(data,params).then(res => {
          //     console.log(res);
          //     console.log('登录成功');
          //     this.$router.push('/')
          //     this.loading = false
          // }).catch(() => {
          //     this.loading = false
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // example(){
    //   axios.post(url, data: {
    //     "email": email.trim(),
    //     "password": password.trim()
    //   }, param: {
    //     "captcha": captcha.trim(),
    //     "captchaKey": this.captchaKey
    //   })
    // }
    // ToRegister() {
    //   this.$router.push('/register');
    // },
    // getVerifyKey(){
    //   let self = this
        // api._getv().then(res => {      
    //         console.log(res);
    //         // console.log(res['captchaKey']);
    //         // console.log(res.headers.captchaKey) 
    //         // let captchaKey  = res.headers.captchaKey;
    //         // console.log(captchaKey);
    //         this.captcha = res.data      
    //         this.captchaKey = res.headers['captchakey'] 
    //         console.log(this.captchaKey)   
    //     },err => {
    //         console.log(err);
    //     })
    // },
    getVerifyKey(){
      api._getv().then(res=>{
          const src = window.URL.createObjectURL(res.data)//这里也是关键,调用window的这个方法URL方法
          this.imgUrl = src
          this.loginForm.captchaKey = res.headers['captchakey'] 
          // console.log(this.loginForm.captchaKey)
          //this.isShowImg = true
          //console.log(this.isShowImg)
      })
    }
    // getCaptcha() {
    //   api._getv().then((response) => {
    //       this.captchaKey = response.data.captchaKey;
    //   });
    // },
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
