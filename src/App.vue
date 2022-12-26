<template>
  <nav class="nav-bar">
    <div class="router-link">
      <router-link to="/">Intro</router-link>
    </div>
    <div class="router-link">
      <router-link to="/standings_table">Standings stats</router-link>
    </div>
    <div class="router-link">
      <router-link to="/undisciplined_players">Violations stats</router-link>
    </div>
    <div class="router-link">
      <router-link to="/scoring_table">Scoring stats</router-link>
    </div>

    <div>
      <v-btn @click="emptyMongoCollection" class="ma-2" color="purple"
        >Empty DB</v-btn
      >
    </div>
  </nav>
  <router-view />
</template>
<script setup lang="ts">
import axios from "axios";
function emptyMongoCollection() {
  axios.get("http://localhost:3000/empty_database").then((res) => {
    const data = res.data;
    console.log("resposne", data);
  });
}
</script>

<style>
.nav-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: #2aaa8a;
}
.router-link {
  margin-right: 10px;
  color: "purple";
}
a:hover,
a:visited,
a:link,
a:active {
  text-decoration: none;
  color: purple;
}
</style>
