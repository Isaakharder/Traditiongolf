var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer } from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  courses: () => courses,
  coursesRelations: () => coursesRelations,
  holes: () => holes,
  holesRelations: () => holesRelations,
  individualRounds: () => individualRounds,
  individualRoundsRelations: () => individualRoundsRelations,
  individualScores: () => individualScores,
  individualScoresRelations: () => individualScoresRelations,
  insertCourseSchema: () => insertCourseSchema,
  insertHoleSchema: () => insertHoleSchema,
  insertIndividualRoundSchema: () => insertIndividualRoundSchema,
  insertIndividualScoreSchema: () => insertIndividualScoreSchema,
  insertPlayerSchema: () => insertPlayerSchema,
  insertScoreSchema: () => insertScoreSchema,
  insertTeamSchema: () => insertTeamSchema,
  insertTournamentSchema: () => insertTournamentSchema,
  insertUserSchema: () => insertUserSchema,
  players: () => players,
  playersRelations: () => playersRelations,
  scores: () => scores,
  scoresRelations: () => scoresRelations,
  teams: () => teams,
  teamsRelations: () => teamsRelations,
  tournaments: () => tournaments,
  tournamentsRelations: () => tournamentsRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  par: integer("par").notNull(),
  yardage: integer("yardage").notNull(),
  rating: text("rating").notNull()
});
var holes = pgTable("holes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  holeNumber: integer("hole_number").notNull(),
  par: integer("par").notNull(),
  yardage: integer("yardage").notNull(),
  handicap: integer("handicap").notNull(),
  holeSetName: text("hole_set_name").notNull().default("Main")
  // e.g., "Front 9", "Back 9", "Red 9", "Gold 9"
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  code: text("code").notNull().unique(),
  handicap: integer("handicap").notNull(),
  isActive: boolean("is_active").default(true)
});
var players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  handicap: integer("handicap").notNull()
});
var teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  player1Id: integer("player1_id").notNull(),
  player2Id: integer("player2_id").notNull(),
  user1Id: integer("user1_id").references(() => users.id),
  user2Id: integer("user2_id").references(() => users.id),
  courseId: integer("course_id").notNull(),
  tournamentId: integer("tournament_id").references(() => tournaments.id),
  isActive: boolean("is_active").default(true)
});
var scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  holeNumber: integer("hole_number").notNull(),
  strokes: integer("strokes").notNull(),
  scoreToPar: integer("score_to_par").notNull()
});
var tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  courseId: integer("course_id").notNull(),
  accessCode: text("access_code").notNull().unique(),
  isActive: boolean("is_active").default(true)
});
var individualRounds = pgTable("individual_rounds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  selectedHoleSets: jsonb("selected_hole_sets").notNull().default("[]"),
  // Array of hole set names to play
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  totalScore: integer("total_score"),
  totalStrokes: integer("total_strokes"),
  isCompleted: boolean("is_completed").default(false)
});
var individualScores = pgTable("individual_scores", {
  id: serial("id").primaryKey(),
  roundId: integer("round_id").notNull().references(() => individualRounds.id),
  holeNumber: integer("hole_number").notNull(),
  strokes: integer("strokes").notNull(),
  scoreToPar: integer("score_to_par").notNull()
});
var insertCourseSchema = createInsertSchema(courses).omit({
  id: true
});
var insertHoleSchema = createInsertSchema(holes).omit({
  id: true
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  code: true
});
var insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  code: true
});
var insertTeamSchema = createInsertSchema(teams).omit({
  id: true
});
var insertScoreSchema = createInsertSchema(scores).omit({
  id: true
});
var insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  accessCode: true
});
var insertIndividualRoundSchema = createInsertSchema(individualRounds).omit({
  id: true,
  startTime: true,
  endTime: true,
  totalScore: true,
  totalStrokes: true,
  isCompleted: true
}).extend({
  selectedHoleSets: z.array(z.string()).default([])
});
var insertIndividualScoreSchema = createInsertSchema(individualScores).omit({
  id: true
});
var coursesRelations = relations(courses, ({ many }) => ({
  holes: many(holes),
  teams: many(teams),
  tournaments: many(tournaments),
  individualRounds: many(individualRounds)
}));
var holesRelations = relations(holes, ({ one }) => ({
  course: one(courses, {
    fields: [holes.courseId],
    references: [courses.id]
  })
}));
var usersRelations = relations(users, ({ many }) => ({
  teamsAsUser1: many(teams, { relationName: "user1" }),
  teamsAsUser2: many(teams, { relationName: "user2" }),
  individualRounds: many(individualRounds)
}));
var playersRelations = relations(players, ({ many }) => ({
  teamsAsPlayer1: many(teams, { relationName: "player1" }),
  teamsAsPlayer2: many(teams, { relationName: "player2" })
}));
var teamsRelations = relations(teams, ({ one, many }) => ({
  player1: one(players, {
    fields: [teams.player1Id],
    references: [players.id],
    relationName: "player1"
  }),
  player2: one(players, {
    fields: [teams.player2Id],
    references: [players.id],
    relationName: "player2"
  }),
  user1: one(users, {
    fields: [teams.user1Id],
    references: [users.id],
    relationName: "user1"
  }),
  user2: one(users, {
    fields: [teams.user2Id],
    references: [users.id],
    relationName: "user2"
  }),
  course: one(courses, {
    fields: [teams.courseId],
    references: [courses.id]
  }),
  tournament: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id]
  }),
  scores: many(scores)
}));
var scoresRelations = relations(scores, ({ one }) => ({
  team: one(teams, {
    fields: [scores.teamId],
    references: [teams.id]
  })
}));
var tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  course: one(courses, {
    fields: [tournaments.courseId],
    references: [courses.id]
  }),
  teams: many(teams)
}));
var individualRoundsRelations = relations(individualRounds, ({ one, many }) => ({
  user: one(users, {
    fields: [individualRounds.userId],
    references: [users.id]
  }),
  course: one(courses, {
    fields: [individualRounds.courseId],
    references: [courses.id]
  }),
  scores: many(individualScores)
}));
var individualScoresRelations = relations(individualScores, ({ one }) => ({
  round: one(individualRounds, {
    fields: [individualScores.roundId],
    references: [individualRounds.id]
  })
}));

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, or, isNull } from "drizzle-orm";
var DatabaseStorage = class {
  async getCourses() {
    return await db.select().from(courses);
  }
  async getCourse(id) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || void 0;
  }
  async createCourse(course) {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }
  async deleteCourse(id) {
    await db.delete(holes).where(eq(holes.courseId, id));
    await db.delete(courses).where(eq(courses.id, id));
  }
  async getCourseHoles(courseId) {
    return await db.select().from(holes).where(eq(holes.courseId, courseId));
  }
  async getCourseHoleSets(courseId) {
    const courseHoles = await db.select({ holeSetName: holes.holeSetName }).from(holes).where(eq(holes.courseId, courseId));
    const uniqueHoleSets = [...new Set(courseHoles.map((h) => h.holeSetName))];
    return uniqueHoleSets;
  }
  async getCourseHolesBySet(courseId, holeSetName) {
    return await db.select().from(holes).where(
      and(eq(holes.courseId, courseId), eq(holes.holeSetName, holeSetName))
    );
  }
  async createHole(hole) {
    const [newHole] = await db.insert(holes).values(hole).returning();
    return newHole;
  }
  async getUsers() {
    return await db.select().from(users);
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByCode(code) {
    const [user] = await db.select().from(users).where(eq(users.code, code));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(user) {
    const code = this.generateUserCode();
    const [newUser] = await db.insert(users).values({ ...user, code }).returning();
    return newUser;
  }
  async updateUser(id, updates) {
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updatedUser;
  }
  async deleteUser(id) {
    await db.delete(users).where(eq(users.id, id));
  }
  async getPlayers() {
    return await db.select().from(players);
  }
  async getPlayer(id) {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || void 0;
  }
  async getPlayerByCode(code) {
    const [player] = await db.select().from(players).where(eq(players.code, code));
    return player || void 0;
  }
  async createPlayer(player) {
    const code = this.generatePlayerCode();
    const [newPlayer] = await db.insert(players).values({ ...player, code }).returning();
    return newPlayer;
  }
  async getTeams() {
    const teamsData = await db.select().from(teams);
    const teamsWithPlayers = [];
    for (const team of teamsData) {
      const [player1] = await db.select().from(players).where(eq(players.id, team.player1Id));
      const [player2] = await db.select().from(players).where(eq(players.id, team.player2Id));
      const [course] = await db.select().from(courses).where(eq(courses.id, team.courseId));
      const user1 = team.user1Id ? await db.select().from(users).where(eq(users.id, team.user1Id)).then((res) => res[0]) : void 0;
      const user2 = team.user2Id ? await db.select().from(users).where(eq(users.id, team.user2Id)).then((res) => res[0]) : void 0;
      if (player1 && player2 && course) {
        const teamScores = await this.getTeamScores(team.id);
        const totalStrokes = teamScores.reduce((sum, score) => sum + score.strokes, 0);
        const currentScore = teamScores.reduce((sum, score) => sum + score.scoreToPar, 0);
        teamsWithPlayers.push({
          id: team.id,
          name: team.name,
          player1Id: team.player1Id,
          player2Id: team.player2Id,
          user1Id: team.user1Id,
          user2Id: team.user2Id,
          courseId: team.courseId,
          isActive: team.isActive,
          player1,
          player2,
          user1,
          user2,
          course,
          currentScore,
          totalStrokes
        });
      }
    }
    return teamsWithPlayers;
  }
  async getTeam(id) {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    if (!team) return void 0;
    const [player1] = await db.select().from(players).where(eq(players.id, team.player1Id));
    const [player2] = await db.select().from(players).where(eq(players.id, team.player2Id));
    const [course] = await db.select().from(courses).where(eq(courses.id, team.courseId));
    const user1 = team.user1Id ? await db.select().from(users).where(eq(users.id, team.user1Id)).then((res) => res[0]) : void 0;
    const user2 = team.user2Id ? await db.select().from(users).where(eq(users.id, team.user2Id)).then((res) => res[0]) : void 0;
    if (player1 && player2 && course) {
      const teamScores = await this.getTeamScores(team.id);
      const totalStrokes = teamScores.reduce((sum, score) => sum + score.strokes, 0);
      const currentScore = teamScores.reduce((sum, score) => sum + score.scoreToPar, 0);
      return {
        ...team,
        player1,
        player2,
        user1,
        user2,
        course,
        currentScore,
        totalStrokes
      };
    }
    return void 0;
  }
  async createTeam(team) {
    const [newTeam] = await db.insert(teams).values({ ...team, isActive: team.isActive ?? true }).returning();
    return newTeam;
  }
  async deleteTeam(id) {
    await db.delete(scores).where(eq(scores.teamId, id));
    await db.delete(teams).where(eq(teams.id, id));
  }
  async getTeamByPlayerCode(code) {
    const player = await this.getPlayerByCode(code);
    if (!player) return void 0;
    const [team] = await db.select().from(teams).where(
      and(
        eq(teams.player1Id, player.id)
      )
    ).union(
      db.select().from(teams).where(eq(teams.player2Id, player.id))
    );
    if (team) {
      return this.getTeam(team.id);
    }
    return void 0;
  }
  async getTeamsByTournament(tournamentId) {
    const teams2 = await db.select().from(teams).where(eq(teams.tournamentId, tournamentId));
    const teamsWithPlayers = [];
    for (const team of teams2) {
      const [player1] = await db.select().from(players).where(eq(players.id, team.player1Id));
      const [player2] = await db.select().from(players).where(eq(players.id, team.player2Id));
      const [course] = await db.select().from(courses).where(eq(courses.id, team.courseId));
      const user1 = team.user1Id ? await db.select().from(users).where(eq(users.id, team.user1Id)).then((res) => res[0]) : void 0;
      const user2 = team.user2Id ? await db.select().from(users).where(eq(users.id, team.user2Id)).then((res) => res[0]) : void 0;
      if (player1 && player2 && course) {
        const teamScores = await this.getTeamScores(team.id);
        const totalStrokes = teamScores.reduce((sum, score) => sum + score.strokes, 0);
        const currentScore = teamScores.reduce((sum, score) => sum + score.scoreToPar, 0);
        teamsWithPlayers.push({
          id: team.id,
          name: `${player1.name} & ${player2.name}`,
          player1Id: team.player1Id,
          player2Id: team.player2Id,
          user1Id: team.user1Id,
          user2Id: team.user2Id,
          courseId: team.courseId,
          isActive: team.isActive,
          player1,
          player2,
          user1,
          user2,
          course,
          currentScore,
          totalStrokes,
          player1Name: player1.name,
          player2Name: player2.name
        });
      }
    }
    return teamsWithPlayers;
  }
  async getTeamScores(teamId) {
    return await db.select().from(scores).where(eq(scores.teamId, teamId));
  }
  async createScore(score) {
    const [newScore] = await db.insert(scores).values(score).returning();
    return newScore;
  }
  async updateScore(teamId, holeNumber, strokes) {
    const [existingScore] = await db.select().from(scores).where(and(eq(scores.teamId, teamId), eq(scores.holeNumber, holeNumber)));
    const [team] = await db.select().from(teams).where(eq(teams.id, teamId));
    if (!team) throw new Error("Team not found");
    const courseHoles = await this.getCourseHoles(team.courseId);
    const hole = courseHoles.find((h) => h.holeNumber === holeNumber);
    if (!hole) throw new Error("Hole not found");
    const scoreToPar = strokes - hole.par;
    if (existingScore) {
      const [updatedScore] = await db.update(scores).set({ strokes, scoreToPar }).where(eq(scores.id, existingScore.id)).returning();
      return updatedScore;
    } else {
      return this.createScore({
        teamId,
        holeNumber,
        strokes,
        scoreToPar
      });
    }
  }
  async getTeamScorecard(teamId) {
    const team = await this.getTeam(teamId);
    if (!team) return void 0;
    const courseHoles = await this.getCourseHoles(team.courseId);
    const teamScores = await this.getTeamScores(teamId);
    const holesWithScores = courseHoles.map((hole) => {
      const score = teamScores.find((s) => s.holeNumber === hole.holeNumber);
      return { ...hole, score };
    });
    const totalScore = teamScores.reduce((sum, score) => sum + score.scoreToPar, 0);
    const totalStrokes = teamScores.reduce((sum, score) => sum + score.strokes, 0);
    return {
      team,
      holes: holesWithScores,
      totalScore,
      totalStrokes
    };
  }
  async getTournaments() {
    return await db.select().from(tournaments);
  }
  async getTournament(id) {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament || void 0;
  }
  async createTournament(tournament) {
    const tournamentWithCode = {
      ...tournament,
      accessCode: this.generateTournamentCode(),
      isActive: tournament.isActive ?? true
    };
    const [newTournament] = await db.insert(tournaments).values(tournamentWithCode).returning();
    return newTournament;
  }
  async getTournamentByAccessCode(accessCode) {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.accessCode, accessCode));
    return tournament || void 0;
  }
  async deleteTournament(id) {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    if (!tournament) {
      throw new Error("Tournament not found");
    }
    const tournamentTeams = await db.select().from(teams).where(
      or(
        eq(teams.tournamentId, id),
        and(
          eq(teams.courseId, tournament.courseId),
          isNull(teams.tournamentId)
        )
      )
    );
    for (const team of tournamentTeams) {
      await db.delete(scores).where(eq(scores.teamId, team.id));
    }
    for (const team of tournamentTeams) {
      await db.delete(teams).where(eq(teams.id, team.id));
    }
    await db.delete(tournaments).where(eq(tournaments.id, id));
  }
  async finishTournament(id) {
    const [updatedTournament] = await db.update(tournaments).set({
      isActive: false,
      endDate: (/* @__PURE__ */ new Date()).toISOString()
    }).where(eq(tournaments.id, id)).returning();
    if (!updatedTournament) {
      throw new Error("Tournament not found");
    }
    return updatedTournament;
  }
  generatePlayerCode() {
    return Math.floor(1e3 + Math.random() * 9e3).toString();
  }
  generateUserCode() {
    return Math.floor(1e3 + Math.random() * 9e3).toString();
  }
  generateTournamentCode() {
    return Math.floor(1e3 + Math.random() * 9e3).toString();
  }
  async canUserEditTeam(userId, teamId) {
    const [team] = await db.select().from(teams).where(eq(teams.id, teamId));
    if (!team) return false;
    return team.user1Id === userId || team.user2Id === userId;
  }
  async getUserTeam(userId) {
    const [team] = await db.select().from(teams).where(
      or(eq(teams.user1Id, userId), eq(teams.user2Id, userId))
    );
    if (!team) return void 0;
    return this.getTeam(team.id);
  }
  // Individual Round operations
  async getUserRounds(userId) {
    const rounds = await db.select().from(individualRounds).where(eq(individualRounds.userId, userId));
    const roundsWithDetails = [];
    for (const round of rounds) {
      const [user] = await db.select().from(users).where(eq(users.id, round.userId));
      const [course] = await db.select().from(courses).where(eq(courses.id, round.courseId));
      const scores2 = await db.select().from(individualScores).where(eq(individualScores.roundId, round.id));
      const holes2 = await db.select().from(holes).where(eq(holes.courseId, round.courseId));
      if (user && course) {
        const holesWithScores = holes2.map((hole) => ({
          ...hole,
          score: scores2.find((s) => s.holeNumber === hole.holeNumber)
        }));
        roundsWithDetails.push({
          ...round,
          user,
          course,
          scores: scores2,
          holes: holesWithScores
        });
      }
    }
    return roundsWithDetails;
  }
  async getAllIndividualRounds() {
    const rounds = await db.select().from(individualRounds).orderBy(individualRounds.startTime);
    const roundsWithDetails = [];
    for (const round of rounds) {
      const [user] = await db.select().from(users).where(eq(users.id, round.userId));
      const [course] = await db.select().from(courses).where(eq(courses.id, round.courseId));
      const scores2 = await db.select().from(individualScores).where(eq(individualScores.roundId, round.id));
      const holes2 = await db.select().from(holes).where(eq(holes.courseId, round.courseId));
      if (user && course) {
        const holesWithScores = holes2.map((hole) => ({
          ...hole,
          score: scores2.find((s) => s.holeNumber === hole.holeNumber)
        }));
        roundsWithDetails.push({
          ...round,
          user,
          course,
          scores: scores2,
          holes: holesWithScores
        });
      }
    }
    return roundsWithDetails;
  }
  async getIndividualRound(roundId) {
    try {
      const [round] = await db.select().from(individualRounds).where(eq(individualRounds.id, roundId));
      if (!round) {
        return void 0;
      }
      const [user] = await db.select().from(users).where(eq(users.id, round.userId));
      const [course] = await db.select().from(courses).where(eq(courses.id, round.courseId));
      const scores2 = await db.select().from(individualScores).where(eq(individualScores.roundId, round.id));
      const holes2 = await db.select().from(holes).where(eq(holes.courseId, round.courseId));
      if (user && course) {
        const holesWithScores = holes2.map((hole) => ({
          ...hole,
          score: scores2.find((s) => s.holeNumber === hole.holeNumber)
        }));
        return {
          ...round,
          user,
          course,
          scores: scores2,
          holes: holesWithScores
        };
      }
      return void 0;
    } catch (error) {
      throw error;
    }
  }
  async createIndividualRound(round) {
    const [newRound] = await db.insert(individualRounds).values(round).returning();
    return newRound;
  }
  async deleteIndividualRound(roundId) {
    await db.delete(individualScores).where(eq(individualScores.roundId, roundId));
    await db.delete(individualRounds).where(eq(individualRounds.id, roundId));
  }
  async finishIndividualRound(roundId, totalScore, totalStrokes) {
    const [updatedRound] = await db.update(individualRounds).set({
      totalScore,
      totalStrokes,
      isCompleted: true,
      endTime: /* @__PURE__ */ new Date()
    }).where(eq(individualRounds.id, roundId)).returning();
    return updatedRound;
  }
  async getIndividualRoundScores(roundId) {
    return await db.select().from(individualScores).where(eq(individualScores.roundId, roundId));
  }
  async createIndividualScore(score) {
    const [newScore] = await db.insert(individualScores).values(score).returning();
    return newScore;
  }
  async updateIndividualScore(roundId, holeNumber, strokes) {
    const existingScore = await db.select().from(individualScores).where(
      and(
        eq(individualScores.roundId, roundId),
        eq(individualScores.holeNumber, holeNumber)
      )
    );
    const [round] = await db.select().from(individualRounds).where(eq(individualRounds.id, roundId));
    if (!round) throw new Error("Round not found");
    const courseHoles = await this.getCourseHoles(round.courseId);
    const hole = courseHoles.find((h) => h.holeNumber === holeNumber);
    if (!hole) throw new Error("Hole not found");
    const scoreToPar = strokes - hole.par;
    if (existingScore.length > 0) {
      const [updatedScore] = await db.update(individualScores).set({ strokes, scoreToPar }).where(eq(individualScores.id, existingScore[0].id)).returning();
      return updatedScore;
    } else {
      return this.createIndividualScore({
        roundId,
        holeNumber,
        strokes,
        scoreToPar
      });
    }
  }
  async getIndividualScorecard(roundId) {
    const round = await this.getIndividualRound(roundId);
    if (!round) return void 0;
    const selectedHoleSets = Array.isArray(round.selectedHoleSets) ? round.selectedHoleSets : ["Main"];
    let selectedHoles = [];
    for (const holeSet of selectedHoleSets) {
      const setHoles = await this.getCourseHolesBySet(round.courseId, holeSet);
      selectedHoles = [...selectedHoles, ...setHoles];
    }
    selectedHoles.sort((a, b) => a.holeNumber - b.holeNumber);
    const roundScores = await this.getIndividualRoundScores(roundId);
    const holesWithScores = selectedHoles.map((hole) => {
      const score = roundScores.find((s) => s.holeNumber === hole.holeNumber);
      return { ...hole, score };
    });
    const totalScore = roundScores.reduce((sum, score) => sum + score.scoreToPar, 0);
    const totalStrokes = roundScores.reduce((sum, score) => sum + score.strokes, 0);
    return {
      round,
      holes: holesWithScores,
      totalScore,
      totalStrokes
    };
  }
  async calculateUserHandicap(userId) {
    const completedRounds = await db.select().from(individualRounds).where(
      and(
        eq(individualRounds.userId, userId),
        eq(individualRounds.isCompleted, true)
      )
    );
    if (completedRounds.length < 3) {
      return null;
    }
    const roundsWithScores = await Promise.all(
      completedRounds.map(async (round) => {
        const [course] = await db.select().from(courses).where(eq(courses.id, round.courseId));
        return {
          totalScore: round.totalScore || 0,
          courseRating: course?.rating ? parseFloat(course.rating) : 72,
          coursePar: course?.par || 72
        };
      })
    );
    const handicapDifferentials = roundsWithScores.map((round) => {
      return (round.totalScore - round.courseRating) * 113 / 113;
    });
    handicapDifferentials.sort((a, b) => a - b);
    const numScoresToUse = Math.min(handicapDifferentials.length, 8);
    const bestScores = handicapDifferentials.slice(0, numScoresToUse);
    const averageHandicap = bestScores.reduce((sum, diff) => sum + diff, 0) / bestScores.length;
    return Math.round(averageHandicap * 10) / 10;
  }
};
var storage = new DatabaseStorage();

