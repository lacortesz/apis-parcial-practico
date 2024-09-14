import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { SocioClubService } from './socio-club.service';
import { SocioClubController } from './socio-club.controller';
import { SocioService } from '../socio/socio.service';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
  providers: [SocioService, SocioClubService],
  controllers: [SocioClubController]
})
export class SocioClubModule {}
