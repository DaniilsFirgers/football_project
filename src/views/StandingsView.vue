<template>
  <div class="main-component">
    <div class="table-name">Standings Table</div>
    <v-table class="standings-table">
      <thead class="table-header">
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Club</th>
          <th class="text-center">Total Points</th>
          <th class="text-center">Regulation Wins</th>
          <th class="text-center">Regulation Losses</th>
          <th class="text-center">Overtime Wins</th>
          <th class="text-center">Overtime Losses</th>
          <th class="text-center">Goals scored</th>
          <th class="text-center">Goals conceded</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(club, i) in standingsArray" :key="club.club">
          <td class="text-center">{{ i + 1 }}</td>
          <td class="text-center">{{ club.club }}</td>
          <td class="text-center">{{ club.totalPoints }}</td>
          <td class="text-center">{{ club.regulationWins }}</td>
          <td class="text-center">{{ club.regulationLosses }}</td>
          <td class="text-center">{{ club.overtimeWins }}</td>
          <td class="text-center">{{ club.overtimeLosses }}</td>
          <td class="text-center">{{ club.goalsScored }}</td>
          <td class="text-center">{{ club.goalsConceded }}</td>
        </tr>
      </tbody>
    </v-table>
    <div v-if="isLoading" class="loader"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import getIndividualMatchStats from "../tables";

var teamStats = new Proxy({} as any, {
  get: (target, name) => {
    if (name in target == false)
      (target as any)[name] = {
        points: 0,
        regulationWins: 0,
        overtimeWins: 0,
        regulationLosses: 0,
        overtimeLosses: 0,
        goalsScored: 0,
        goalsConceded: 0,
      };
    return (target as any)[name];
  },
});

const standingsArray = ref<KomanduPozicijas[]>([]);
const isLoading = ref<Boolean>(true);

function countTeamGoals(teamGoals: VG | VG[] | undefined) {
  var numberOfGoals: number = 0;
  if (Array.isArray(teamGoals)) {
    numberOfGoals = teamGoals.length;
  } else if (teamGoals !== undefined) {
    numberOfGoals = 1;
  }
  return numberOfGoals;
}

function getLatestGoalTime(game: Spele) {
  var lastGoalTime: number = 0;
  game.Komanda.forEach((team) => {
    if (team.Varti) {
      if (Array.isArray(team.Varti.VG)) {
        team.Varti.VG.forEach((goal) => {
          var splitTime = goal.Laiks.split(":");
          var goalTimeToSec =
            parseInt(splitTime[0]) * 60 + parseInt(splitTime[1]);

          if (goalTimeToSec > lastGoalTime) lastGoalTime = goalTimeToSec;
        });
      } else {
        const goalTime = (team.Varti.VG as any).Laiks;
        var splitTime = goalTime.split(":");
        var goalTimeToSec =
          parseInt(splitTime[0]) * 60 + parseInt(splitTime[1]);

        if (goalTimeToSec > lastGoalTime) lastGoalTime = goalTimeToSec;
      }
    }
  });
  return lastGoalTime;
}

function addTeamStatistics(
  lastGoalTimeInSec: number,
  firstTeamGoals: number,
  secondTeamGoals: number,
  firstTeam: string,
  secondTeam: string
) {
  if (lastGoalTimeInSec < 60 * 60) {
    if (firstTeamGoals > secondTeamGoals) {
      teamStats[firstTeam].regulationWins += 1;
      teamStats[firstTeam].points += 5;
      teamStats[secondTeam].regulationLosses += 1;
      teamStats[secondTeam].points += 1;
    } else {
      teamStats[secondTeam].regulationWins += 1;
      teamStats[secondTeam].points += 5;
      teamStats[firstTeam].regulationLosses += 1;
      teamStats[firstTeam].points += 1;
    }
  } else {
    if (firstTeamGoals > secondTeamGoals) {
      teamStats[firstTeam].overtimeWins += 1;
      teamStats[firstTeam].points += 3;
      teamStats[secondTeam].overtimeLosses += 1;
      teamStats[secondTeam].points += 2;
    } else {
      teamStats[secondTeam].overtimeWins += 1;
      teamStats[secondTeam].points += 3;
      teamStats[firstTeam].overtimeLosses += 1;
      teamStats[firstTeam].points += 2;
    }
  }
}

async function fetchStandingsTable() {
  const matchStats = await getIndividualMatchStats();
  console.log("filtered matches", matchStats);

  matchStats.forEach((el) => {
    const firstTeam = el.game.Komanda[0].Nosaukums;
    const secondTeam = el.game.Komanda[1].Nosaukums;

    const firstTeamGoals = countTeamGoals(el.game.Komanda[0].Varti.VG);
    const secondTeamGoals = countTeamGoals(el.game.Komanda[1].Varti.VG);
    const lastGoalTimeInSec = getLatestGoalTime(el.game);

    addTeamStatistics(
      lastGoalTimeInSec,
      firstTeamGoals,
      secondTeamGoals,
      firstTeam,
      secondTeam
    );

    el.game.Komanda.forEach((team) => {
      const clubName: string = team.Nosaukums;
      var scoresGoals: string;
      var concedesGoals: string;
      clubName === firstTeam
        ? ((scoresGoals = firstTeam), (concedesGoals = secondTeam))
        : ((scoresGoals = secondTeam), (concedesGoals = firstTeam));

      if (team.Varti) {
        if (Array.isArray(team.Varti.VG)) {
          // find a corresponding player by his number and search for goals
          team.Varti.VG.forEach(() => {
            teamStats[scoresGoals].goalsScored += 1;
            teamStats[concedesGoals].goalsConceded += 1;
          });
        } else if ((team.Varti as any) !== "") {
          teamStats[scoresGoals].goalsScored += 1;
          teamStats[concedesGoals].goalsConceded += 1;
          // TODO separate function for goals to proxy
        }
      }
    });
  });
  const convertedStandingsArray: KomanduPozicijas[] = (Object as any)
    .entries(teamStats)
    .map((el: any) => ({
      club: el[0],
      totalPoints: el[1].points,
      regulationWins: el[1].regulationWins,
      regulationLosses: el[1].regulationLosses,
      overtimeWins: el[1].overtimeWins,
      overtimeLosses: el[1].overtimeLosses,
      goalsScored: el[1].goalsScored,
      goalsConceded: el[1].goalsConceded,
    }))
    .sort((el1: any, el2: any) => el2.totalPoints - el1.totalPoints);
  standingsArray.value = convertedStandingsArray;
  if (standingsArray.value.length !== 0) isLoading.value = false;
  console.log("Converted team standings array", convertedStandingsArray);
}

onMounted(() => fetchStandingsTable());
</script>

<style>
.standings-table {
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

.loader {
  margin-top: 50px;
  border: 16px solid #f3f3f3;
  border-top: 16px solid #2aaa8a;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
