import tripSchema from "../../schema/createTripSchema";
import {AppDataSource} from "../data-source";
import {NextFunction, Request, Response} from "express";
import {Trip} from "../entity/Trip";
import {Vehicle} from "../entity/Vehicle";
import {User} from "../entity/User";
import {Location} from "../entity/Location";
import {saveImage} from "../../utils/saveImage";
import {getUser} from "../../utils/db_actions/get_user";
import {retrieveTrips} from "../../utils/db_actions/get_trips";
import { DeepPartial } from "typeorm";

export class TripController {
  private tripRepository = AppDataSource.getRepository(Trip);
  private vehicleRepository = AppDataSource.getRepository(Vehicle);
  private userRepository = AppDataSource.getRepository(User);
  private locationRepository = AppDataSource.getRepository(Location);

  async createTrip(request: Request, response: Response, next: NextFunction) {
    // validate schema
    const validatedData = await tripSchema.validateAsync(request.body);

    // adding user to trip
    const user = await getUser(request.userId);

    if (!user) {
      return response.status(400).json({error: "User not found"});
    }
    validatedData.driver = user;

    if (validatedData.error) {
      return response.status(400).json({
        error: "Validation error",
        details: validatedData.error.details,
      });
    }

    try {
      let vehicleEntity = null;
      // check if vehicle exists in request body
      if (validatedData.vehicle) {
        // Check if vehicle exists

        if (validatedData.vehicle.id) {
          console.log(validatedData.vehicle.id);

          vehicleEntity = await this.vehicleRepository.findOne({
            where: {id: validatedData.vehicle.id},
          });
          if (!vehicleEntity) {
            return response.status(400).json({error: "Vehicle not found"});
          }
        } else if (
            // Create a Vehicle entity if vehicle does not exist
            validatedData.vehicle.name ||
            validatedData.vehicle.type ||
            validatedData.vehicle.color ||
            validatedData.vehicle.year ||
            validatedData.vehicle.license ||
            validatedData.vehicle.vehicleImage
        ) {
          if (validatedData.vehicle.vehicleImage) {
            // save image to file system and get path
            const vehicleImage = validatedData.vehicle.vehicleImage;
            // save image to file system and get path
            // insert image path into vehicle object
            validatedData.vehicle.vehicleImage = await saveImage(vehicleImage);
          }

          // remove id from vehicle object
          delete validatedData.vehicle.id;
          // insert user id into vehicle object
          validatedData.vehicle.user = request.userId;
          vehicleEntity = this.vehicleRepository.create(validatedData.vehicle);
          vehicleEntity = await this.vehicleRepository.save(vehicleEntity);
        }
      }

      // get location data from request body
      const fromLocation = validatedData.location.from;
      const toLocation = validatedData.location.to;
      const stops = validatedData.stops;

      // create location object from location data
      let fromLocationEntity = this.locationRepository.create(fromLocation);
      let toLocationEntity = this.locationRepository.create(toLocation);
      const stopsEntities = stops.map((stop: DeepPartial<Location>[]) => {
        return this.locationRepository.create(stop);
      });

      // save location to database
      fromLocationEntity = await this.locationRepository.save(
        fromLocationEntity
      );
      if (!fromLocationEntity) {
        return response.status(400).json({ error: "Error creating location" });
      }
      toLocationEntity = await this.locationRepository.save(toLocationEntity);
      if (!toLocationEntity) {
        return response.status(400).json({ error: "Error creating location" });
      }

      // save stops to database
      const stopsPromises = stopsEntities.map(async (stop: any) => {
        const stopEntity = await this.locationRepository.save(stop);
        if (!stopEntity) {
          return response
            .status(400)
            .json({ error: "Error creating location" });
        }
        return stopEntity;
      });
      const resolvedStopsEntities = await Promise.all(stopsPromises);

      // create trip object from request body
      const tripEntity = this.tripRepository.create({
        ...validatedData,
        vehicle: vehicleEntity,
        locationFrom: fromLocationEntity,
        locationTo: toLocationEntity,
        stops: resolvedStopsEntities,
      });

      // save trip to database
      const trip = await this.tripRepository.save(tripEntity);

      if (!trip) {
        return response.status(400).json({ error: "Error creating trip" });
      }

      return { message: trip, status: 200 };
    } catch (error) {
      // Handle validation errors or database errors
      console.log(error);
      // If a response hasn't been sent yet, send an error response
      if (!response.headersSent) {
        return response.status(500).json({ error: "An error occurred" });
      }
    }
  }

  async getTrip(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.body.tripId);

    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ["driver", "vehicle", "locationFrom", "locationTo", "stops"],
    });
    return { message: trip, status: 200 };
  }

  async getTrips(request: Request, response: Response, next: NextFunction) {
    const {
      pageNumber,
      pageSize,
      startOfDay,
      endOfDay,
      fromCity,
      fromState,
      toCity,
      toState,
    } = request.body;
    // i am expecting client to pass date in this format: 2021-05-05T00:00:00.000Z UTC for from and to date
    const trips = await retrieveTrips(
      pageNumber,
      pageSize,
      startOfDay,
      endOfDay,
      fromCity,
      fromState,
      toCity,
      toState
    );
    if (!trips) {
      return response.status(400).json({ error: "Error retrieving trips" });
    }
    return { message: trips, status: 200 };
  }
}
