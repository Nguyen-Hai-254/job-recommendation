import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: number

    @Column({
        unique: true
    })
    email: string

    @Column()
    password: string
}