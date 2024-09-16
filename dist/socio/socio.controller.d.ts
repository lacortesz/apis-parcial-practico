import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
export declare class SocioController {
    private readonly socioService;
    constructor(socioService: SocioService);
    findAll(): Promise<SocioEntity[]>;
    findOne(socioId: string): Promise<SocioEntity>;
    create(socioDto: SocioDto): Promise<SocioEntity>;
    update(socioId: string, socioDto: SocioDto): Promise<SocioEntity>;
    delete(socioId: string): Promise<void>;
}
