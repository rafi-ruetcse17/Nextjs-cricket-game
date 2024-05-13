import Score from "../models/matchSchema";

const createScore = async ({ data }) => {
  const response = await Score.create(data);
  return response;
};
const updateScore = async ({data}) =>{
  const response = await Score.findByIdAndUpdate(data._id, data);
  return response;
}
const getScore = async({data}) => {
  const response = await Score.findById(data)
  return response;
}

const scoreRepository = {
  createScore,
  updateScore,
  getScore,
};

export default scoreRepository;
