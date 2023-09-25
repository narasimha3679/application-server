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
  host: "10.0.0.182",
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

const url = "redis://10.0.0.182:6379";
export const redisClient = new Redis(url);
redisClient.on("connect", () => {
  console.log("Redis client connected");
});
