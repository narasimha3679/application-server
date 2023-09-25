import internal = require("stream");
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Trip } from "./Trip";
import { Vehicle } from "./Vehicle";

export enum UserRole {
  ADMIN = 0,
  USER = 1,
}

export enum UserStatus {
  PENDING = 0,
  ACTIVE = 1,
  SUSPENDED = 2,
  DELETED = 3,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  firstName: string;

  @Column({ nullable: false, length: 50 })
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  countryCd: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  userImage: string | null;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];

  @OneToMany(() => Trip, (trip) => trip.driver)
  tripsAsDriver: Trip[];

  @ManyToMany(() => Trip, (trip) => trip.passengers)
  tripsAsPassenger: Trip[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
