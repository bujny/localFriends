import {arrayProp as DBArrayProp, prop as DBProp, Ref, Typegoose} from "typegoose";
import {ObjectType as GQLObject, Field as GQLField, ID} from "type-graphql";
import {ObjectId} from "mongodb";
import {Role} from "./enums";
import {Notification} from "../notification/NotificationEntity";

@GQLObject()
export class Profile {
    @DBProp({required: true})
    @GQLField()
    firstName: string;

    @DBProp({required: true})
    @GQLField()
    lastName: string;
}

@GQLObject()
export class Property {
    @DBProp({required: true})
    @GQLField()
    address: string;

    @DBProp({required: true})
    @GQLField()
    placeId: string;

    @DBProp({required: true})
    @GQLField()
    rentAmount: number;
}

@GQLObject()
export class User extends Typegoose {
    @GQLField(type => ID)
    readonly _id: ObjectId;

    @DBProp()
    @GQLField(type => Profile)
    profile: Profile;

    @DBProp()
    @GQLField(type => Property, {nullable: true})
    properties?: Property[];

    @DBProp({required: true, enum: Role})
    @GQLField(type => Role)
    roles: Role[];

    @DBProp()
    @GQLField(() => Date)
    createdAt: Date;

    @DBProp()
    @GQLField(() => Date)
    updatedAt: Date;

    @DBArrayProp({itemsRef: User})
    @GQLField(type => [User], {nullable: true})
    friends?: Ref<User>[];

    @DBProp()
    @GQLField(type => String, { nullable: true })
    avatarUrl?: String;

    @DBArrayProp({itemsRef: Notification})
    @GQLField(type => [Notification], {nullable: true})
    notifications?: Ref<Notification>[];
}

export default new User().getModelForClass(User, {
    schemaOptions: {timestamps: true}
});
