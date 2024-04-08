import { InMemoryGymsRepository } from '../../repositories/inMemory/InMemoryGymsRepository'
import { PrismaGymsRepository } from '../../repositories/Prisma/PrismaGymsRepository'
import { PrismaCheckInsRepository } from '../../repositories/Prisma/PrismaCheckInsRepository'
import { CheckInService } from '../../services/checkIn/CheckInService'

export function makeCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInService = new CheckInService(checkInsRepository, gymsRepository)

  return checkInService
}
