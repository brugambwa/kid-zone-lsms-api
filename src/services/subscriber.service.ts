import { Subscribers } from "@prisma/client";
import { SubscribersImplementationRepository } from "../repositories/implementations/subscriber.implementation";

export class SubscriberService {
  private readonly subscriberRepository: SubscribersImplementationRepository;

  constructor() {
    this.subscriberRepository = new SubscribersImplementationRepository();
  }

  async createSubscriber(
    first_name: string,
    last_name: string,
    telephone_number: string,
    email_address: string,
    village_id: number,
    home_address: string,
  ) {
    return await this.subscriberRepository.createSubscriber({
      first_name,
      last_name,
      telephone_number,
      email_address,
      village_id,
      home_address,
    });
  }

  async getAllSubscribers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Subscribers[]; total: number }> {
    return await this.subscriberRepository.findAll(page, limit);
  }

  async getSubscriberByID(subscriber_id: number): Promise<Subscribers | null> {
    return await this.subscriberRepository.findByID(subscriber_id);
  }

  async getSubscriberByEmail(email: string): Promise<Subscribers | null> {
    return await this.subscriberRepository.findByEmail(email);
  }

  async updateSubscriber(
    subscriber_id: number,
    first_name?: string,
    last_name?: string,
    telephone_number?: string,
    email_address?: string,
    village_id?: number,
    home_address?: string,
  ): Promise<Subscribers | null> {
    return await this.subscriberRepository.updateSubscriber(subscriber_id, {
      first_name,
      last_name,
      telephone_number,
      email_address,
      village_id,
      home_address,
    });
  }

  async deleteSubscriber(id: number): Promise<void> {
    await this.subscriberRepository.deleteSubscriber(id);
  }
}