// server/email.ts
import nodemailer from "nodemailer";
var EmailService = class {
  transporter = null;
  config = null;
  configure(config) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email,
        pass: config.password
      }
    });
  }
  async sendWelcomeEmail(user) {
    if (!this.transporter || !this.config) {
      throw new Error("Email service not configured");
    }
    const mailOptions = {
      from: this.config.email,
      to: user.email,
      subject: "Welcome to Golf Tournament Pro - Your Login Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin-bottom: 10px;">\u{1F3CC}\uFE0F Golf Tournament Pro</h1>
            <p style="color: #6B7280; font-size: 16px;">Professional Golf Tournament Management</p>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1F2937; margin-bottom: 15px;">Welcome ${user.name}!</h2>
            <p style="color: #4B5563; line-height: 1.6;">
              You've been successfully registered for Golf Tournament Pro. Use your personal login code below to access the app and join tournaments.
            </p>
          </div>

          <div style="background: #059669; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Your Login Code</h3>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; font-family: monospace;">
              ${user.code}
            </div>
          </div>

          <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #92400E; margin-bottom: 10px;">How to Use Your App:</h4>
            <ol style="color: #92400E; margin: 0; padding-left: 20px;">
              <li>Open Golf Tournament Pro in your browser</li>
              <li>Click "Sign In" and enter your code: <strong>${user.code}</strong></li>
              <li>Browse golf courses and view leaderboards</li>
              <li>Join tournaments using tournament access codes</li>
            </ol>
          </div>

          <div style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 30px;">
            <p>Questions? Contact your tournament administrator.</p>
            <p style="margin-top: 10px;">\xA9 Golf Tournament Pro - Professional Golf Management</p>
          </div>
        </div>
      `
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error);
      throw error;
    }
  }
  async testConnection() {
    if (!this.transporter) {
      return false;
    }
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email connection test failed:", error);
      return false;
    }
  }
};
var emailService = new EmailService();

// server/routes.ts
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "5159";
var adminTokens = /* @__PURE__ */ new Set();
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token === `admin-${ADMIN_PASSWORD}`) {
    console.log("Admin authentication successful with direct password");
    return next();
  }
  console.log("requireAdmin check - token:", token?.substring(0, 10) + "...", "adminTokens size:", adminTokens.size);
  if (!token || !adminTokens.has(token)) {
    console.log("Admin authentication failed - token not found in adminTokens");
    return res.status(401).json({ message: "Admin authentication required" });
  }
  console.log("Admin authentication successful");
  next();
}
var wsClients = /* @__PURE__ */ new Set();
function broadcastScoreUpdate(teamId, score) {
  const message = JSON.stringify({
    type: "score-update",
    teamId,
    score,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  wsClients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}
async function registerRoutes(app2) {
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      if (password === ADMIN_PASSWORD) {
        const token = generateToken();
        adminTokens.add(token);
        res.json({ token, message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/admin/logout", requireAdmin, async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (token) {
        adminTokens.delete(token);
      }
      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });
  app2.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const users2 = await storage.getUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid user data", errors: validation.error.errors });
      }
      const userData = validation.data;
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      const user = await storage.createUser(userData);
      try {
        await emailService.sendWelcomeEmail(user);
        console.log(`Welcome email sent to ${user.email}`);
      } catch (emailError) {
        console.error(`Failed to send welcome email to ${user.email}:`, emailError);
      }
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  app2.post("/api/email/resend/:userId", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await emailService.sendWelcomeEmail(user);
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Failed to resend email:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });
  app2.post("/api/email/configure", requireAdmin, async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      emailService.configure({ email, password });
      const testResult = await emailService.testConnection();
      if (testResult) {
        res.json({ message: "Email configured successfully" });
      } else {
        res.status(500).json({ message: "Email configuration failed - please check credentials" });
      }
    } catch (error) {
      console.error("Failed to configure email:", error);
      res.status(500).json({ message: "Failed to configure email" });
    }
  });
  app2.post("/api/users/login", async (req, res) => {
    try {
      const { code } = req.body;
      const user = await storage.getUserByCode(code);
      if (!user) {
        return res.status(401).json({ message: "Invalid access code" });
      }
      const team = await storage.getUserTeam(user.id);
      res.json({ user, team, message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/users/:id/team", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const team = await storage.getUserTeam(userId);
      if (!team) {
        return res.status(404).json({ message: "User is not assigned to any team" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user team" });
    }
  });
  app2.get("/api/courses", async (req, res) => {
    try {
      const courses2 = await storage.getCourses();
      res.json(courses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });
  app2.post("/api/courses", async (req, res) => {
    try {
      const { name, par, yardage, rating, holes: holes2 } = req.body;
      if (!name || !holes2 || !Array.isArray(holes2) || holes2.length !== 18) {
        return res.status(400).json({ message: "Invalid course data" });
      }
      const course = await storage.createCourse({ name, par, yardage, rating });
      for (const hole of holes2) {
        await storage.createHole({
          courseId: course.id,
          holeNumber: hole.holeNumber,
          par: hole.par,
          yardage: hole.yardage,
          handicap: hole.handicap,
          holeSetName: hole.holeSetName || "Main"
        });
      }
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  app2.delete("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCourse(id);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });
  app2.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });
  app2.get("/api/courses/:id/holes", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const holes2 = await storage.getCourseHoles(id);
      res.json(holes2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course holes" });
    }
  });
  app2.get("/api/courses/:id/hole-sets", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const holeSets = await storage.getCourseHoleSets(id);
      res.json(holeSets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course hole sets" });
    }
  });
  app2.get("/api/courses/:id/hole-sets/:setName", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const setName = req.params.setName;
      const holes2 = await storage.getCourseHolesBySet(id, setName);
      res.json(holes2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course holes by set" });
    }
  });
  app2.get("/api/players", async (req, res) => {
    try {
      const players2 = await storage.getPlayers();
      res.json(players2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });
  app2.post("/api/players", requireAdmin, async (req, res) => {
    try {
      const validation = insertPlayerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid player data", errors: validation.error.errors });
      }
      const playerData = validation.data;
      const player = await storage.createPlayer(playerData);
      res.status(201).json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to create player" });
    }
  });
  app2.get("/api/players/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const player = await storage.getPlayerByCode(code);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch player" });
    }
  });
  app2.get("/api/teams", async (req, res) => {
    try {
      const teams2 = await storage.getTeams();
      res.json(teams2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });
  app2.post("/api/teams", requireAdmin, async (req, res) => {
    try {
      const validation = insertTeamSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid team data", errors: validation.error.errors });
      }
      const team = await storage.createTeam(validation.data);
      res.status(201).json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to create team" });
    }
  });
  app2.delete("/api/teams/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team ID" });
      }
      await storage.deleteTeam(id);
      res.json({ message: "Team deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team" });
    }
  });
  app2.get("/api/teams/by-code/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const team = await storage.getTeamByPlayerCode(code);
      if (!team) {
        return res.status(404).json({ message: "Team not found for this player code" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });
  app2.get("/api/teams/:id/scorecard", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scorecard = await storage.getTeamScorecard(id);
      if (!scorecard) {
        return res.status(404).json({ message: "Team scorecard not found" });
      }
      res.json(scorecard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team scorecard" });
    }
  });
  app2.get("/api/auth/user/:code", async (req, res) => {
    try {
      const code = req.params.code;
      if (code === "5159") {
        const token = generateToken();
        adminTokens.add(token);
        return res.json({
          user: { id: 0, name: "Admin Isaak", code: "5159", email: "admin@tournament.com", handicap: 0 },
          adminToken: token,
          isAdmin: true
        });
      }
      const user = await storage.getUserByCode(code);
      if (user) {
        return res.json({
          user,
          isAdmin: false,
          isUser: true,
          message: "User access granted"
        });
      }
      const tournament = await storage.getTournamentByAccessCode(code);
      if (tournament) {
        return res.json({
          tournament,
          isAdmin: false,
          isTournament: true,
          message: "Tournament access granted"
        });
      }
      return res.status(404).json({ message: "Invalid access code" });
    } catch (error) {
      res.status(500).json({ message: "Failed to authenticate user" });
    }
  });
  app2.get("/api/tournaments", async (req, res) => {
    try {
      const tournaments2 = await storage.getTournaments();
      res.json(tournaments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });
  app2.get("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tournament = await storage.getTournaments();
      const foundTournament = tournament.find((t) => t.id === id);
      if (!foundTournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(foundTournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });
  app2.get("/api/teams/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const team = await storage.getUserTeam(userId);
      if (!team) {
        return res.status(404).json({ message: "Team not found for user" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user's team" });
    }
  });
  app2.post("/api/scores", async (req, res) => {
    try {
      const validation = insertScoreSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid score data", errors: validation.error.errors });
      }
      const score = await storage.createScore(validation.data);
      res.status(201).json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to create score" });
    }
  });
  app2.put("/api/scores/:teamId/:holeNumber", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const holeNumber = parseInt(req.params.holeNumber);
      const { strokes, userId } = req.body;
      if (!strokes || strokes < 1 || strokes > 20) {
        return res.status(400).json({ message: "Invalid strokes value" });
      }
      if (userId) {
        const canEdit = await storage.canUserEditTeam(userId, teamId);
        if (!canEdit) {
          return res.status(403).json({ message: "You are not authorized to edit this team's scores" });
        }
      }
      const score = await storage.updateScore(teamId, holeNumber, strokes);
      broadcastScoreUpdate(teamId, score);
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to update score" });
    }
  });
  app2.post("/api/tournaments", async (req, res) => {
    try {
      const validation = insertTournamentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid tournament data", errors: validation.error.errors });
      }
      const tournament = await storage.createTournament(validation.data);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });
  app2.delete("/api/tournaments/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tournament ID" });
      }
      await storage.deleteTournament(id);
      res.json({ message: "Tournament deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tournament" });
    }
  });
  app2.put("/api/tournaments/:id/finish", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tournament ID" });
      }
      const tournament = await storage.finishTournament(id);
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to finish tournament" });
    }
  });
  app2.post("/api/tournaments/:id/join", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tournament ID" });
      }
      const tournament = await storage.getTournament(id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      if (!tournament.isActive) {
        return res.status(400).json({ message: "Tournament is not active" });
      }
      res.json({ tournament });
    } catch (error) {
      console.error("Error joining tournament:", error);
      res.status(500).json({ message: "Failed to join tournament" });
    }
  });
  app2.get("/api/tournaments/:id/heat-map", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tournament ID" });
      }
      const tournament = await storage.getTournament(id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      const teams2 = await storage.getTeamsByTournament(id);
      const course = await storage.getCourse(tournament.courseId);
      const holes2 = await storage.getCourseHoles(tournament.courseId);
      const playerPositions = [];
      for (const team of teams2) {
        const scores2 = await storage.getTeamScores(team.id);
        const completedHoles = scores2.filter((s) => s.strokes > 0);
        const currentHole = completedHoles.length < 18 ? completedHoles.length + 1 : 18;
        const totalStrokes = completedHoles.reduce((sum, score) => sum + score.strokes, 0);
        const completedPar = completedHoles.reduce((sum, score) => {
          const hole = holes2.find((h) => h.holeNumber === score.holeNumber);
          return sum + (hole?.par || 0);
        }, 0);
        const totalScore = totalStrokes - completedPar;
        let performance = "average";
        if (totalScore <= -3) performance = "excellent";
        else if (totalScore <= -1) performance = "good";
        else if (totalScore >= 3) performance = "struggling";
        playerPositions.push({
          teamId: team.id,
          teamName: `${team.player1.name} & ${team.player2.name}`,
          player1: { name: team.player1.name, profilePicture: null },
          player2: { name: team.player2.name, profilePicture: null },
          currentHole,
          totalScore,
          holesCompleted: completedHoles.length,
          performance,
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      const holePerformance = [];
      for (const hole of holes2) {
        const holeScores = [];
        for (const team of teams2) {
          const scores2 = await storage.getTeamScores(team.id);
          const holeScore = scores2.find((s) => s.holeNumber === hole.holeNumber);
          if (holeScore && holeScore.strokes > 0) {
            holeScores.push(holeScore.strokes);
          }
        }
        if (holeScores.length > 0) {
          const averageScore = holeScores.reduce((sum, score) => sum + score, 0) / holeScores.length;
          const difficulty = averageScore <= hole.par - 0.2 ? "easy" : averageScore >= hole.par + 0.2 ? "hard" : "medium";
          holePerformance.push({
            holeNumber: hole.holeNumber,
            averageScore,
            parValue: hole.par,
            difficulty,
            completedTeams: holeScores.length
          });
        }
      }
      res.json({
        playerPositions,
        holePerformance,
        course,
        tournament
      });
    } catch (error) {
      console.error("Error fetching heat map data:", error);
      res.status(500).json({ message: "Failed to fetch heat map data" });
    }
  });
  app2.post("/api/email/configure", requireAdmin, async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      emailService.configure({ email, password });
      const isConnected = await emailService.testConnection();
      if (isConnected) {
        res.json({ message: "Email service configured successfully" });
      } else {
        res.status(400).json({ message: "Email configuration failed. Please check your credentials." });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to configure email service" });
    }
  });
  app2.post("/api/email/resend/:userId", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await emailService.sendWelcomeEmail(user);
      res.json({ message: "Email resent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to resend email" });
    }
  });
  app2.get("/api/email/test", requireAdmin, async (req, res) => {
    try {
      const isConnected = await emailService.testConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ message: "Failed to test email connection" });
    }
  });
  app2.get("/api/users/:userId/rounds", async (req, res) => {
    console.log(`[DEBUG] Individual rounds route called for user ${req.params.userId}`);
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (userId === 0) {
        return res.json([]);
      }
      const rounds = await storage.getUserRounds(userId);
      console.log(`[DEBUG] Returning ${rounds.length} rounds for user ${userId}`);
      res.json(rounds);
    } catch (error) {
      console.error("Error fetching user rounds:", error);
      res.status(500).json({ message: "Failed to fetch user rounds" });
    }
  });
  app2.get("/api/rounds/all", async (req, res) => {
    try {
      const rounds = await storage.getAllIndividualRounds();
      res.json(rounds);
    } catch (error) {
      console.error("Error fetching all rounds:", error);
      res.status(500).json({ message: "Failed to fetch all rounds" });
    }
  });
  app2.post("/api/users/:userId/rounds", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (userId === 0) {
        return res.status(400).json({ message: "Admin user cannot create individual rounds" });
      }
      const roundData = insertIndividualRoundSchema.parse({
        ...req.body,
        userId,
        selectedHoleSets: req.body.selectedHoleSets || ["Main"],
        startTime: /* @__PURE__ */ new Date()
      });
      const round = await storage.createIndividualRound(roundData);
      res.json(round);
    } catch (error) {
      res.status(500).json({ message: "Failed to create individual round" });
    }
  });
  app2.get("/api/rounds/:roundId", async (req, res) => {
    try {
      const roundId = parseInt(req.params.roundId);
      if (isNaN(roundId)) {
        return res.status(400).json({ message: "Invalid round ID" });
      }
      const round = await storage.getIndividualRound(roundId);
      if (!round) {
        return res.status(404).json({ message: "Round not found" });
      }
      res.json(round);
    } catch (error) {
      console.error("Error fetching round:", error);
      res.status(500).json({ message: "Failed to fetch round" });
    }
  });
  app2.put("/api/rounds/:roundId/finish", async (req, res) => {
    try {
      const roundId = parseInt(req.params.roundId);
      if (isNaN(roundId)) {
        return res.status(400).json({ message: "Invalid round ID" });
      }
      const { totalScore, totalStrokes } = req.body;
      if (typeof totalScore !== "number" || typeof totalStrokes !== "number") {
        return res.status(400).json({ message: "Invalid score data" });
      }
      const round = await storage.finishIndividualRound(roundId, totalScore, totalStrokes);
      res.json(round);
    } catch (error) {
      res.status(500).json({ message: "Failed to finish round" });
    }
  });
  app2.delete("/api/rounds/:roundId", async (req, res) => {
    try {
      const roundId = parseInt(req.params.roundId);
      if (isNaN(roundId)) {
        return res.status(400).json({ message: "Invalid round ID" });
      }
      await storage.deleteIndividualRound(roundId);
      res.json({ message: "Round deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete round" });
    }
  });
  app2.get("/api/rounds/:roundId/scorecard", async (req, res) => {
    try {
      const roundId = parseInt(req.params.roundId);
      if (isNaN(roundId)) {
        return res.status(400).json({ message: "Invalid round ID" });
      }
      const scorecard = await storage.getIndividualScorecard(roundId);
      if (!scorecard) {
        return res.status(404).json({ message: "Scorecard not found" });
      }
      res.json(scorecard);
    } catch (error) {
      console.error("Error fetching scorecard:", error);
      res.status(500).json({ message: "Failed to fetch scorecard" });
    }
  });
  app2.put("/api/rounds/:roundId/scores/:holeNumber", async (req, res) => {
    try {
      const roundId = parseInt(req.params.roundId);
      const holeNumber = parseInt(req.params.holeNumber);
      if (isNaN(roundId) || isNaN(holeNumber)) {
        return res.status(400).json({ message: "Invalid round ID or hole number" });
      }
      const { strokes } = req.body;
      if (typeof strokes !== "number" || strokes < 1) {
        return res.status(400).json({ message: "Invalid strokes" });
      }
      const score = await storage.updateIndividualScore(roundId, holeNumber, strokes);
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to update score" });
    }
  });
  app2.get("/api/users/:userId/handicap", async (req, res) => {
    console.log(`[DEBUG] Handicap route called for user ${req.params.userId}`);
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (userId === 0) {
        return res.json({ handicap: 0 });
      }
      const handicap = await storage.calculateUserHandicap(userId);
      console.log(`[DEBUG] Returning handicap ${handicap} for user ${userId}`);
      res.json({ handicap });
    } catch (error) {
      console.error("Error calculating handicap:", error);
      res.status(500).json({ message: "Failed to calculate handicap" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/api/ws"
  });
  wss.on("connection", (ws2) => {
    console.log("New WebSocket connection");
    wsClients.add(ws2);
    ws2.on("close", () => {
      console.log("WebSocket connection closed");
      wsClients.delete(ws2);
    });
    ws2.on("error", (error) => {
      console.error("WebSocket error:", error);
      wsClients.delete(ws2);
    });
    ws2.send(JSON.stringify({
      type: "connection",
      message: "Connected to live score updates"
    }));
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    emailService.configure({
      email: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASSWORD
    });
    log("Email service configured with Gmail SMTP");
  } else {
    log("Email service not configured - missing Gmail credentials");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
