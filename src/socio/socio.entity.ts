/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
/* Entities imports*/
import { ClubEntity } from '../club/club.entity';

@Entity()
export class SocioEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 correoElectronico: string;
 
 @Column(({type: 'date'}))
 fechaNacimiento: string;
 
 @ManyToMany(() => ClubEntity, (club: ClubEntity) => club.socios)
  @JoinTable()
  clubes: ClubEntity[];

}
