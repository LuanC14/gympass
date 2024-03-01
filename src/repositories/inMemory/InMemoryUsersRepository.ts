import { Prisma } from "@prisma/client";
import { IUsersRepository } from "../interfaces/IUsersRepository";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository {

    public items: User[] = []

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user: User = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date()
        }
        this.items.push(user)
        return user
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = this.items.find(item => item.email = email)
        if (user != null) return user
        return null
    }

    async findById(userId: string): Promise<User | null> {
        const user = this.items.find(item => item.id = userId)
        if (user != null) return user
        return null
    }

}