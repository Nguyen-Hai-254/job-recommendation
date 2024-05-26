import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Notification extends BaseEntity {
    constructor() {
        super();
        this.dateAndTime = new Date();
    }

    @PrimaryGeneratedColumn()
    notificationId: number

    @Column()
    title: string

    @Column()
    content: string

    @Column({ type: 'timestamp' })
    dateAndTime: Date

    @ManyToOne(() => User,
        (user) => user.notifications,{
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    user: User
}