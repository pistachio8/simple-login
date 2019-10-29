import Vue from "vue";
import Vuex from "vuex";
import router from "../router"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: null,
    allUsers: [
      { id: 1, name: 'hoza', email: 'hoza@gmail.com', password: '123456' },
      { id: 2, name: 'hoza1', email: 'hozaaa@gmail.com', password: '123456' },
    ],
    isLogin: false,
    isLoginError: false
  },
  // state 값을 변화시키는 로직
  mutations: {
    // 로그인이 성공했을 때,
    loginSuccess( state, payload ) {
      state.isLogin = true
      state.isLoginError = false
      state.userInfo = payload
    },
    // 로그인이 실패했을 때
    loginError( state ) {
      state.isLogin = false
      state.isLoginError = true
    },
    logout( state ) {
      state.isLogin = false
      state.isLoginError = false
      state.userInfo = null
    }
  },
  // 비즈니스 로직, mutation 내에 있는 함수들을 실행시키기 위해서는 commit 명령어를 통해서 실행
  // 원래는 commit을 사용하기 위해선? context 인자 내의 commit 실행
  actions: {
    // 로그인 시도
    login( {state, commit}, loginObj ) {
        let selectedUser = null
        state.allUsers.forEach( user => {
            if ( user.email === loginObj.email ) selectedUser = user
        })

        if (selectedUser === null || selectedUser.password !== loginObj.password) 
          commit('loginError')
        else {
          commit('loginSuccess', selectedUser)
          router.push({ name: 'mypage' })
        }
    },
    logout({ commit }) {
      commit('logout')
      router.push({ name: "home" })
    }
  },
  modules: {}
});
