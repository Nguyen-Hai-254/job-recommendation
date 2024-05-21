import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    notificationId: number

    @Column()
    content: string

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    dateAndTime: Date

    @ManyToOne(() => User,
        (user) => user.notifications,{
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    user: User
}