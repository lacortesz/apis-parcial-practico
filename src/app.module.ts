import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { SocioClubModule } from './socio-club/socio-club.module';

@Module({
  imports: [SocioModule, ClubModule, SocioClubModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial-practico',
      entities: [SocioModule, ClubModule],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
