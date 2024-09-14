/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioClubService } from './socio-club.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let socio: SocioEntity;
  let clubesList : ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    clubesList = [];
    for(let i = 0; i < 5; i++){
      const club: ClubEntity = await clubRepository.save({
        nombre: faker.name.firstName(), 
        fechaFundacion: '09/03/1983',
        imagen: faker.image.imageUrl(),
        descripcion: generarTextoMax(99),          
        socios: []
    } as ClubEntity);
      clubesList.push(club);
    }

    socio = await socioRepository.save({
      nombre: faker.name.firstName(), 
      correoElectronico: faker.internet.email(),
      fechaNacimiento: '09/03/1983',
      clubes: clubesList
    } as SocioEntity)
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addClubSocio should add an club to a socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: '09/03/1983',
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99)          
    } as ClubEntity);

    const newSocio: SocioEntity = await socioRepository.save({
        nombre: faker.name.firstName(), 
        correoElectronico: faker.internet.email(),
        fechaNacimiento: '09/03/1983'
   } as SocioEntity);
  

    const result: SocioEntity = await service.addClubSocio(newSocio.id, newClub.id);
    
    expect(result.clubes.length).toBe(1);
    expect(result.clubes[0]).not.toBeNull();
    expect(result.clubes[0].nombre).toBe(newClub.nombre)
    expect(result.clubes[0].fechaFundacion).toBe(newClub.fechaFundacion)
    expect(result.clubes[0].imagen).toBe(newClub.imagen)
    expect(result.clubes[0].descripcion).toBe(newClub.descripcion)
  });

  it('addClubSocio should thrown exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(), 
      correoElectronico: faker.internet.email(),
      fechaNacimiento: '09/03/1983'
    })

    await expect(() => service.addClubSocio(newSocio.id, "0")).rejects.toHaveProperty("message", "El club con este id no fue encontrado");
  });

  it('addClubSocio should throw an exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: '09/03/1983',
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99)
    });

    await expect(() => service.addClubSocio("0", newClub.id)).rejects.toHaveProperty("message", "El socio con este id no fue encontrado");
  });

  it('findClubBySocioIdClubId should return club by socio', async () => {
    const club: ClubEntity = clubesList[0];
    const storedClub: ClubEntity = await service.findClubBySocioIdClubId(socio.id, club.id, )
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toBe(club.nombre);
    expect(storedClub.fechaFundacion).toBe(club.fechaFundacion);
    expect(storedClub.imagen).toBe(club.imagen);
    expect(storedClub.descripcion).toBe(club.descripcion);
  });

  it('findClubBySocioIdClubId should throw an exception for an invalid club', async () => {
    await expect(()=> service.findClubBySocioIdClubId(socio.id, "0")).rejects.toHaveProperty("message", "El club con este id no fue encontrado"); 
  });

  it('findClubBySocioIdClubId should throw an exception for an invalid socio', async () => {
    const club: ClubEntity = clubesList[0]; 
    await expect(()=> service.findClubBySocioIdClubId("0", club.id)).rejects.toHaveProperty("message", "El socio con este id no fue encontrado"); 
  });

  it('findClubBySocioIdClubId should throw an exception for an club not associated to the socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: '09/03/1983',
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99)
    });

    await expect(()=> service.findClubBySocioIdClubId(socio.id, newClub.id)).rejects.toHaveProperty("message", "el club con este id no esta asociado al socio"); 
  });

  it('findClubesBySocioId should return clubes by socio', async ()=>{
    const clubes: ClubEntity[] = await service.findClubesBySocioId(socio.id);
    expect(clubes.length).toBe(5)
  });

  it('findClubesBySocioId should throw an exception for an invalid socio', async () => {
    await expect(()=> service.findClubesBySocioId("0")).rejects.toHaveProperty("message", "El socio con este id no fue encontrado"); 
  });

  it('associateClubesSocio should update clubes list for a socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: '09/03/1983',
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99) 
    });

    const updatedSocio: SocioEntity = await service.associateClubesSocio(socio.id, [newClub]);
    expect(updatedSocio.clubes.length).toBe(1);

    expect(updatedSocio.clubes[0].nombre).toBe(newClub.nombre);
    expect(updatedSocio.clubes[0].fechaFundacion).toBe(newClub.fechaFundacion);
    expect(updatedSocio.clubes[0].imagen).toBe(newClub.imagen);
    expect(updatedSocio.clubes[0].descripcion).toBe(newClub.descripcion);
  });

  it('associateClubesSocio should throw an exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: '09/03/1983',
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99)
  });

    await expect(()=> service.associateClubesSocio("0", [newClub])).rejects.toHaveProperty("message", "El socio con este id no fue encontrado"); 
  });

  it('associateClubesSocio should throw an exception for an invalid club', async () => {
    const newClub: ClubEntity = clubesList[0];
    newClub.id = "0";

    await expect(()=> service.associateClubesSocio(socio.id, [newClub])).rejects.toHaveProperty("message", "El club con este id no fue encontrado"); 
  });

  it('deleteClubToSocio should remove an club from a socio', async () => {
    const club: ClubEntity = clubesList[0];
    
    await service.deleteClubSocio(socio.id, club.id);

    const storedSocio: SocioEntity = await socioRepository.findOne({where: {id: socio.id}, relations: ["clubes"]});
    const deletedClub: ClubEntity = storedSocio.clubes.find(a => a.id === club.id);

    expect(deletedClub).toBeUndefined();

  });

  it('deleteClubToSocio should thrown an exception for an invalid club', async () => {
    await expect(()=> service.deleteClubSocio(socio.id, "0")).rejects.toHaveProperty("message", "El club con este id no fue encontrado"); 
  });

  it('deleteClubToSocio should thrown an exception for an invalid socio', async () => {
    const club: ClubEntity = clubesList[0];
    await expect(()=> service.deleteClubSocio("0", club.id)).rejects.toHaveProperty("message", "El socio con este id no fue encontrado"); 
  });

  it('deleteClubToSocio should thrown an exception for an non asocciated club', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: '09/03/1983',
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99)
    });

    await expect(()=> service.deleteClubSocio(socio.id, newClub.id)).rejects.toHaveProperty("message", "el club con este id no esta asociado al socio"); 
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