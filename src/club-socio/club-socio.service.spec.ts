/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubSocioService } from './club-socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioClubService', () => {
  let service: ClubSocioService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let club: ClubEntity;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    sociosList = [];
    for(let i = 0; i < 5; i++){
      const socio: SocioEntity = await socioRepository.save({
        nombre: faker.name.firstName(), 
        correoElectronico: faker.internet.email(),
        fechaNacimiento: faker.date.past().toLocaleDateString('es-ES'),
        clubes: []
    } as SocioEntity);

    sociosList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: "09/03/1983",
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99),          
      socios: sociosList
    } as ClubEntity)
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addClubSocio should add an socio to a club', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: faker.date.past().toLocaleDateString('es-ES'),
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99),
      socios: sociosList        
    } as ClubEntity);

    const newSocio: SocioEntity = await socioRepository.save({
        nombre: faker.name.firstName(), 
        correoElectronico: faker.internet.email(),
        fechaNacimiento: faker.date.past().toLocaleDateString('es-ES'),
        clubes: []
   } as SocioEntity);
  
    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id);
    
    expect(result.socios.length).toBe(6);
    expect(result.socios[5]).not.toBeNull();
    expect(result.socios[5].nombre).toBe(newSocio.nombre);
    expect(result.socios[5].correoElectronico).toBe(newSocio.correoElectronico);
    expect(result.socios[5].fechaNacimiento).toBe(newSocio.fechaNacimiento)
  });

  it('addClubSocio should thrown exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(), 
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past().toLocaleDateString('es-ES')
    })

    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "El club con este id no fue encontrado");
  });

  it('addClubSocio should throw an exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.firstName(), 
      fechaFundacion: faker.date.past().toLocaleDateString('es-ES'),
      imagen: faker.image.imageUrl(),
      descripcion: generarTextoMax(99)
    });

    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "El socio con este id no fue encontrado");
  });

  it('findSocioByClubIdSocioId should return socio by club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findMemberFromClub(club.id, socio.id, )
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toBe(socio.nombre);
    expect(storedSocio.fechaNacimiento).toBe(socio.fechaNacimiento);
    expect(storedSocio.correoElectronico).toBe(socio.correoElectronico);
  });

  it('findClubBySocioIdClubId should throw an exception for an invalid socio', async () => {
    await expect(()=> service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con este id no fue encontrado"); 
  });

  it('findClubBySocioIdClubId should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0]; 
    await expect(()=> service.findMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "El club con este id no fue encontrado"); 
  });

  it('findClubBySocioIdClubId should throw an exception for an socio not associated to the club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(), 
	    correoElectronico: faker.internet.email(),
	    fechaNacimiento: faker.date.past().toLocaleDateString('es-ES'),
	    clubes: []
    } as SocioEntity);

    await expect(()=> service.findMemberFromClub(club.id, newSocio.id, )).rejects.toHaveProperty("message", "El socio con este id no esta asociado al club"); 
  });

  it('findSociosByClubId should return socios by club', async ()=>{
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5)
  });

  it('findClubesBySocioId should throw an exception for an invalid socio', async () => {
    await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty("message", "El club con este id no fue encontrado"); 
  });

  it('associateClubesSocio should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(), 
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past().toLocaleDateString('es-ES'),
      clubes: []
    } as SocioEntity);

    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);

    expect(updatedClub.socios[0].nombre).toBe(newSocio.nombre);
    expect(updatedClub.socios[0].correoElectronico).toBe(newSocio.correoElectronico);
    expect(updatedClub.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento);

  });

  it('associateClubesSocio should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = sociosList[0];

    await expect(()=> service.updateMembersFromClub("0", [newSocio])).rejects.toHaveProperty("message", "El club con este id no fue encontrado"); 
  });

  it('associateClubesSocio should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";

    await expect(()=> service.updateMembersFromClub(club.id, [newSocio])).rejects.toHaveProperty("message", "El socio con este id no fue encontrado"); 
  });

  it('deleteClubToSocio should remove an socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];
    
    await service.deleteMemberFromClub(club.id, socio.id);

    const storedSocio: SocioEntity = await socioRepository.findOne({where: {id: socio.id}, relations: ["clubes"]});
    const deletedClub: ClubEntity = storedSocio.clubes.find(a => a.id === club.id);

    expect(deletedClub).toBeUndefined();

  });

  it('deleteClubToSocio should thrown an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    
    await expect(()=> service.deleteMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "El club con este id no fue encontrado"); 
  });

  it('deleteClubToSocio should thrown an exception for an invalid socio', async () => {
    
    await expect(()=> service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con este id no fue encontrado"); 
  });

  it('deleteClubToSocio should thrown an exception for an non asocciated club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(), 
	    correoElectronico: faker.internet.email(),
	    fechaNacimiento: "09/03/1983",
	    clubes: []
    } as SocioEntity);

    await expect(()=> service.deleteMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "El socio con este id no esta asociado al club"); 
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