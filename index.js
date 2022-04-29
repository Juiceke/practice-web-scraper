const scraper = require("./scraper");
const path = require("path");
const db = require("./db");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// make index.html accessible to clients
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// make localhost active at 3001
app.listen(PORT, () => {
  console.log("app is listening on port 3001");
});

// send html to webpage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/redditScrape.html");
});

// use scraped info
app.get("/scrape", async (req, res) => {
  const redditPosts = await db.getAllInfo();
  res.send(redditPosts);
});

// send scraped data to the server
app.post("/scrape", async function (req, res) {
  await scraper.initialize(req.body.redditTxt);
  let results = await scraper.getResults(req.body.redditNmb);
  await db.deleteInfo();
  for (let i = 0; i < results.length; i++) {
    await db.insertInfo(
      results[i].title,
      results[i].rank,
      results[i].time,
      results[i].votes,
      results[i].comments
    );
  }
  const redditPosts = await db.getAllInfo();
  res.send(redditPosts);
});
