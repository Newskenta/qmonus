import axios from 'axios'
import { store } from '../store/index.js'

export const api = axios.create({
})

api.interceptors.request.use(
  (config) => {

    config.baseURL = store.getters.session.backend;
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

const getSession = async (reflesh=false)=>{
    return new Promise((resolve,reject)=>{
      
  
      const getSessionImpl = (retry)=>{
  
        axios.get( `/session` , { params : retry ? { reflesh:true } : undefined } )
        .then(res=>{
          store.commit("session" , res.data )
          resolve(res.data);
        })
        .catch(ex=>{
          if( !retry )
            return getSessionImpl(true)
          store.commit("error" , ex )
          reject(ex)
        })
      }
      getSessionImpl(reflesh)
    })
  }

export default {
    getSession : getSession , 
    install(app) {
      app.config.globalProperties.$api = api
    }
  }