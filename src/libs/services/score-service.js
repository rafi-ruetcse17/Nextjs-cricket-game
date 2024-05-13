import scoreRepository from "../repository/score-repository";

export const createScore = async (req, res) => {
  try {
    const response = await scoreRepository.createScore({ data: req.body });
    return res.status(200).json(response._id);
  } catch (error) {
    return res.status(500).json({error})
  }
};

export const updateScore = async (req, res) => {
  try {
    const response = await scoreRepository.updateScore({ data: req.body });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({error})
  }
};

export const getScore = async (req, res) => {
  try {
    const {matchId} = req.query
    const response = await scoreRepository.getScore({ data: matchId });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
};


