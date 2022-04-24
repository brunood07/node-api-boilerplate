import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { hash } from "bcryptjs";

import { prisma } from "../../../../database/prismaClient";

class CreateUserUseCase {
  async execute({ username, password }: ICreateUserDTO) {
    const userExists = await prisma.users.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (userExists) throw new Error("User already exists!");

    const hashPassword = await hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashPassword,
      },
    });

    return newUser;
  }
}

export { CreateUserUseCase };
