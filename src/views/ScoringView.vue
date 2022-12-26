<template>
  <div class="main-component">
    <div class="table-name">Scoring Table</div>
    <v-table class="scoring-table">
      <thead class="table-header">
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Name</th>
          <th class="text-center">Club</th>
          <th class="text-center">Goals</th>
          <th class="text-center">Assists</th>
          <th class="text-center">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, i) in scoringStatsArray" :key="player.player">
          <td class="text-center">{{ i + 1 }}</td>
          <td class="text-center">{{ player.player }}</td>
          <td class="text-center">{{ player.club }}</td>
          <td class="text-center">{{ player.goals }}</td>
          <td class="text-center">{{ player.assists }}</td>
          <td class="text-center">{{ player.points }}</td>
        </tr>
      </tbody>
    </v-table>
    <div v-if="isLoading" class="loader"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import getIndividualMatchStats from "../tables";

const scoringStatsArray = ref<RezultativakieSpeletaji[]>([]);
const isLoading = ref<Boolean>(true);

var playerStats = new Proxy({} as any, {
  get: (target, name) => {
    if (name in target == false)
      (target as any)[name] = { club: "", goals: 0, assists: 0 };
    return (target as any)[name];
  },
});

function getAssists(
  asists: { Nr: Number }[] | undefined | { Nr: Number },
  clubName: string,
  team: Komanda
) {
  // go through assists if they are in the array

  if (Array.isArray(asists)) {
    asists.forEach((assist) => {
      const assistent = team.Speletaji.Speletajs.find(
        (player) => player.Nr == assist.Nr
      );
      const playerFullName = `${assistent?.Vards} ${assistent?.Uzvards}`;
      playerStats[playerFullName].club = clubName;
      playerStats[playerFullName].assists += 1;
    });
  }
  // if there is an object and P is not undefined then access assists value
  else if (asists !== undefined) {
    const assistPlayerNr = (asists as any).Nr;
    const assistent = team.Speletaji.Speletajs.find(
      (player) => player.Nr == assistPlayerNr
    );
    const playerFullName = `${assistent?.Vards} ${assistent?.Uzvards}`;
    playerStats[playerFullName].club = clubName;
    playerStats[playerFullName].assists += 1;
  }
}
async function populateProxy() {
  const filteredStatsArray = await getIndividualMatchStats();

  filteredStatsArray.forEach((el) =>
    el.game.Komanda.forEach((team) => {
      const clubName: string = team.Nosaukums;
      if (team.Varti) {
        if (Array.isArray(team.Varti.VG)) {
          // find a corresponding player by his number and search for goals
          team.Varti.VG.forEach((goal) => {
            const goalScorer = team.Speletaji.Speletajs.find(
              (player) => player.Nr === goal.Nr
            );
            const fullPlayerName = `${goalScorer?.Vards} ${goalScorer?.Uzvards}`;

            // TODO separate function for goals to proxy
            playerStats[fullPlayerName].club = clubName;
            playerStats[fullPlayerName].goals += 1;

            // go through assists if they are in the array
            getAssists(goal.P, clubName, team);
          });
        } else {
          const goalNr = (team.Varti.VG as any).Nr;
          const assists = (team.Varti.VG as any).P;

          const goalScorer = team.Speletaji.Speletajs.find(
            (player) => player.Nr === goalNr
          );
          // TODO separate function for goals to proxy
          const fullPlayerName = `${goalScorer?.Vards} ${goalScorer?.Uzvards}`;
          playerStats[fullPlayerName].club = clubName;
          playerStats[fullPlayerName].goals += 1;

          getAssists(assists, clubName, team);
        }
      }
    })
  );

  const convertedStatsArray: RezultativakieSpeletaji[] = (Object as any)
    .entries(playerStats)
    .map((el: any) => ({
      player: el[0],
      club: el[1].club,
      goals: el[1].goals,
      assists: el[1].assists,
      points: el[1].goals + el[1].assists,
    }))
    .sort(
      (el1: any, el2: any) => el2.goals - el1.goals || el2.assists - el1.assists
    );

  console.log("converted stats", convertedStatsArray);
  scoringStatsArray.value = convertedStatsArray.slice(0, 10);
  if (scoringStatsArray.value.length !== 0) isLoading.value = false;
}
onMounted(() => {
  populateProxy();
});
</script>

<style scoped>
.scoring-table {
  border-radius: 5px;
  width: 75%;
  background: grey;
  color: white;
}
.table-header {
  color: black;
}
.main-component {
  background-color: #afe1af;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.table-name {
  font-size: 25px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: white;
}
</style>
