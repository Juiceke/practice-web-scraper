const typeorm = require("typeorm");
const env = require("dotenv").config();

class subReddit {
  constructor(id, title, rank, time, votes, comments) {
    this.id = id;
    this.title = title;
    this.rank = rank;
    this.time = time;
    this.votes = votes;
    this.comments = comments;
  }
}

const EntitySchema = require("typeorm").EntitySchema;

const RedditSchema = new EntitySchema({
  name: "subReddit",
  target: subReddit,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    title: {
      type: "varchar",
      default: "",
    },
    rank: {
      type: "varchar",
      default: "",
    },
    time: {
      type: "varchar",
      default: "",
    },
    votes: {
      type: "varchar",
      default: "",
    },
    comments: {
      type: "varchar",
      default: "",
    },
  },
});

async function getConnection() {
  return await typeorm.createConnection({
    type: "mysql",
    host: "localhost",
    port: "3306",
    username: "root",
    password: env.parsed.SECRET_CODE,
    database: "setuptourist",
    extra: {
      charset: "utf8mb4_unicode_ci",
    },
    synchronize: true,
    logging: false,
    entities: [RedditSchema],
  });
}

async function getAllInfo() {
  const connection = await getConnection();
  const redditRepo = connection.getRepository(subReddit);
  const reddit = await redditRepo.find();
  connection.close();
  return reddit;
}

async function insertInfo(title, rank, time, votes, comments) {
  const connection = await getConnection();

  // create
  const subreddit = new subReddit();
  subreddit.title = title;
  subreddit.rank = rank;
  subreddit.time = time;
  subreddit.votes = votes;
  subreddit.comments = comments;

  // save
  const redditRepo = connection.getRepository(subReddit);
  const res = await redditRepo.save(subreddit);
  console.log("saved", res);

  await connection.close();
  return;
}

async function deleteInfo() {
  const connection = await getConnection();
  const redditRepo = connection.getRepository(subReddit);
  await redditRepo.clear();

  const allPosts = await redditRepo.find();
  await connection.close();
  return allPosts;
}

module.exports = {
  getAllInfo,
  insertInfo,
  deleteInfo,
};
