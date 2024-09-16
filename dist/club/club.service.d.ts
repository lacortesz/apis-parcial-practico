import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
export declare class ClubService {
    private readonly clubRepository;
    constructor(clubRepository: Repository<ClubEntity>);
    findAll(): Promise<ClubEntity[]>;
    findOne(id: string): Promise<ClubEntity>;
    create(club: ClubEntity): Promise<ClubEntity>;
    update(id: string, club: ClubEntity): Promise<ClubEntity>;
    delete(id: string): Promise<void>;
}
