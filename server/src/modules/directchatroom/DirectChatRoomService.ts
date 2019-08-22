import {ModelType, Ref} from "typegoose";
import DirectChatRoomModel, { DirectChatRoom } from "./DirectChatRoomEntity";
import {User} from "../user/UserEntity";

export class DirectChatRoomService {
  private readonly model: ModelType<DirectChatRoom>;

  constructor() {
    this.model = DirectChatRoomModel;
  }

  async findOneMatching(userId: String, friendId: String) {
    return this.model.findOne({ $or: [ { users: [userId, friendId] }, { users: [friendId, userId] }] }).exec();
  }

  async findById(directId: String) {
    return this.model.findById(directId).populate("users").exec();
  }

  async createNewChatroom(myId: Ref<User>, friendId: String) {
    return this.model.create({users: [myId,friendId]})
  }

}
