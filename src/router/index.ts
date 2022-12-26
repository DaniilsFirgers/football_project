import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "introSection",
    component: () => import("../views/IntroView.vue"),
  },
  {
    path: "/standings_table",
    name: "standingsTable",
    component: () => import("../views/StandingsView.vue"),
  },
  {
    path: "/undisciplined_players",
    name: "undisciplinedPlayers",
    component: () => import("../views/ViolationsView.vue"),
  },
  {
    path: "/scoring_table",
    name: "scoringTable",

    component: () => import("../views/ScoringView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
