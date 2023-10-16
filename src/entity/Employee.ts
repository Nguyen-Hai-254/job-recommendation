import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./Users";
import { Application } from "./Application";
import { OnlineProfile } from "./OnlineProfile";
import { AttachedDocument } from "./AttachedDocument";



export enum degree {
    highSchool = 'Trung học',
    intermediate = 'Trung cấp',
    associate = 'Cao đẳng',
    bachelor = 'Cử nhân',
    master = 'Thạc sĩ',
    doctor = 'Tiến sĩ',
    other = 'Khác'
}
@Entity()
export class Employee extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    // Da ket hon chua
    @Column({ nullable: true })
    isMarried: boolean

    @Column({
        type: 'enum',
        enum: degree,
        default: degree.other
    })
    degree: degree

    @OneToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'userId'
    })
    user: User

    @OneToOne(() => OnlineProfile, (onlineprofile) => onlineprofile.employee)
    online_profile: OnlineProfile

    @OneToOne(() => AttachedDocument, (attacheddocument) => attacheddocument.employee)
    attached_document: AttachedDocument

    @OneToMany(() => Application, (application) => application.employee)
    applications: Application[]
}