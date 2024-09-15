import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ClubSocioService } from './club-socio.service';
import { ClubSocioController } from './club-socio.controller';
import { SocioService } from '../socio/socio.service';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
  providers: [SocioService, ClubSocioService],
  controllers: [ClubSocioController]
})
export class SocioClubModule {}
