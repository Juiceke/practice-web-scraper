const puppeteer = require("puppeteer");

const SUBREDDIT_URL = (scraper) => `https://old.reddit.com/r/${scraper}/`;

const self = {
  browser: null,
  page: null,

  initialize: async (scraper) => {
    self.browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    self.page = await self.browser.newPage();

    // go to the subreddit
    await self.page.goto(SUBREDDIT_URL(scraper), { waitUntil: `networkidle0` });
  },
  getResults: async (nr) => {
    let results = [];

    do {
      let new_results = await self.parseResults();

      results = [...results, ...new_results];

      if (results.length < nr) {
        let nextPageButton = await self.page.$(
          'span[class="next-button"] > a[rel="nofollow next"]'
        );

        if (nextPageButton) {
          await nextPageButton.click();
          await self.page.waitForNavigation({ waitUntil: "networkidle0" });
        } else {
          break;
        }
      }
    } while (results.length < nr);

    return results.slice(0, nr);
  },

  parseResults: async (nr) => {
    let elements = await self.page.$$('#siteTable > div[class*="thing"]');
    let results = [];

    for (let element of elements) {
      let title = await element.$eval('p[class="title"]', (node) =>
        node.innerText.trim()
      );

      let rank = await element.$eval('span[class="rank"]', (node) =>
        node.innerText.trim()
      );

      let time = await element.$eval('p[class="tagline "] > time', (node) =>
        node.innerText.trim()
      );

      let votes = await element.$eval('div[class="score unvoted"]', (node) =>
        node.innerText.trim()
      );

      let comments = await element.$eval(
        'a[data-event-action="comments"]',
        (node) => node.innerText.trim()
      );

      results.push({
        title,
        rank,
        time,
        votes,
        comments,
      });
    }

    // console.log(results);

    console.log("session closed");
    return results;
  },
};

module.exports = self;
