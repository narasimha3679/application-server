import { UserController } from "./controller/UserController";
import { TripController } from "./controller/TripController";

export const Routes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    requiresAuth: true,
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    requiresAuth: true,
  },
  {
    method: "post",
    route: "/register",
    controller: UserController,
    action: "save",
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "softDelete",
    requiresAuth: true,
  },
  {
    method: "post",
    route: "/login",
    controller: UserController,
    action: "login",
  },
  {
    method: "post",
    route: "/phonelogin",
    controller: UserController,
    action: "phoneLogin",
  },
  {
    method: "post",
    route: "/otpverify",
    controller: UserController,
    action: "otpVerify",
  },
  {
    method: "post",
    route: "/forgotpassword",
    controller: UserController,
    action: "forgotPassword",
  },
  {
    method: "post",
    route: "/trip",
    controller: TripController,
    action: "createTrip",
    requiresAuth: true,
  },
  {
    method: "get",
    route: "/trip",
    controller: TripController,
    action: "getTrip",
    requiresAuth: true,
  },
  {
    method: "get",
    route: "/trips",
    controller: TripController,
    action: "getTrips",
    requiresAuth: true,
  },
];
