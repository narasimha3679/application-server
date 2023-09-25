import { AppDataSource } from "../../src/data-source";
import { Trip } from "../../src/entity/Trip";
import { Between, Brackets, Like } from "typeorm";

export async function retrieveTrips(
  pageNumber,
  pageSize,
  startOfDay,
  endOfDay,
  fromCity,
  fromState,
  toCity,
  toState
) {
  console.log(startOfDay, endOfDay);

  const trips = await AppDataSource.getRepository(Trip)
    .createQueryBuilder("trip")
    .leftJoinAndSelect("trip.locationFrom", "locationFrom")
    .leftJoinAndSelect("trip.locationTo", "locationTo")
    .leftJoinAndSelect("trip.stops", "stops")
    .where("trip.startTime BETWEEN :startOfDay AND :endOfDay", {
      startOfDay,
      endOfDay,
    })
    .andWhere(
      new Brackets((qb) => {
        qb.where(
          "locationFrom.city LIKE :fromCity AND locationFrom.state LIKE :fromState",
          {
            fromCity: `%${fromCity}%`,
            fromState: `%${fromState}%`,
          }
        ).orWhere("stops.city LIKE :fromCity AND stops.state LIKE :fromState", {
          fromCity: `%${fromCity}%`,
          fromState: `%${fromState}%`,
        });
      })
    )
    .andWhere(
      new Brackets((qb) => {
        qb.where(
          "locationTo.city LIKE :toCity AND locationTo.state LIKE :toState",
          {
            toCity: `%${toCity}%`,
            toState: `%${toState}%`,
          }
        ).orWhere("stops.city LIKE :toCity AND stops.state LIKE :toState", {
          toCity: `%${toCity}%`,
          toState: `%${toState}%`,
        });
      })
    )
    .skip((pageNumber - 1) * pageSize)
    .take(pageSize)
    .getMany();

  return trips;
}
