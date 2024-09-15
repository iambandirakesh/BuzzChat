import UserModel from "../models/user.model.js";
export const searchUser = async (req, res) => {
  try {
    const { search } = req.body;
    const query = new RegExp(search, "i", "g");
    const user = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");
    return res.json({
      message: "all user",
      data: user,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
    });
  }
};
