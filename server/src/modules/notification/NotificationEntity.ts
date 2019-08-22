import {prop as DBProp, Typegoose,} from "typegoose";
import { ObjectType, Field as GQLField, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class Notification extends Typegoose {
  @GQLField(type => ID)
  readonly _id: ObjectId;

  @DBProp({required: true})
  @GQLField()
  description: string;

  @DBProp({required: true})
  @GQLField()
  url: string;

  @DBProp({required: true})
  @GQLField()
  type: string;

  @DBProp()
  @GQLField(() => Date)
  createdAt: Date;

}

export default new Notification().getModelForClass(Notification, {
  schemaOptions: { timestamps: true }
});
