import Joi from "joi";

const locationSchema = Joi.object({
  from: Joi.object({
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
    placeName: Joi.string().required(),
    formattedAddress: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    googlePlaceId: Joi.string().required(),
  }),
  to: Joi.object({
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
    placeName: Joi.string().required(),
    formattedAddress: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    googlePlaceId: Joi.string().required(),
  }),
});

const stopSchema = Joi.object({
  longitude: Joi.string().required(),
  latitude: Joi.string().required(),
  placeName: Joi.string().required(),
  formattedAddress: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  googlePlaceId: Joi.string().required(),
});

const vehicleSchema = Joi.object({
  id: Joi.string().allow(""),
  name: Joi.string().allow(""),
  type: Joi.string().allow(""),
  color: Joi.string().allow(""),
  year: Joi.string().allow(""),
  license: Joi.string().allow(""),
  vehicleImage: Joi.string().allow(""),
});

const tripSchema = Joi.object({
  location: locationSchema.required(),
  stops: Joi.array().items(stopSchema),
  startTime: Joi.string().required(),
  vehicle: vehicleSchema,
  trunk: Joi.string(),
  emptySeats: Joi.string(),
  price: Joi.string().required(),
  description: Joi.string().allow(""),
});

export default tripSchema;
