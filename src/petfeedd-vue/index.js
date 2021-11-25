import Vue from "vue";
import VueRouter from "vue-router";
import VueToast from 'vue-toast-notification';
import Axios from 'axios';

// Import the base view.
import App from "./Views/App.vue";

// Import the bootstrap CSS.
import "bootstrap/dist/css/bootstrap.min.css";
import 'vue-toast-notification/dist/theme-sugar.css';

// Add plugins.
Vue.use(VueRouter);
Vue.use(VueToast);
Vue.prototype.$http = Axios;

// Disable caching on Axios calls.
Vue.prototype.$http.defaults.headers = {
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Import all our views using promises.
const Home = () => import("./Views/Home.vue");
const Configuration = () => import("./Views/Configuration.vue");
const Feeds = () => import("./Views/Feeds.vue");
const Servos = () => import("./Views/Servos.vue");
const MQTT = () => import("./Views/MQTT.vue");

// Create the routes.
const routes = [
  { path: "/", redirect: { name: "home" } },
  { path: "/home", component: Home, name: "home" },
  { path: "/configuration", component: Configuration, redirect: { name: "config.feeds" }, name: "config", children: [
    { path: "feeds", component: Feeds, name: "config.feeds"},
    { path: "servos", component: Servos, name: "config.servos"},
    { path: "mqtt", component: MQTT, name: "config.mqtt"},
  ] },
];

// Create the router.
const router = new VueRouter({
  routes,
  linkActiveClass: "active"
});

// Creete a div to hold our app.
let app = document.createElement('div');
document.body.append(app);

// Create the vue app!
new Vue({
  router,
  render: (h) => h(App),
}).$mount(app);
