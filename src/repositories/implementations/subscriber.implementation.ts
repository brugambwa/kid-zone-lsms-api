import { Prisma, Subscribers } from "@prisma/client";
import { prismaDBConn } from "../../config/prisma";
import { SubscribersInterfaceRepository } from "../interfaces/subscribers.interface";

export class SubscribersImplementationRepository implements SubscribersInterfaceRepository {
  async createSubscriber(data: Prisma.SubscribersCreateInput): Promise<Subscribers> {
    return await prismaDBConn.subscribers.create({ data });
  }

  async findByID(subscriber_id: number): Promise<Subscribers | null> {
    return await prismaDBConn.subscribers.findUnique({ where: { subscriber_id: subscriber_id } });
  }

  async findByEmail(email: string): Promise<Subscribers | null> {
    return await prismaDBConn.subscribers.findUnique({ where: { email_address: email } });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Subscribers[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscribers.findMany({ skip, take: limit }),
      prismaDBConn.subscribers.count(),
    ]);
    return { data, total };
  }

  async findByTelephoneNumber(telephone_number: string): Promise<Subscribers | null> {
    return await prismaDBConn.subscribers.findUnique({ where: { telephone_number } });
  }

  async findByFirstName(first_name: string, page: number, limit: number): Promise<Subscribers[]> {
    const skip = (page - 1) * limit;
    return await prismaDBConn.subscribers.findMany({
      where: { first_name },
      skip,
      take: limit,
    });
  }

  async findByLastName(last_name: string, page: number, limit: number): Promise<Subscribers[]> {
    const skip = (page - 1) * limit;
    return await prismaDBConn.subscribers.findMany({
      where: { last_name },
      skip,
      take: limit,
    });
  }

  async updateSubscriber(subscriber_id: number, data: Prisma.SubscribersUpdateInput): Promise<Subscribers> {
    return await prismaDBConn.subscribers.update({
      where: { subscriber_id },
      data,
    });
  }

  async deleteSubscriber(subscriber_id: number): Promise<void> {
    await prismaDBConn.subscribers.delete({ where: { subscriber_id } });
  }
}
