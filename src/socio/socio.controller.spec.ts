/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* socio imports */
import { TypeOrmTestingConfig} from '../shared/testing-utils/typeorm-testing-config'
import {SocioController} from './socio.controller';
import {SocioService} from './socio.service';
import {SocioEntity} from './socio.entity';

describe('socio controller', () => {
  let controller: SocioController;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];
  const socioMock: SocioEntity = {
      nombre: faker.person.fullName(), 
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past().toLocaleDateString('es-ES'),
      clubes: []
  } as SocioEntity;

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({...socioMock} as SocioEntity);
      sociosList.push(socio);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
      controllers: [SocioController]
    }).compile();
    controller = module.get<SocioController>(SocioController);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all socio', async () => {
    const socios: SocioEntity[] = await controller.findAll();
    expect(socios.length).toBe(sociosList.length);
  });

  it('should return the first socio', async () => {
    const socio: SocioEntity = await controller.findOne(sociosList[0].id);
    expect(socio.nombre).toBe(sociosList[0].nombre);
  });

  it('should create a socio', async () => {
    const socio: SocioEntity = {...socioMock} as SocioEntity;
    const socioCreated: SocioEntity = await controller.create(socio);
    expect(socioCreated).not.toBeNull();
  });

  it('should update the first socio', async () => {
    const socio: SocioEntity = {...socioMock, nombre: 'new socio name'} as SocioEntity;
    const socioUpdate: SocioEntity = await controller.update(sociosList[0].id, socio);
    expect(socioUpdate.nombre).toBe(socio.nombre);
  });

  it('should delete a socio', async () => {
    await controller.delete(sociosList[0].id);
    const socios: SocioEntity[] = await controller.findAll();
    expect(socios.length).toBe(4);
  });
});
