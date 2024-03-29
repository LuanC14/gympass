import { CheckIn, Prisma } from "@prisma/client"

export interface ICheckInsRepository {
    /*  CheckInUncheckedCreateInput é usado ao invés do CheckInCreateInput porquê este, presume que os registros relacionado a suas FK's
        como User e Gym, já estão criados, dispensando assim a geração dos mesmos em suas respectivas tabelas.
    */
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

    save(checkIn: CheckIn): Promise<CheckIn>

    findById(id: string): Promise<CheckIn | null>

    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>

    countByUserId(userId: string): Promise<number>
}