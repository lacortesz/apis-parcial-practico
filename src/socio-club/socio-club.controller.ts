/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, Post, Get, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors-interceptor'; 
import { SocioClubService } from './socio-club.service';
import { ClubDto } from '../club/club.dto';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';


@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {
   constructor(private readonly socioClubService: SocioClubService){}
    

@Post(':clubId/members/:socioId')
   async addMemberToClub(
    @Param('clubId') clubId: string, 
    @Param('socioId') socioId: string
    ): Promise<SocioEntity> {
       return await this.socioClubService.addMemberToClub(socioId, clubId);
    }

@Get(':socioId/clubes/:clubId')
async findMemberFromClub(@Param('socioId') socioId: string, @Param('clubId') clubId: string){
    return await this.socioClubService.findMemberFromClub(socioId, clubId);
    }

@Get(':clubId/members')
   async findMembersFromClub(@Param('clubId') clubId: string){
       return await this.socioClubService.findMembersFromClub(clubId);
    }

@Put(':socioId/clubes')
async updateMembersFromClub(@Body() clubsDto: ClubDto[], @Param('socioId') socioId: string){
    const clubs = plainToInstance(ClubEntity, clubsDto)
    return await this.socioClubService.updateMembersFromClub(socioId, clubs);
    }

@Delete(':socioId/clubs/:clubId')
@HttpCode(204)
   async deleteMemberFromClub(@Param('socioId') socioId: string, @Param('clubId') clubId: string){
       return await this.socioClubService.deleteMemberFromClub(socioId, clubId);
   }
}