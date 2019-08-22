import {prop as DBProp, Ref, Typegoose,} from "typegoose";
import { ObjectType, Field as GQLField, ID } from "type-graphql";
import { ObjectId } from "mongodb";
import { User } from "../user/UserEntity";

@ObjectType()
export class FriendRequest extends Typegoose {
  @GQLField(type => ID)
  readonly _id: ObjectId;

  @DBProp({required: true})
  @GQLField(type => User)
  fromUser: Ref<User>;

  @DBProp({required: true})
  @GQLField(type => User)
  toUser: Ref<User>;

}

export default new FriendRequest().getModelForClass(FriendRequest, {
  schemaOptions: { timestamps: true }
});
