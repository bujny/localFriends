import {ModelType, Ref} from "typegoose";
import NotificationModel, {Notification} from "./NotificationEntity";
import {User} from "../user/UserEntity";

export class NotificationService {
    private readonly model: ModelType<Notification>;

    constructor() {
        this.model = NotificationModel;
    }

    async createNotification(description: String, url: String, type: String) {
        return this.model.create({description, url, type})
    }

    async deleteNotification(notificationId: String) {
        return this.model.findByIdAndRemove(notificationId);
    }

    async getNotification (notificationId: String) {
        return this.model.findById(notificationId);
    }

}
