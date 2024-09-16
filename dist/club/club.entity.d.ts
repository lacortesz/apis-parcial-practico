import { SocioEntity } from '../socio/socio.entity';
export declare class ClubEntity {
    id: string;
    nombre: string;
    fechaFundacion: string;
    imagen: string;
    descripcion: string;
    socios: SocioEntity[];
}
