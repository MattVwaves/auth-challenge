const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET;

const getAllMovies = async (req, res) => {
  const { id } = req.params;
  const movies = await prisma.movie.findMany({
    where: {
      userId: Number(id),
    },
  });

  res.json({ data: movies });
};

const createMovie = async (req, res) => {
  const { title, description, runtimeMins, userId } = req.body;
  const token = req.headers.authorization.split(" ")[1];

  try {
    jwt.verify(token, secret);
  } catch (e) {
    return res.status(401).json({ error: "Invalid token provided." });
  }

  const createdMovie = await prisma.movie.create({
    data: {
      title: title,
      description: description,
      runtimeMins: runtimeMins,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  res.json({ data: createdMovie });
};

module.exports = {
  getAllMovies,
  createMovie,
};
