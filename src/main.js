import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);

localStorage.setItem("AUTH_TOKEN", "Token 468233452fed829b22909116f371d6ad3a4e1af8")

const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
