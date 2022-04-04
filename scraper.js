const puppeteer = require("puppeteer");

const SUBREDDIT_URL = (scraper) => `https://old.reddit.com/r/${scraper}/`;

const self = {
  browser: null,
  page: null,

  initialize: async (scraper) => {
    self.browser = await puppeteer.launch({
      headless: false,
    });
    self.page = await self.browser.newPage();

    // go to the subreddit
    await self.page.goto(SUBREDDIT_URL(scraper), { waitUnti: `networkidle0` });
  },
  getResults: async (nr) => {
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

      console.log(title, comments, rank, time, votes);

      results.push({
        title,
        rank,
        time,
        votes,
        comments,
      });
    }
    return results;
  },
};

module.exports = self;
