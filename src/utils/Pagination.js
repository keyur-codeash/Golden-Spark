// import connectToDB from "@/lib/dbConnect";
// const { MongoClient } = require("mongodb");

// export const as function getFilterData({
//   model,
//   pageSize,
//   pageNumber,
//   sort,
//   filter,
// }) {
//   const db = await connectToDB();
//   const collection = await db.collection(model);
//   const [
//     {
//       total: [total = 0],
//       edges,
//     },
//   ] = await collection
//     .aggregate([
//       { $match: filter },
//       {
//         $facet: {
//           total: [{ $group: { _id: null, count: { $sum: 1 } } }],
//           edges: [
//             { $sort: sort },
//             { $skip: pageSize * (pageNumber - 1) },
//             { $limit: pageSize },
//           ],
//         },
//       },
//       {
//         $project: {
//           total: "$total.count",
//           edges: "$edges",
//         },
//       },
//     ])
//     .toArray();
//   await client.close();

//   return { total, edges };
// };
