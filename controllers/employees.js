const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @route GET / api/employees
 * @desc Получение всех сотрудников
 * @access Private
 */
const all = async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: "Не удалось получить сотрудников" });
  }
};

/**
 * @route POST / api/employees/add
 * @desc Добавление сотрудника
 * @access Private
 */
const add = async (req, res) => {
  try {
    const { firstName, lastName, address, age } = req.body;
    console.log(req.body);
    if (!firstName || !lastName || !address || !age) {
      return res
        .status(400)
        .json({ message: "Пожалуйста, заполните обязательные поля" });
    }

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        address,
        age,
        userId: req.user.id,
      },
    });

    return res.status(201).json(employee);
  } catch {
    return res.status(500).json({ message: "Не удалось добавить сотрудника" });
  }
};

module.exports = { all, add };
