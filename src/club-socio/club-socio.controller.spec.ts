/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* socio-club imports */
import { ClubSocioController } from './club-socio.controller'; 
import {ClubSocioService} from './club-socio.service';
import {ClubEntity} from '../club/club.entity';
import {SocioEntity} from '../socio/socio.entity';
import {SocioDto} from '../socio/socio.dto';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('club-socio', () => {
  let controller: ClubSocioController;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let sociosList: SocioEntity[];
  let clubesList: ClubEntity[];

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();
    sociosList = [];
    clubesList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await clubRepository.save({
        nombre: faker.name.firstName(), 
        fechaFundacion: "09/03/1983",
        imagen: faker.image.imageUrl(),
        descripcion: generarTextoMax(99),          
        socios: []
      } as ClubEntity);
      clubesList.push(club);
    }
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        nombre: faker.name.firstName(), 
        correoElectronico: faker.internet.email(),
        fechaNacimiento: "09/03/1983",
        clubes: []
      } as SocioEntity);
      sociosList.push(socio);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
      controllers: [ClubSocioController]
    }).compile();
    controller = module.get<ClubSocioController>(ClubSocioController);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a socio to club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubesList[0].id;
    const club: ClubEntity = await controller.addMemberToClub(clubId, socioId);
    expect(club.socios.length).toBe(1);
  });

  it('should get a socio of club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubesList[0].id;
    await controller.addMemberToClub(clubId, socioId);
    const socio: SocioEntity = await controller.findMemberFromClub(clubId, socioId);
    expect(socio.id).toBe(socioId);
  });

  it('should get all the socios of club', async () => {
    const clubId: string = clubesList[0].id;
    await controller.addMemberToClub(clubId, sociosList[0].id);
    await controller.addMemberToClub(clubId, sociosList[1].id);
    const socios: SocioEntity[] = await controller.findMembersFromClub(clubId);
    expect(socios.length).toBe(2);
  });

  it('should update the socios of a club', async () => {
    const sociosDto: SocioDto[] = [{...sociosList[2]}];
    const clubId: string = clubesList[0].id;
    await controller.addMemberToClub(clubId, sociosList[0].id);
    await controller.addMemberToClub(clubId, sociosList[1].id);
    const club: ClubEntity = await controller.updateMembersFromClub(sociosDto, clubId);
    expect(club.socios.length).toBe(1);
    expect(club.socios[0].id).toBe(sociosList[2].id);
  });

  it('should delete a socio of club', async () => {
    const clubId: string = clubesList[0].id;
    await controller.addMemberToClub(clubId, sociosList[0].id);
    await controller.addMemberToClub(clubId, sociosList[1].id);
    await controller.addMemberToClub(clubId, sociosList[2].id);
    await controller.deleteMemberFromClub(clubId, sociosList[0].id);
    const socios: SocioEntity[] = await controller.findMembersFromClub(clubId);
    expect(socios.length).toBe(2);
  });
});

function generarTextoMax(maxLength: number): string {
  // Genera un párrafo aleatorio
  const textoAleatorio: string = faker.lorem.paragraph();
  // Asegura que tenga como máximo 100 caracteres
  return textoAleatorio.length > maxLength ? textoAleatorio.slice(0, maxLength) : textoAleatorio;
}
