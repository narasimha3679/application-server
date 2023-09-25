import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Trip } from "./Trip";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string | null;

  @Column({ nullable: true })
  type: string | null;

  @Column({ nullable: true })
  color: string | null;

  @Column("int", { nullable: true })
  year: number | null;

  @Column({ nullable: true })
  license: string | null;

  @Column({ nullable: true })
  vehicleImage: string | null;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Trip, (trip) => trip.vehicle)
  trips: Trip[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
