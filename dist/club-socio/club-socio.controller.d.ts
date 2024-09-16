import { ClubSocioService } from './club-socio.service';
import { SocioDto } from '../socio/socio.dto';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from 'src/club/club.entity';
export declare class ClubSocioController {
    private readonly clubSocioService;
    constructor(clubSocioService: ClubSocioService);
    addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity>;
    findMemberFromClub(clubId: string, socioId: string): Promise<SocioEntity>;
    findMembersFromClub(clubId: string): Promise<SocioEntity[]>;
    updateMembersFromClub(sociosDto: SocioDto[], clubId: string): Promise<ClubEntity>;
    deleteMemberFromClub(clubId: string, socioId: string): Promise<void>;
}
