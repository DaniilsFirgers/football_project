<template>
  <div class="main-component">
    <div class="table-name">Violations Table</div>
    <v-table class="violations-table">
      <thead class="table-header">
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Name</th>
          <th class="text-center">Club</th>
          <th class="text-center">Violations</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, i) in violationStatsArray" :key="player.player">
          <td class="text-center">{{ i + 1 }}</td>
          <td class="text-center">{{ player.player }}</td>
          <td class="text-center">{{ player.club }}</td>
          <td class="text-center">{{ player.violations }}</td>
        </tr>
      </tbody>
    </v-table>
    <div v-if="isLoading" class="loader"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import getIndividualMatchStats from "../tables";

var playerStats = new Proxy({} as any, {
  get: (target, name) => {
    if (name in target == false)
      (target as any)[name] = { club: "", violations: 0 };
    return (target as any)[name];
  },
});

const violationStatsArray = ref<RupjakieSpeletaji[]>([]);
const isLoading = ref<Boolean>(true);

async function fillUndisciplinedPlayersTable() {
  const filteredStatsArray = await getIndividualMatchStats();
  console.log("filtered matches array", filteredStatsArray);

  filteredStatsArray.forEach((el) =>
    el.game.Komanda.forEach((team) => {
      const clubName: string = team.Nosaukums;
      if (team.Sodi) {
        if (Array.isArray(team.Sodi.Sods)) {
          // find a corresponding player by his number and search for goals
          team.Sodi.Sods.forEach((sods) => {
            const violatedPlayer = team.Speletaji.Speletajs.find(
              (player) => player.Nr === sods.Nr
            );
            const fullPlayerName = `${violatedPlayer?.Vards} ${violatedPlayer?.Uzvards}-${clubName}`;

            // TODO separate function for goals to proxy
            playerStats[fullPlayerName].club = clubName;
            playerStats[fullPlayerName].violations += 1;
          });
        } else {
          const violatedPlayerNr = (team.Sodi.Sods as any).Nr;
          const violatedPlayer = team.Speletaji.Speletajs.find(
            (player) => player.Nr === violatedPlayerNr
          );
          //   // TODO separate function for goals to proxy
          const fullPlayerName = `${violatedPlayer?.Vards} ${violatedPlayer?.Uzvards}-${clubName}`;
          playerStats[fullPlayerName].club = clubName;
          playerStats[fullPlayerName].violations += 1;
        }
      }
    })
  );
  const convertedStatsArray: RupjakieSpeletaji[] = (Object as any)
    .entries(playerStats)
    .map((el: any) => ({
      player: el[0].split("-")[0],
      club: el[1].club,
      violations: el[1].violations,
    }))
    .sort((el1: any, el2: any) => el2.violations - el1.violations);

  violationStatsArray.value = convertedStatsArray.slice(0, 10);
  if (violationStatsArray.value.length !== 0) isLoading.value = false;
  console.log("Converted vilolations data array", convertedStatsArray);
}
onMounted(() => fillUndisciplinedPlayersTable());
</script>

<style scoped>
.violations-table {
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
  justify-content: center;
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
