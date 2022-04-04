const scraper = require("./scraper");

(async () => {
  await scraper.initialize("place");

  let results = await scraper.getResults(10);

  debugger;
})();
