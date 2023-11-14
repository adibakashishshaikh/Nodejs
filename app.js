const express = require("express");
const bodyParser = require("body-parser");

const dbHandler = require("./connections");
const userRouter = require("./userRouter")(dbHandler);

const app = express();
let server = null;
const port = Number(process.env.SERVERPORT) || 3000;

const signals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGTERM: 15,
};

app.use(bodyParser.json());

// Use the userRouter for '/users' path
app.use("/users", userRouter);

// //Get All Users

// app.get("/users/all", async (req, res) => {
//   try {
//     const users = await dbHandler.query(`select * from users`);
//     res.status(200).json({
//       result: "SUCCESS",
//       message: users?.rows ?? [],
//     });
//   } catch (error) {
//     res.status(500).json({
//       result: "ERROR",
//       message: error.message,
//     });
//   }
// });

// app.get("/users/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const users = await dbHandler.query(`select * from users where id=$1`, [
//       userId,
//     ]);
//     //const user = await dbHandler.query(`select * from users where id=${id}`);

//     if (!users.rows[0]) {
//       throw new Error(`user with id:${id} does not exist`);
//     }

//     res.status(200).json({
//       result: "SUCCESS",
//       message: users?.rows ?? [],
//     });
//   } catch (error) {
//     res.status(500).json({
//       result: "ERROR",
//       message: error.message,
//     });
//   }
// });

// app.get("/users/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const userExistsQuery = "SELECT * FROM users WHERE id = $1";
//     const user = await dbHandler.query(userExistsQuery, [userId]);

//     if (user.rows.length === 0) {
//       return res.status(404).json({
//         result: "ERROR",
//         message: `User not found for ID: ${userId}`,
//       });
//     }

//     const usersQuery = "SELECT * FROM users WHERE id = $1";
//     const users = await dbHandler.query(usersQuery, [userId]);

//     res.status(200).json({
//       result: "SUCCESS",
//       message: users?.rows ?? [],
//     });
//   } catch (error) {
//     res.status(500).json({
//       result: "ERROR",
//       message: error.message,
//     });
//   }
// });

// add user

// app.post("users/create", async (req, res) => {
//   try {
//     const { id, firstname, lastname, location } = req.body;

//     const result = await dbHandler.query(
//       "INSERT INTO users ( id,firstname,lastname,location) VALUES ($1, $2, $3,$4) RETURNING id",
//       [id, firstname, lastname, location]
//     );

//     res.status(201).json({
//       result: "SUCCESS",
//       message: `User with ID ${result.rows[0].id} has been created`,
//     });
//   } catch (error) {
//     res.status(500).json({
//       result: "ERROR",
//       message: error.message,
//     });
//   }
// });

// Update User Details
// app.post("users/update", async (req, res) => {
//   try {
//     const { id, firstname, lastname, location } = req.body;
//     const user = await dbHandler.query(`select * from users where id=${id}`);

//     if (!user.rows[0]) {
//       throw new Error(`user with id:${id} does not exist`);
//     }

//     const updateQuery =
//       "UPDATE users SET  firstname = $2, lastname = $3, location = $4 WHERE id = $1";
//     const updateValues = [id, firstname, lastname, location];
//     await dbHandler.query(updateQuery, updateValues);
//     const updatedUser = await dbHandler.query(
//       `select * from users where id=${id}`
//     );

//     res.status(200).json({
//       result: "SUCCESS",
//       message: updatedUser.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       result: "ERROR",
//       message: error.message,
//     });
//   }
// });

//delete user
// app.delete("/users/:delete", async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const deleteQuery = "DELETE FROM users WHERE id = $1";
//     await dbHandler.query(deleteQuery, [userId]);

//     res.status(200).json({
//       result: "SUCCESS",
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       result: "ERROR",
//       message: error.message,
//     });
//   }
// });

const connectDatabase = async () => {
  try {
    await dbHandler.connect();
    await dbHandler.query("select 1");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

const startServer = async () => {
  try {
    await connectDatabase();
    console.log("Database connected  successfully");

    server = app.listen({ port }, () =>
      console.log(`Server listening at port: ${port}`)
    );
  } catch (error) {
    console.error("Server startup error:", error);
    await stopServer();
  }
};

const disconnectDatabase = async () => {
  try {
    console.log("database disconnecting...");
    await dbHandler.end();
    console.log("database disconnected successfully");
  } catch (err) {
    console.log("error while disconnecting database", err);
  }
};

const stopServer = async () => {
  try {
    await disconnectDatabase();
    if (server) {
      console.log("stoping the server...");
      await server.close();
      console.log("server stopped successfully");
    }
  } catch (error) {
    console.error("Error during server shutdown :", error);
  } finally {
    process.exit(1);
  }
};

const shutdown = async (signal, value) => {
  await stopServer();
  console.log(`Server stopped by ${signal} with value ${value}`);
  process.exit(128 + value);
};

Object.keys(signals).forEach((signal) => {
  process.on(signal, async () => {
    console.log(`Process received a ${signal} signal`);
    await shutdown(signal, signals[signal]);
  });
});

startServer();
