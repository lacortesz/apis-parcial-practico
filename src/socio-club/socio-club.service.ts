/* archivo: src/socio-club/socio-club.service.ts */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioClubService {
   constructor(
       @InjectRepository(SocioEntity)
       private readonly socioRepository: Repository<SocioEntity>,
   
       @InjectRepository(ClubEntity)
       private readonly clubRepository: Repository<ClubEntity>
   ) {}

   async addMemberToClub(socioId: string, clubId: string): Promise<SocioEntity> {
       const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}});
       if (!club)
         throw new BusinessLogicException("El club con este id no fue encontrado", BusinessError.NOT_FOUND);
     
       const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubes"]})
       if (!socio)
         throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND);
   
       socio.clubes = [...socio.clubes, club];
       return await this.socioRepository.save(socio);
     }
   
   async findMemberFromClub(socioId: string, clubId: string): Promise<ClubEntity> {
       const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}});
       if (!club)
         throw new BusinessLogicException("El club con este id no fue encontrado", BusinessError.NOT_FOUND)
      
       const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubes"]});
       if (!socio)
         throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND)
  
       const socioClub: ClubEntity = socio.clubes.find(e => e.id === club.id);
  
       if (!socioClub)
         throw new BusinessLogicException("el club con este id no esta asociado al socio" , BusinessError.PRECONDITION_FAILED)
  
       return socioClub;
   }
   
   async findMembersFromClub(socioId: string): Promise<ClubEntity[]> {
       const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubes"]});
       if (!socio)
         throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND)
      
       return socio.clubes;
   }
   
   async updateMembersFromClub(socioId: string, clubes: ClubEntity[]): Promise<SocioEntity> {
       const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubes"]});
   
       if (!socio)
         throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < clubes.length; i++) {
         const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubes[i].id}});
         if (!club)
           throw new BusinessLogicException("El club con este id no fue encontrado", BusinessError.NOT_FOUND)
       }
   
       socio.clubes = clubes;
       return await this.socioRepository.save(socio);
     }
   
   async deleteMemberFromClub(socioId: string, clubId: string){
       const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}});
       if (!club)
         throw new BusinessLogicException("El club con este id no fue encontrado", BusinessError.NOT_FOUND)
   
       const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubes"]});
       if (!socio)
         throw new BusinessLogicException("El socio con este id no fue encontrado", BusinessError.NOT_FOUND)
   
       const socioClub: ClubEntity = socio.clubes.find(e => e.id === club.id);
   
       if (!socioClub)
           throw new BusinessLogicException("el club con este id no esta asociado al socio", BusinessError.PRECONDITION_FAILED)

       socio.clubes = socio.clubes.filter(e => e.id !== clubId);
       await this.socioRepository.save(socio);
   }  
}