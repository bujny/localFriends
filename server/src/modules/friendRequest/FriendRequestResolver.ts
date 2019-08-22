import {Resolver, Query, Arg, Mutation, Authorized, Ctx, ID, InputType, Field as GQLField} from "type-graphql";
import { FriendRequestService } from "./FriendRequestService";
import { FriendRequest } from "./FriendRequestEntity";

@Resolver(FriendRequest)
export default class DirectChatRoomResolver {
  private readonly service: FriendRequestService;

  constructor() {
    this.service = new FriendRequestService();
  }

  @Mutation(returns => FriendRequest)
  async createFriendRequest(
      @Arg("fromUser") fromUser: String, @Arg("toUser") toUser: String) {
      return await this.service.createFriendRequest(fromUser,toUser);
  }

  @Mutation(returns => FriendRequest)
  async deleteFriendRequest(@Arg("friendRequestId") friendRequestId: String){
    return await this.service.deleteFriendRequest(friendRequestId);
  }

  @Query(returns => FriendRequest)
  async getFriendRequest(@Arg("fromUser") fromUser: String, @Arg("toUser") toUser: String){
    return await this.service.getFriendRequest(fromUser,toUser);
  }
}
