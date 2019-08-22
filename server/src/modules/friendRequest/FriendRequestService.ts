import {ModelType, Ref} from "typegoose";
import FriendRequestModel, {FriendRequest} from "./FriendRequestEntity";

export class FriendRequestService {
    private readonly model: ModelType<FriendRequest>;

    constructor() {
        this.model = FriendRequestModel;
    }

    async createFriendRequest(fromUser: String, toUser: String) {
        return this.model.create({fromUser,toUser})
    }

    async deleteFriendRequest(friendRequestId: String) {
        return this.model.findByIdAndRemove(friendRequestId);
    }

    async getFriendRequest (fromUser: String, toUser: String) {
        return this.model.findOne({fromUser,toUser});
    }

}
