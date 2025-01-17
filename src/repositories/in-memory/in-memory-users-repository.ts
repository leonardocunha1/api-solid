import { User, Prisma } from '@prisma/client';
import { UsersRepository } from '../users-repository';

// é uma simulação de um banco de dados em memória, para ser usado em testes unitários. Nesse exemplo, está simulando o prisma que está na pasta repositories/prisma/prisma-users-repository.ts

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
