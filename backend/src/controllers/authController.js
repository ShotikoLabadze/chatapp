const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body;

      const user = await authService.register(email, password);

      res.json({ msg: "User registered", user });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const data = await authService.login(email, password);

      res.json(data);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
}

module.exports = new AuthController();
