import { ModelType } from 'typegoose'
import UserModel, { User } from './UserEntity'
import {Ref} from "typegoose";

export class UserService {
  private readonly model: ModelType<User>;

  constructor() {
    this.model = UserModel
  }

  async find(selector?: Partial<User>) {
    console.log('find selector: ', selector);
    return this.model.find(selector)
  }

  async findOneById(_id: Ref<User>) {
    console.log('findOneById _id: ', _id);
    return this.model.findOne({ _id }).populate("friends").populate("notifications").exec();
  }

  async findOneByStringId(_id: string) {
    console.log('findOneByStringId _id: ', _id);
    return this.model.findOne({ _id }).populate("friends").populate("notifications").exec();
  }

  async remove(_id: Ref<User>) {
    let entityToRemove = await this.model.findOne(_id);
    await this.model.remove(entityToRemove)
  }

  async updateUser(key: String, value: String, user: Ref<User>) {
    // @ts-ignore
    return  this.model.findByIdAndUpdate(user,{$set: {[key]: value}},{new:true});
  }

  async count(entity: any) {
    return this.model.count(entity)
  }

  async addToFriends(friendId: String, user: Ref<User>) {
    await this.model.findByIdAndUpdate(user,     {$addToSet: {friends: friendId}}, {new: true}).populate("friends").exec();
    return this.model.findByIdAndUpdate(friendId, {$addToSet: {friends: user}},     {new: true}).populate("friends").exec();
  }

  async addNotification(notificationId: String, user: String) {
    return this.model.findByIdAndUpdate(user, {$addToSet: {notifications: notificationId}},     {new: true}).populate("notifications").exec();
  }

  async removeFromFriends(friendId: String, user: Ref<User>) {
    await  this.model.findByIdAndUpdate(user,         {$pull: {friends: friendId}});
    return this.model.findByIdAndUpdate(friendId,     {$pull: {friends: user}});
  }

  async removeNotification(notificationId: String, user: Ref<User>) {
    return this.model.findByIdAndUpdate(user, {$pull: {notifications: notificationId}});
  }

}