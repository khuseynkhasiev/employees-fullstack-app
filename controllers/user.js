const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 *@route POST /api/user/login
 *@desc Логин
 *@acces Public
 */

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, заполните обязательные поля" });
  }
  const user = await prisma.user.findFirst({ where: { email } });

  const isPasswordCorrect =
    user && (await bcrypt.compare(password, user.password));

  if (user && isPasswordCorrect) {
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      //   token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      //     expiresIn: "1h",
      //   }),
    });
  }
  return res.status(400).json({ message: "Неверно введен логин или пароль" });
};

/**
 * @route POST /api/user/register
 * @desc Регистрация
 * @access Public
 */
const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, заполните обязательные поля" });
  }

  const registered = await prisma.user.findFirst({ where: { email } });
  if (registered) {
    return res.status(400).json({ message: "Этот email уже зарегистрирован" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  const secret = process.env.JWT_SECRET;

  if (user && secret) {
    return res.status(201).json({
      data: {
        id: user.id,
        email: user.email,
        name,
        token: jwt.sign({ id: user.id }, secret, {
          expiresIn: "1h",
        }),
      },
    });
  }
  return res.status(400).json({ message: "Не удалось создать пользователя" });
};

const current = async (req, res, next) => {
  res.send("current");
};

module.exports = {
  login,
  register,
  current,
};
