import {Resolver, Query, Arg, Mutation, Authorized, Ctx, ID, InputType, Field as GQLField} from "type-graphql";
import { NotificationService } from "./NotificationService";
import { Notification } from "./NotificationEntity";
import {Context} from "../common/context";

@Resolver(Notification)
export default class DirectChatRoomResolver {
  private readonly service: NotificationService;

  constructor() {
    this.service = new NotificationService();
  }

  @Mutation(returns => Notification, { description: "Creates and return new Notification" })
  async createNotification(
      @Arg("description") description: String, @Arg("url") url: String, @Arg("type") type: String) {
      return await this.service.createNotification(description,url,type);
  }

  @Mutation(returns => Notification)
  async deleteNotification(@Arg("notificationId") notificationId: string){
    return await this.service.deleteNotification(notificationId);
  }

  @Query(returns => Notification)
  async getNotification(@Arg("notificationId") notificationId: string){
    return await this.service.getNotification(notificationId);
  }
}
