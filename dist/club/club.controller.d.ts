import { ClubDto } from './club.dto';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
export declare class ClubController {
    private readonly clubService;
    constructor(clubService: ClubService);
    findAll(): Promise<ClubEntity[]>;
    findOne(clubId: string): Promise<ClubEntity>;
    create(clubDto: ClubDto): Promise<ClubEntity>;
    update(clubId: string, clubDto: ClubDto): Promise<ClubEntity>;
    delete(clubId: string): Promise<void>;
}
