import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import VueToast from "vue-toast-notification";
import PortalVue from 'portal-vue'
import Axios from "axios";

// Import the base view.
import App from "./Views/App.vue";
import Settings from "./Mixins/Settings";

// Import the bootstrap CSS.
import "bootstrap/dist/css/bootstrap.min.css";
import { Collapse } from "bootstrap";
import "vue-toast-notification/dist/theme-sugar.css";

// Disable caching on Axios calls.
Axios.defaults.headers.common["Cache-Control"] = "no-cache";
Axios.defaults.headers.common.Pragma = "no-cache";
Axios.defaults.headers.common.Expires = "0";

// Import all our views using promises.
const Home = () => import("./Views/Home.vue");
const Configuration = () => import("./Views/Configuration.vue");
const Feeds = () => import("./Views/Feeds.vue");
const Servos = () => import("./Views/Servos.vue");
const MQTT = () => import("./Views/MQTT.vue");
const General = () => import("./Views/General.vue");
const Buttons = () => import("./Views/Buttons.vue");
const Sounds = () => import("./Views/Sounds.vue");
const Email = () => import("./Views/Email.vue");
const Twitter = () => import("./Views/Twitter.vue");
const Onboard = () => import("./Views/Onboard.vue");
const Web = () => import("./Views/Web.vue");

// Create the routes.
const routes = [
  { path: "/", redirect: { name: "home" } },
  { path: "/home", component: Home, name: "home" },
  { path: "/onboard", component: Onboard, name: "onboard" },
  {
    path: "/configuration",
    component: Configuration,
    redirect: { name: "config.general" },
    name: "config",
    children: [
      {
        path: "general",
        meta: { title: "General Settings" },
        component: General,
        name: "config.general",
      },
      {
        path: "web",
        meta: { title: "Web Server Settings" },
        component: Web,
        name: "config.web",
      },
      {
        path: "feeds",
        meta: { title: "Scheduled Feeds" },
        component: Feeds,
        name: "config.feeds",
      },
      {
        path: "servos",
        meta: { title: "Servos" },
        component: Servos,
        name: "config.servos",
      },
      {
        path: "mqtt",
        meta: { title: "MQTT" },
        component: MQTT,
        name: "config.mqtt",
      },
      {
        path: "buttons",
        meta: { title: "Buttons" },
        component: Buttons,
        name: "config.buttons",
      },
      {
        path: "sounds",
        meta: { title: "Sounds" },
        component: Sounds,
        name: "config.sounds",
      },
      {
        path: "email",
        meta: { title: "Email Notifications" },
        component: Email,
        name: "config.email",
      },
      {
        path: "twitter",
        meta: { title: "Twitter Notifications" },
        component: Twitter,
        name: "config.twitter",
      },
    ],
  },
];

// Create the router.
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active",
});

// Create a div to hold our app.
let app = document.createElement("div");
document.body.append(app);

// Create the Vue app.
const vue = createApp(App);
vue.use(router);
vue.use(VueToast);
vue.use(PortalVue);
vue.mixin(Settings);
vue.config.globalProperties.$http = Axios;
vue.config.globalProperties.$bootstrap = { Collapse };
vue.mount(app);
