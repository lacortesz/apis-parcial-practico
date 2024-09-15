/* Global imports */
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
/* Club-Socio imports */
import {SocioEntity} from '../socio/socio.entity';
import {ClubEntity} from '../club/club.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

/** Club-Socio service logic */
@Injectable()
export class ClubSocioService {
  /** Relations Array constant of Restaurante */
  private relations: string[] = ['socios'];

  constructor(
    @InjectRepository(ClubEntity)
    private readonly ClubRepository: Repository<ClubEntity>,
    @InjectRepository(SocioEntity)
    private readonly SocioRepository: Repository<SocioEntity>
  ) {}

  async addMemberToClub(ClubId: string, SocioId: string): Promise<ClubEntity> {
    const Socio: SocioEntity = await this.SocioRepository.findOne({where: {id: SocioId}});
    if (!Socio) 
      throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND);
    
    const Club: ClubEntity = await this.ClubRepository.findOne({where: {id: ClubId},relations: this.relations});
    
    if (!Club) 
      throw new BusinessLogicException('El club con este id no fue encontrado', BusinessError.NOT_FOUND);
    
    Club.socios = [...Club.socios, Socio];
    return await this.ClubRepository.save(Club);
  }

  async findMemberFromClub(ClubId: string, SocioId: string): Promise<SocioEntity> {
    const Socio: SocioEntity = await this.SocioRepository.findOne({where: {id: SocioId}});
    if (!Socio) 
      throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND);
    
    const Club: ClubEntity = await this.ClubRepository.findOne({where: {id: ClubId}, relations: this.relations});
    if (!Club) 
      throw new BusinessLogicException("El club con este id no fue encontrado", BusinessError.NOT_FOUND);
    
    const ClubSocio: SocioEntity = Club.socios.find((e) => e.id === Socio.id);
    if (!ClubSocio) 
      throw new BusinessLogicException('El socio con este id no esta asociado al club', BusinessError.PRECONDITION_FAILED);
    
    return ClubSocio;
  }

  async findMembersFromClub(ClubId: string): Promise<SocioEntity[]> {
    const Club: ClubEntity = await this.ClubRepository.findOne({
      where: {id: ClubId},
      relations: this.relations
    });
    if (!Club) throw new BusinessLogicException("El club con este id no fue encontrado", BusinessError.NOT_FOUND);
    return Club.socios;
  }

  async updateMembersFromClub(ClubId: string, socios: SocioEntity[]): Promise<ClubEntity> {
    const Club: ClubEntity = await this.ClubRepository.findOne({
      where: {id: ClubId},
      relations: this.relations
    });
    if (!Club) throw new BusinessLogicException("El club con este id no fue encontrado", BusinessError.NOT_FOUND);
    for (const socio of socios) {
      const Socio: SocioEntity = await this.SocioRepository.findOne({where: {id: socio.id}});
      if (!Socio) throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND);
    }
    Club.socios = socios;
    return await this.ClubRepository.save(Club);
  }

  async deleteMemberFromClub(ClubId: string, SocioId: string): Promise<void> {
    const Socio: SocioEntity = await this.SocioRepository.findOne({where: {id: SocioId}});
    if (!Socio) 
      throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND);
    
    const Club: ClubEntity = await this.ClubRepository.findOne({where: {id: ClubId}, relations: this.relations});
    if (!Club) 
      throw new BusinessLogicException('El club con este id no fue encontrado', BusinessError.NOT_FOUND);
    
    const ClubSocio: SocioEntity = Club.socios.find((e) => e.id === Socio.id);
    if (!ClubSocio) 
      throw new BusinessLogicException('El socio con este id no esta asociado al club', BusinessError.PRECONDITION_FAILED);
    
    Club.socios = Club.socios.filter((e) => e.id !== SocioId);
    await this.ClubRepository.save(Club);
  }
}
