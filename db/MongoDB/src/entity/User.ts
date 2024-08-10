import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm"

@Entity()
export class User {

    @ObjectIdColumn()
    id: ObjectId

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

}
