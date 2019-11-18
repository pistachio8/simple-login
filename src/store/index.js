import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import axios from "axios";

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
      localStorage.removeItem("access_token");
    }
  },
  // 비즈니스 로직, mutation 내에 있는 함수들을 실행시키기 위해서는 commit 명령어를 통해서 실행
  // 원래는 commit을 사용하기 위해선? context 인자 내의 commit 실행
  actions: {
    // 로그인 시도
    login({dispatch}, loginObj) {
      // 로그인 -> 토큰 반환
      axios
        .post('https://reqres.in/api/login', loginObj) // 파라미터(body)
        .then( res => {
          // 성공시 token이 돌아옴(실제로는 user_id 값을 받아옴)
          // 토큰을 헤더에 포함시켜서 유저 정보를 요청
            // 헤더에 토큰을 포함시키기 위해 사용
            let token = res.data.token
            // 토큰을 로컬스토리지에 저장
            localStorage.setItem("access_token", token);
            // 액션 실행
            dispatch("getMemberInfo")
        })
        .catch( err => {
          alert('이메일과 비밀번호를 확인하세요.')
          console.log(err);
        })
    },
    logout({ commit }) {
      commit('logout')
      router.push({ name: "home" })
    },
    getMemberInfo({commit}) {
      // 로컬 스토리지에 저장되어 있는 토큰을 불러온다.
      let token = localStorage.getItem("access_token");

      let config = {
        headers: {
          "access-token": token
        }
      }
      // 토큰 -> 멤버 정보를 반환
      // 새로고침 -> 토큰만 가지고 멤버정보를 요청
      axios
        .get("https://reqres.in/api/user/2", config) // 보안과 관련된 설정
        .then(response => {
          console.log(response);
          
          let userInfo = {
            id: response.data.data.id,
            name: response.data.data.name,
            color: response.data.data.color
          }
          commit('loginSuccess', userInfo)
        })
        .catch(error=> {
          alert('이메일과 비밀번호를 확인하세요.')
          console.log(error);
        })
    }
  },
  modules: {}
});
