import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Vehicle } from "./entity/Vehicle";
import { Location } from "./entity/Location";
import { Trip } from "./entity/Trip";
//import { Otp } from "./entity/Otp";
import Redis from "ioredis";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost" || "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [User, Vehicle, Location, Trip],
  migrations: [],
  subscribers: [],
});

const url = process.env.REDIS_URL || "redis://127.0.0.1:12345"|| "redis://localhost:12345" ;
export const redisClient = new Redis(url);
redisClient.on("connect", () => {
  console.log("Redis client connected");
});

