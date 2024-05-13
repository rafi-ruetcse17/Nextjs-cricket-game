// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectDB from "@/config/ConnectDB/ConnectDB";
import Score from "@/libs/models/matchSchema";

export default async function saveScore(req, res) {
  try{
    const log = await connectDB()
    const response = await Score.create(req.body)
    console.log("database connected!");

    res.json({response})
  }catch(error){
    res.json({error})
  }
}
