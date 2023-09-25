import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entity/User";

export const getUser = async (id: number) => {
  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .select([
      "user.id",
      "user.firstName",
      "user.lastName",
      "user.email",
      "user.countryCd",
      "user.phone",
      "user.status",
      "user.userImage",
    ])
    .where("user.id = :id", { id: id })
    .getOne();

  return user;
};
