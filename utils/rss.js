import { Feed } from "feed";
import * as fs from "fs";
import { fetchDiaryArticles } from "./utils";

export async function generateRssFeed() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const baseUrl = process.env.BASE_URL;
  const date = new Date();
  const author = {
    name: "Takahiro Kojima",
    email: "12kojima.takahiro@gmail.com",
    link: "https://twitter.com/515hikaru",
  };

  const feed = new Feed({
    title: `515hikaru's Diary`,
    description: "Welcome to my diary!",
    id: baseUrl,
    link: baseUrl,
    language: "ja",
    image: `${baseUrl}/logo.png`,
    favicon: `${baseUrl}/favicon.png`,
    copyright: `All rights reserved ${date.getFullYear()}, Takahiro Kojima`,
    updated: date,
    generator: "Next.js using Feed for Node.js",
    feedLinks: {
      rss2: `${baseUrl}/rss/feed.xml`,
      json: `${baseUrl}/rss/feed.json`,
      atom: `${baseUrl}/rss/atom.xml`,
    },
    author,
  });

  const posts = await fetchDiaryArticles()

  posts.props.issues.forEach((issue) => {
    const post = issue.node
    const url = `${baseUrl}/diary/${post.number}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.title,
      content: post.bodyHTML,
      author: [author],
      contributor: [author],
      date: new Date(post.createdAt),
    });
  });

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
}

export default generateRssFeed;
