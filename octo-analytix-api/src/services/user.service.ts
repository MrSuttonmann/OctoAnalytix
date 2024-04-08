import {User, CreateUserDto} from 'types';
import { Q1DB } from 'workers-qb;
export class UserService {

    private db: Q1DB;

    constructor(db: D1Database) {
        this.db = new Q1DB(db);
    }

    async createUser(data: CreateUserDto): Promise<User> {
        
        const ps = this.db.prepare(
            `INSERT INTO Users (
                'EmailAddress',
                'OctopusApiKey',
                'OctopusAccountNumber',
                'DateCreated'
            ) VALUES (
                    ?1,
                    ?2,
                    ?3,
                    ?4,
                    ?5,
                    ?6            
            );`).bind(data.emailAddress, data);
        const response = await ps.run();
        if (!response.success) throw new Error(response.error);
        return await this.getUserByEmail(data.emailAddress);
    }

    async getUserById(userId: string): Promise<User> {
        throw new Error('Not implemented');
    }

    async getUserByEmail(email: string): Promise<User> {
        throw new Error('Not implemented');
    }
}