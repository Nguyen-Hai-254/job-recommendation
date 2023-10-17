import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./Users";
import { JobPosting } from "./JobPosting";
import { Employee } from "./Employee";

@Entity()
export class Employer extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @Column({ nullable: true })
    taxCode: string

    @Column({ nullable: true })
    companyName: string

    @Column({ nullable: true })
    companyLocation: string

    @Column({ nullable: true })
    careerField: string

    @OneToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'userId'
    })
    user: User

    @OneToMany(() => JobPosting, (jobPosting) => jobPosting.employer)
    jobPostings: JobPosting[]

    @ManyToMany(() => Employee,
        (employee) => employee.follow)
    @JoinTable({
        name: 'save',
        joinColumn: {
            name: 'employerId',
            referencedColumnName: 'userId'
        },
        inverseJoinColumn: {
            name: 'employeeId',
            referencedColumnName: 'userId'
        }
    })
    saveEmployee: Employee[]
}