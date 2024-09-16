import { ClubEntity } from '../club/club.entity';
export declare class SocioEntity {
    id: string;
    nombre: string;
    correoElectronico: string;
    fechaNacimiento: string;
    clubes: ClubEntity[];
}
