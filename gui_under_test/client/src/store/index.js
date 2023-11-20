import { createStore } from 'vuex' // VuexのパッケージからcreateStore という関数をインポート

export const store = createStore({ 
  state: {
    session: null,
  },
  getters:{
    session(state){
      return state.session  || {}
    }
  },
  mutations: {
    session( state , session ){
      state.session = session
    }
  },
  actions: {
  }
})