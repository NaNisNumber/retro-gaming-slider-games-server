const request = require("request");
const http = require("http");
let randomSliderGames;

const gameOptionsReq = {
  url: "https://api.igdb.com/v4/games",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Client-ID": "6hygq7fbg89u6vy8y461opjapupom5",
    Authorization: "Bearer keo8g52g2qcxljtpzzgowuy6110uhq",
  },
  body: "fields cover.*;where cover!=null & themes != (42) & first_release_date <= 631152000 & rating != null;limit 400; ",
};

function generateRandomGameIndexes() {
  let randomGames = [];
  for (let i = 0; i <= 4; i++) {
    const getRandomGameIndex = function () {
      const randomGameIndex = Math.floor(Math.random() * 249 + 1);
      return randomGameIndex;
    };
    let randomGameIndex = getRandomGameIndex();
    if (randomGames.includes(randomGameIndex)) {
      randomGameIndex = getRandomGameIndex();
    }
    randomGames.push(randomGameIndex);
  }

  return randomGames;
}

const getSliderGameData = (gameData) => {
  const sliderGamesData = randomGameIndexes.map((randomGameIndex) => {
    const sliderGameImgUrl = gameData[randomGameIndex].cover.url.replace(
      "thumb",
      "cover_big"
    );
    const gameId = gameData[randomGameIndex].id;
    return { id: gameId, imgUrl: sliderGameImgUrl };
  });
  return sliderGamesData;
};
const randomGameIndexes = generateRandomGameIndexes();

request(gameOptionsReq, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    const parsedApiData = JSON.parse(body);
    const sliderGamesData = getSliderGameData(parsedApiData);
    randomSliderGames = sliderGamesData;
  }
});

const serverForSendingSliderGames = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(randomSliderGames));
});

serverForSendingSliderGames.listen(process.env.PORT || 5001, () => {});
