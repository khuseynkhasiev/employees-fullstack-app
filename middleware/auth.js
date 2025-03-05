const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/prisma-client");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Не авторизован" });
  }
};

module.exports = {
  auth,
};
