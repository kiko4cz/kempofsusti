import { ConvexHttpClient } from "convex/browser";
const client = new ConvexHttpClient("https://flippant-kiwi-891.eu-west-1.convex.cloud");

async function patch() {
  const data = await client.query("content:getContent");
  const hero = data.find(s => s.sectionId === 'hero');
  const newFields = hero.fields.map(f => {
    if (f.key === 'bg_image') {
      return { ...f, value: '/photo_2027.jpg' };
    }
    return f;
  });
  
  await client.mutation("content:updateContent", {
    id: hero._id,
    fields: newFields,
    sectionId: hero.sectionId
  });
  console.log("Updated!");
}
patch().catch(console.error);
