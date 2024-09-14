/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, Post, Get, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors-interceptor'; 
import { SocioClubService } from './socio-club.service';
import { ClubDto } from '../club/club.dto';
import { ClubEntity } from '../club/club.entity';


@Controller('socios')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {
   constructor(private readonly socioClubService: SocioClubService){}
    

@Post(':socioId/clubes/:clubId')
   async addMemberToClub(@Param('socioId') socioId: string, @Param('clubId') clubId: string){
       return await this.socioClubService.addMemberToClub(socioId, clubId);
    }

@Get(':socioId/clubes/:clubId')
async findMemberFromClub(@Param('socioId') socioId: string, @Param('clubId') clubId: string){
    return await this.socioClubService.findMemberFromClub(socioId, clubId);
    }

@Get(':socioId/clubes')
   async findMembersFromClub(@Param('socioId') socioId: string){
       return await this.socioClubService.findMembersFromClub(socioId);
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