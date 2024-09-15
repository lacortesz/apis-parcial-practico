/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* club imports */
import { TypeOrmTestingConfig} from '../shared/testing-utils/typeorm-testing-config'
import {ClubController} from './club.controller';
import {ClubService} from './club.service';
import {ClubEntity} from './club.entity';

describe('club controller', () => {
  let controller: ClubController;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];
  const clubMock: ClubEntity = {
    nombre: faker.name.firstName(), 
    fechaFundacion: faker.date.past().toLocaleDateString('es-ES'),
    imagen: faker.image.imageUrl(),
    descripcion: generarTextoMax(99),          
    socios: []
  } as ClubEntity;

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({...clubMock} as ClubEntity);
      clubsList.push(club);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
      controllers: [ClubController]
    }).compile();
    controller = module.get<ClubController>(ClubController);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all club', async () => {
    const clubs: ClubEntity[] = await controller.findAll();
    expect(clubs.length).toBe(clubsList.length);
  });

  it('should return the first club', async () => {
    const club: ClubEntity = await controller.findOne(clubsList[0].id);
    expect(club.nombre).toBe(clubsList[0].nombre);
  });

  it('should create a club', async () => {
    const club: ClubEntity = {...clubMock} as ClubEntity;
    const clubCreated: ClubEntity = await controller.create(club);
    expect(clubCreated).not.toBeNull();
  });

  it('should update the first club', async () => {
    const club: ClubEntity = {...clubMock, nombre: 'new club name'} as ClubEntity;
    const clubUpdate: ClubEntity = await controller.update(clubsList[0].id, club);
    expect(clubUpdate.nombre).toBe(club.nombre);
  });

  it('should delete a club', async () => {
    await controller.delete(clubsList[0].id);
    const clubs: ClubEntity[] = await controller.findAll();
    expect(clubs.length).toBe(4);
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