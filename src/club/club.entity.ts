/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
/* import entities */
import { SocioEntity } from '../socio/socio.entity';

@Entity()
export class ClubEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
  
 @Column(({type: 'date'}))
 fechaFundacion: string;

 @Column()
 imagen: string;

 @Column()
 descripcion: string;

 @ManyToMany(() => SocioEntity, (socio: any) => socio.clubes)
 socios: SocioEntity[];
 
}