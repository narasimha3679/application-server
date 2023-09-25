// Location.ts
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

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", { precision: 18, scale: 16 })
  longitude: number;

  @Column("decimal", { precision: 18, scale: 16 })
  latitude: number;

  @Column()
  placeName: string;

  @Column()
  formattedAddress: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  googlePlaceId: string;

  @OneToMany(() => Trip, (trip) => trip.locationFrom)
  tripsFromThisLocation: Trip[];

  @OneToMany(() => Trip, (trip) => trip.locationTo)
  tripsToThisLocation: Trip[];

  @ManyToMany(() => Trip, (trip) => trip.stops)
  stopsInTrips: Trip[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
