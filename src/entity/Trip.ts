import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn, // Import OneToMany
} from "typeorm";
import { User } from "./User";
import { Vehicle } from "./Vehicle";
import { Location } from "./Location";

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  trunk: number; // Trunk 0: full, 1: empty, 2: partially filled

  @Column("int")
  emptySeats: number;

  @Column("decimal")
  price: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.tripsAsDriver)
  driver: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips)
  vehicle: Vehicle | null;

  @ManyToOne(() => Location, (location) => location.tripsFromThisLocation)
  locationFrom: Location;

  @ManyToOne(() => Location, (location) => location.tripsToThisLocation)
  locationTo: Location;

  @ManyToMany(() => User, (user) => user.tripsAsPassenger)
  @JoinTable()
  passengers: User[];

  @ManyToMany(() => Location, (location) => location.stopsInTrips)
  @JoinTable()
  stops: Location[] | null;

  @Column()
  startTime: Date;

  // create trip status enum where default will be 0 indicating

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Method to add passengers to the trip
  addPassengers(passengers: User[]) {
    this.passengers.push(...passengers);
  }
}
