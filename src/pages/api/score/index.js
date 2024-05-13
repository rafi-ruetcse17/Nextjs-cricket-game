import connectDB from "@/config/ConnectDB/ConnectDB";
import { createScore, getScore, updateScore} from "@/libs/services/score-service";

export default async function handler(req, res) {
  const log =await connectDB();
  console.log("ded", log);
  try {
    
    switch (req.method) {
      case "GET":
        return await getScore(req, res);
      case "POST":
        console.log("jefd");
        return await createScore(req, res);
      case "PATCH":
        return await updateScore(req, res);
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}
