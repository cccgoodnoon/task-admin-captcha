import Cookies from 'js-cookie'
import axios from 'axios'
// import qs from 'qs'


const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 延时设置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.params = {}
// POST传参序列化
// request拦截器 原在request.js
axios.interceptors.request.use((config) => {
  // if (config.method === 'post') {
  //     config.data = qs.stringify(config.data)
  // }
  const URL = config.url.split(config.baseURL)
  return config
}, (error) => {
  return Promise.reject(error)
})  
// 返回状态判断
axios.interceptors.response.use((res) => {
  return res
}, (error) => {
  return Promise.reject(error)
})

// 封装获取数据
export const oGet = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
};

export function ooGet(url,params){
  return new Promise((resolve, reject) => {
    axios({
      url:url,
      methods:'get',
      params:params,
      responseType: "blob",//改变接收的值类型
    }).then(res=>{
      resolve(res)
    }),err =>{
      reject(err)
    }
  })
}
// 封装发送数据
export const oPost = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        // reject(err)
        return Promise.reject(err);
      })
  })
}

export function ooPost(url, data, params){
  return new Promise((resolve, reject) => {
    axios({
      method:'post', //不是methods
      url:url, 
      data:data,
      params:params,
    }).then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
        console.log(111);
      }).catch(err => { 
        return Promise.reject(err);
      })
  })
}


// 封装更新数据
export const oUpdate = (url, param) => {
  return new Promise((resolve, reject) => {
    axios.put(url, param)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

// 封装删除数据
export const oRemove = (url, params) => {
  return new Promise((resolve,reject) => {
    axios.delete(url, params)
      .then(res => {
        resolve(res.data)
      },err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

export default {
  _get() {
    // return oGet('http://127.0.0.1:5000/rest/anon/tasks');
    return oGet('http://47.111.234.116:8080/api/admin/tasks')
  },
  _gets(params) {
    return oGet('http://47.111.234.116:8080/api/admin/tasks/' + params)
  },  
  _post(params) {
    return oPost('http://47.111.234.116:8080/api/admin/task/new',params)
  },  
  _update(id, param) {
    return oUpdate('http://47.111.234.116:8080/api/admin/tasks/v/' + id, param)
  },
  // 删除单个用户
  _remove(user){
    var userid = user.id;
    return oRemove('http://47.111.234.116:8080/api/admin/tasks/e/' + userid)     
  },
  // 批量删除
  // _removes(param){
  //   return oRemove('http://47.111.234.116:8080/rest/anon/tasks/' + param)
  // },
  // _register(params) {
  //   return oPost('http://120.26.39.25:8081/idm/auth/register/email',params)
  // },
  _getv(){
    return ooGet('http://120.26.39.25:8081/idm/auth/captcha')
  },
  _postin(data,params) {
    return ooPost('http://120.26.39.25:8081/idm/auth/login/email',data,params)
  }, 
}
