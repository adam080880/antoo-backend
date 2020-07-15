const getUserData = require("../../models/user/getUser");
const response = require("../../utils/response")

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const getUser = await getUserData();
      res.status(200).send(response(true, "List of All User", getUser))
    }
    catch (e) {
      res.status(500).send(response(false, e.message))
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params
      const getUser = await getUserData({ id: parseInt(id) });
      res.status(200).send(response(true, "User Id : " + id, getUser))
    } catch (e) {
      res.status(500).send(response(false, e.message))
    }
  }
}