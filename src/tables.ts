import axios from "axios";

async function getIndividualMatchStats() {
  const res = await axios.get("http://localhost:3000/get_football_data");

  const data: Response[] = res.data;
  console.log("response from the db", data);
  const uniqueGamesFirstTeam = data.map((el) => ({
    game: el.Spele,
    teamUniqueId: `${el.Spele.Laiks}${el.Spele.Komanda[0].Nosaukums}`,
    matchUniqueId: `${el.Spele.Laiks}${el.Spele.Komanda[0].Nosaukums}${el.Spele.Komanda[1].Nosaukums}`,
  }));
  const uniqueGamesSecondTeam = data.map((el) => ({
    game: el.Spele,
    teamUniqueId: `${el.Spele.Laiks}${el.Spele.Komanda[1].Nosaukums}`,
    matchUniqueId: `${el.Spele.Laiks}${el.Spele.Komanda[0].Nosaukums}${el.Spele.Komanda[1].Nosaukums}`,
  }));
  const uniqueGamesMerged = [...uniqueGamesFirstTeam, ...uniqueGamesSecondTeam];

  var teamIdKey: "teamUniqueId" = "teamUniqueId";
  const filteredTeamArray = [
    ...new Map(
      uniqueGamesMerged.map((item) => [item[teamIdKey], item])
    ).values(),
  ];

  var matchIdKey: "matchUniqueId" = "matchUniqueId";
  const filteredUniqueGamesArray = [
    ...new Map(
      filteredTeamArray.map((item) => [item[matchIdKey], item])
    ).values(),
  ];

  return filteredUniqueGamesArray;
}

export default getIndividualMatchStats;
