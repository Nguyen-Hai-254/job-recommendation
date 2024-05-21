import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { User, Application, OnlineProfile, AttachedDocument, Follow, JobPosting } from "./";

@Entity()
export class Employee extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @Column({ nullable: true })
    isMarried: boolean

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

    @OneToMany(() => Follow, (follow) => follow.employee)
    follow: Follow[]

    @ManyToMany(() => JobPosting, (jobPosting) => jobPosting.employee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinTable({
        name: 'follow-job',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'userId'
        },
        inverseJoinColumn: {
            name: 'postId',
            referencedColumnName: 'postId'
        }
    })
    jobs: JobPosting[]
}