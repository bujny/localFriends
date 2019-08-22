import {prop as DBProp, arrayProp as DBArrayProp, Typegoose, Ref} from "typegoose";
import { ObjectType, Field as GQLField, ID } from "type-graphql";
import { ObjectId } from "mongodb";
import { User } from "../user/UserEntity";

@ObjectType()
export class DirectChatRoom extends Typegoose {
  @GQLField(type => ID)
  readonly _id: ObjectId;

  @DBArrayProp({ itemsRef: User })
  @GQLField(type => [User])
  users: Ref<User>[];
}

export default new DirectChatRoom().getModelForClass(DirectChatRoom, {
  schemaOptions: { timestamps: true }
});
