/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* socio-club imports */
import {SocioClubController} from './socio-club.controller';
import {SocioClubService} from './socio-club.service';
import {ClubEntity} from '../club/club.entity';
import {SocioEntity} from '../socio/socio.entity';
import {ClubDto} from '../club/club.dto';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('socio-club', () => {
  let controller: SocioClubController;
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
        fechaFundacion: '09/03/1983',
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
        fechaNacimiento: '09/03/1983',
        clubes: []
      } as SocioEntity);
      sociosList.push(socio);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
      controllers: [SocioClubController]
    }).compile();
    controller = module.get<SocioClubController>(SocioClubController);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a club to socio', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubesList[0].id;
    const socio: SocioEntity = await controller.addMemberToClub(socioId, clubId);
    expect(socio.clubes.length).toBe(1);
  });

  it('should get a club of socio', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubesList[0].id;
    await controller.addMemberToClub(socioId, clubId);
    const club: ClubEntity = await controller.findMemberFromClub(socioId, clubId);
    expect(club.id).toBe(clubId);
  });

  it('should get all the clubes of socio', async () => {
    const socioId: string = sociosList[0].id;
    await controller.addMemberToClub(socioId, clubesList[0].id);
    await controller.addMemberToClub(socioId, clubesList[1].id);
    const clubes: ClubEntity[] = await controller.findMembersFromClub(socioId);
    expect(clubes.length).toBe(2);
  });

  it('should update the clubes of socio', async () => {
    const clubesDto: ClubDto[] = [{...clubesList[2]}];
    const socioId: string = sociosList[0].id;
    await controller.addMemberToClub(socioId, clubesList[0].id);
    await controller.addMemberToClub(socioId, clubesList[1].id);
    const socio: SocioEntity = await controller.updateMembersFromClub(clubesDto, socioId);
    expect(socio.clubes.length).toBe(1);
    expect(socio.clubes[0].id).toBe(clubesList[2].id);
  });

  it('should delete a club of socio', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubesList[0].id;
    await controller.addMemberToClub(socioId, clubesList[0].id);
    await controller.addMemberToClub(socioId, clubesList[1].id);
    await controller.addMemberToClub(socioId, clubesList[2].id);
    await controller.deleteMemberFromClub(socioId, clubId);
    const clubes: ClubEntity[] = await controller.findMembersFromClub(socioId);
    expect(clubes.length).toBe(2);
  });
});

function generarTextoMax(maxLength: number): string {
  // Genera un párrafo aleatorio
  const textoAleatorio: string = faker.lorem.paragraph();
  // Asegura que tenga como máximo 100 caracteres
  return textoAleatorio.length > maxLength ? textoAleatorio.slice(0, maxLength) : textoAleatorio;
}


function generarTextoMin(minLength: number): string {
  let textoAleatorio: string = faker.lorem.paragraph(); // Genera un párrafo inicial

  // Si el texto generado es menor a 101 caracteres, sigue añadiendo más texto
  while (textoAleatorio.length < minLength) {
      textoAleatorio += ' ' + faker.lorem.sentence(); // Añade una oración más
  }

  return textoAleatorio;
}