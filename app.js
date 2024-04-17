const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server Is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`Data base Error is ${error}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// API 1: Get all players
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT player_id as playerId, player_name as playerName, jersey_number as jerseyNumber, role FROM cricket_team`;
  const players = await database.all(getPlayersQuery);
  response.send(players);
});

// API 2: Post a player into database
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const createPlayerQuery = `INSERT INTO cricket_team(player_name, jersey_number, role) VALUES('${playerName}', ${jerseyNumber}, '${role}')`;
  await database.run(createPlayerQuery);
  response.send(`Player Added to Team`);
});

// API 3: Get player details by ID
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetailsQuery = `SELECT player_id as playerId, player_name as playerName, jersey_number as jerseyNumber, role FROM cricket_team WHERE player_id = ${playerId}`;
  const player = await database.get(getPlayerDetailsQuery);
  response.send(player);
});

// API 4: Update the details of the player using player ID
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatePlayerDetailsQuery = `UPDATE cricket_team SET player_name = '${playerName}', jersey_number = ${jerseyNumber}, role = '${role}' WHERE player_id = ${playerId}`;
  await database.run(updatePlayerDetailsQuery);
  response.send("Player Details Updated");
});

// API 5: Delete the player details
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
