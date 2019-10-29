import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store'

Vue.use(VueRouter);

const rejectAuthUser = (to, from, next) => {
  if(store.state.isLogin === true) {
    // 이미 로그인 된 유저는 막아야함
    alert('이미 로그인을 하였습니다.')
    next('/') // home으로 리다이렉션
  } else {
    next() // 인자가 없으면 continue의 의미. 입장 허용
  }
}

const onlyAuthUser = (to, from, next) => {
  if(store.state.isLogin === false) {
    // 아직 로그인이 안된 유저는 막아야함
    alert('로그인이 필요한 기능입니다.')
    next('/') // login으로 리다이렉션
  } else {
    next() // 인자가 없으면 continue의 의미. 입장 허용
  }
}

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/login",
    name: "login",
    beforeEnter: rejectAuthUser,
    component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/mypage",
    name: "mypage",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "mypage" */ "../views/Mypage.vue")
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
