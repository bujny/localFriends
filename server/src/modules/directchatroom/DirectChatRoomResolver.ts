import {Resolver, Query, Arg, Mutation, Authorized, Ctx, ID, InputType, Field as GQLField} from "type-graphql";
import { DirectChatRoomService } from "./DirectChatRoomService";
import { DirectChatRoom } from "./DirectChatRoomEntity";
import {Context} from "../common/context";

@Resolver(DirectChatRoom)
export default class DirectChatRoomResolver {
  private readonly service: DirectChatRoomService;

  constructor() {
    this.service = new DirectChatRoomService();
  }

  @Query(returns => DirectChatRoom, { description: "Get user and his friend Dchatrom", nullable: true })
  @Authorized()
  async getDirectChatRoom(@Arg("friendId") friendId: string, @Ctx() ctx: Context) {
    //@ts-ignore
    return await this.service.findOneMatching(ctx.userId, friendId);
  }

  @Query(returns => DirectChatRoom, { description: "Get direct chatrom by id" })
  async getDirectChatRoomById(@Arg("_id") _id: string) {
    return await this.service.findById(_id);
  }

  @Mutation(returns => DirectChatRoom, { description: "Creates and return new direct chatroom id" })
  @Authorized()
  async createNewDirectChatRoom(
      @Arg("friendId") friendId: string,
      @Ctx() ctx: Context) {
      return await this.service.createNewChatroom(ctx.userId, friendId)
  }
}
