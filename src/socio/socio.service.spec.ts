/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { SocioEntity } from './socio.entity'; 
import { SocioService } from './socio.service';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
          nombre: faker.name.firstName(), 
          correoElectronico: faker.internet.email(),
          fechaNacimiento: faker.date.past().toLocaleDateString('es-ES'),
          clubes: []
      } as SocioEntity);
      sociosList.push(socio);
    }
  };
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne should return a socio by id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombre).toEqual(storedSocio.nombre)
    expect(socio.correoElectronico).toEqual(storedSocio.correoElectronico)
    expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El socio con este id no fue encontrado")
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: "",
      nombre: faker.name.firstName(), 
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past().toLocaleDateString('es-ES'),
      clubes: []
    }

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}})
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(newSocio.nombre)
    expect(storedSocio.correoElectronico).toEqual(newSocio.correoElectronico)
    expect(storedSocio.fechaNacimiento).toEqual(newSocio.fechaNacimiento)
  });

  it('create with a email formar should return bad request', async () => {
    const socio: SocioEntity = {
      id: "",
      nombre: faker.name.firstName(), 
      correoElectronico: 'bad.email',
      fechaNacimiento: faker.date.past().toLocaleDateString('es-ES'),
      clubes: []
    }

    await expect(() => service.create(socio)).rejects.toHaveProperty("message", "El correo electronico no contiene el formato adecuado")
  });


  it('update should modify a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.nombre = "New name";
    socio.correoElectronico = "test@test.com";
  
    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();
  
    const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(socio.nombre)
  });
 
  it('update should throw an exception for an invalid socio', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio, nombre: "New name", correoElectronico: "New address"
    }
    await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "El socio con este id no fue encontrado")
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
  
    const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El socio con este id no fue encontrado")
  });
 
});