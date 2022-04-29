const redditBtn = document.querySelector("#redditbtn");
const href = window.location.href;
// button that searches based on text box
redditBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const dataresult = await getData();
  await loadData();
});

async function getData() {
  // the input fot text
  const redditTxt = document.querySelector("#reddittxt").value;
  const redditNmb = document.querySelector("#redditnmb").value;
  if (redditNmb > 100) {
    return;
  }
  const response = await fetch(href + "scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ redditTxt, redditNmb }),
  });

  if (response.ok) {
    const json = response.json();
    return json;
  }

  throw new Error(
    `Error from server ${response.status} : ${response.statusText}`
  );
}

async function loadData() {
  const res = await fetch(href + "scrape");
  const redditPosts = await res.json();

  const cards = document.querySelectorAll(".card");

  // remove all cards
  cards.forEach((card) => {
    card.remove();
  });

  const redditData = document.querySelector(".subReddits");

  redditPosts.forEach((post) => {
    // make cards for every post to nestle into
    const card = document.createElement("div");
    // give card a class for css + to add a delete target
    card.classList.add("card");
    // make the title element
    const title = document.createElement("h4");
    title.classList.add("title");
    title.innerText = post.title;
    // make the rank element
    const rank = document.createElement("h5");
    rank.classList.add("rank");
    // make the area under the title say if it's either a Pinned post or it's rank
    if (!post.rank) {
      rank.innerText = "This is a Pinned post!";
    } else {
      rank.innerText = "Rank: " + post.rank;
    }
    // make the time element
    const time = document.createElement("h5");
    time.classList.add("time");
    time.innerText = "This was posted " + post.time + "!";
    // make the votes element
    const votes = document.createElement("h5");
    votes.classList.add("votes");
    votes.innerText = "This post has " + post.votes + " upvotes!";
    // make the comments element
    const comments = document.createElement("h5");
    comments.classList.add("rank");
    comments.innerText = "This post has " + post.comments;
    // append the elements to the cards
    card.appendChild(title);
    card.appendChild(rank);
    card.appendChild(votes);
    card.appendChild(time);
    card.appendChild(comments);

    // append the cards to the page
    redditData.appendChild(card);
  });
}

loadData();
