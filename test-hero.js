import { ConvexHttpClient } from "convex/browser";
const client = new ConvexHttpClient("https://flippant-kiwi-891.eu-west-1.convex.cloud");
client.query("content:getContent").then(data => {
  const hero = data.find(s => s.sectionId === 'hero');
  console.log(JSON.stringify(hero, null, 2));
});
