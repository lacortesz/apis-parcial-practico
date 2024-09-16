import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
export declare class ClubSocioService {
    private readonly ClubRepository;
    private readonly SocioRepository;
    private relations;
    constructor(ClubRepository: Repository<ClubEntity>, SocioRepository: Repository<SocioEntity>);
    addMemberToClub(ClubId: string, SocioId: string): Promise<ClubEntity>;
    findMemberFromClub(ClubId: string, SocioId: string): Promise<SocioEntity>;
    findMembersFromClub(ClubId: string): Promise<SocioEntity[]>;
    updateMembersFromClub(ClubId: string, socios: SocioEntity[]): Promise<ClubEntity>;
    deleteMemberFromClub(ClubId: string, SocioId: string): Promise<void>;
}
