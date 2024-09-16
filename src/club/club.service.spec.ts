/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { ClubEntity } from './club.entity'; 
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for(let i = 0; i < 5; i++){        
        const club: ClubEntity = await repository.save({
          nombre: faker.person.fullName(), 
          fechaFundacion: faker.date.past().toLocaleDateString('es-ES'),   
          imagen: faker.image.url(),
          descripcion: generarTextoMax(99),          
          socios: []
      } as ClubEntity);
      clubsList.push(club);
    }
  };
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)
    expect(club.fechaFundacion).toEqual(storedClub.fechaFundacion)
    expect(club.imagen).toEqual(storedClub.imagen)
    expect(club.descripcion).toEqual(storedClub.descripcion)
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El club con este id no fue encontrado")
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: "",
      nombre: faker.person.fullName(), 
      fechaFundacion: faker.date.past().toLocaleDateString('es-ES'),
      imagen: faker.image.url(),
      descripcion: generarTextoMax(99),          
      socios: []
     
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre)
    expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion)
    expect(storedClub.imagen).toEqual(newClub.imagen)
    expect(storedClub.descripcion).toEqual(newClub.descripcion)
  });

  it('create with a description longer than 100 characters should return bad request', async () => {
    const club: ClubEntity = {
      id: "",
      nombre: faker.person.fullName(), 
      fechaFundacion: faker.date.past().toLocaleDateString('es-ES'),
      imagen: faker.image.url(),
      descripcion: generarTextoMin(101),          
      socios: []
    }

    await expect(() => service.create(club)).rejects.toHaveProperty("message", "Descripcion excede longitud maxima de 100 caracteres")
  });


  it('update should modify a club', async () => {
    const club: ClubEntity = clubsList[0];
    club.nombre = "New name";
    club.fechaFundacion = "11/11/1986";
  
    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
  
    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)
    expect(storedClub.fechaFundacion).toEqual(club.fechaFundacion)
  });
 
  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubsList[0];
    club = {
      ...club, nombre: "New name", fechaFundacion: "11/11/1986"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "El club con este id no fue encontrado")
  });

  it('update should throw an exception for a description longer than 100 characters should return bad request ', async () => {
    let club: ClubEntity = clubsList[0];
    club = {
      ...club, nombre: "New name", fechaFundacion: "11/11/1986", descripcion: "Molestiae ea qui debitis. Distinctio nobis eligendi molestias quia. Sapiente in ut. Autem labore rerum repudiandae quo qui assumenda molestiae"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "El club con este id no fue encontrado")
  });


  it('delete should remove a club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);
  
    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El club con este id no fue encontrado")
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
