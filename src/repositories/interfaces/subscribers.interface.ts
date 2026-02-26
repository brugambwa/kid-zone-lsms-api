import { Prisma, Subscribers } from "@prisma/client";

export interface SubscribersInterfaceRepository {
  createSubscriber(data: Prisma.SubscribersCreateInput): Promise<Subscribers>;
  findByID(id: number): Promise<Subscribers | null>;
  findByEmail(email: string): Promise<Subscribers | null>;
  findAll(page: number, limit: number): Promise<{ data: Subscribers[]; total: number }>;
  findByTelephoneNumber(telephoneNumber: string): Promise<Subscribers | null>;
  findByFirstName(firstName: string, page: number, limit: number): Promise<Subscribers[]>;
  findByLastName(lastName: string, page: number, limit: number): Promise<Subscribers[]>;
  updateSubscriber(id: number, data: Prisma.SubscribersUpdateInput): Promise<Subscribers>;
  deleteSubscriber(id: number): Promise<void>;
}
