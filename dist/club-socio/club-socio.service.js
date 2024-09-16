"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubSocioService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const socio_entity_1 = require("../socio/socio.entity");
const club_entity_1 = require("../club/club.entity");
const business_errors_1 = require("../shared/errors/business-errors");
let ClubSocioService = class ClubSocioService {
    constructor(ClubRepository, SocioRepository) {
        this.ClubRepository = ClubRepository;
        this.SocioRepository = SocioRepository;
        this.relations = ['socios'];
    }
    async addMemberToClub(ClubId, SocioId) {
        const Socio = await this.SocioRepository.findOne({ where: { id: SocioId } });
        if (!Socio)
            throw new business_errors_1.BusinessLogicException("El socio con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        const Club = await this.ClubRepository.findOne({ where: { id: ClubId }, relations: this.relations });
        if (!Club)
            throw new business_errors_1.BusinessLogicException('El club con este id no fue encontrado', business_errors_1.BusinessError.NOT_FOUND);
        Club.socios = [...Club.socios, Socio];
        return await this.ClubRepository.save(Club);
    }
    async findMemberFromClub(ClubId, SocioId) {
        const Socio = await this.SocioRepository.findOne({ where: { id: SocioId } });
        if (!Socio)
            throw new business_errors_1.BusinessLogicException("El socio con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        const Club = await this.ClubRepository.findOne({ where: { id: ClubId }, relations: this.relations });
        if (!Club)
            throw new business_errors_1.BusinessLogicException("El club con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        const ClubSocio = Club.socios.find((e) => e.id === Socio.id);
        if (!ClubSocio)
            throw new business_errors_1.BusinessLogicException('El socio con este id no esta asociado al club', business_errors_1.BusinessError.PRECONDITION_FAILED);
        return ClubSocio;
    }
    async findMembersFromClub(ClubId) {
        const Club = await this.ClubRepository.findOne({
            where: { id: ClubId },
            relations: this.relations
        });
        if (!Club)
            throw new business_errors_1.BusinessLogicException("El club con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        return Club.socios;
    }
    async updateMembersFromClub(ClubId, socios) {
        const Club = await this.ClubRepository.findOne({
            where: { id: ClubId },
            relations: this.relations
        });
        if (!Club)
            throw new business_errors_1.BusinessLogicException("El club con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        for (const socio of socios) {
            const Socio = await this.SocioRepository.findOne({ where: { id: socio.id } });
            if (!Socio)
                throw new business_errors_1.BusinessLogicException("El socio con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        }
        Club.socios = socios;
        return await this.ClubRepository.save(Club);
    }
    async deleteMemberFromClub(ClubId, SocioId) {
        const Socio = await this.SocioRepository.findOne({ where: { id: SocioId } });
        if (!Socio)
            throw new business_errors_1.BusinessLogicException("El socio con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        const Club = await this.ClubRepository.findOne({ where: { id: ClubId }, relations: this.relations });
        if (!Club)
            throw new business_errors_1.BusinessLogicException('El club con este id no fue encontrado', business_errors_1.BusinessError.NOT_FOUND);
        const ClubSocio = Club.socios.find((e) => e.id === Socio.id);
        if (!ClubSocio)
            throw new business_errors_1.BusinessLogicException('El socio con este id no esta asociado al club', business_errors_1.BusinessError.PRECONDITION_FAILED);
        Club.socios = Club.socios.filter((e) => e.id !== SocioId);
        await this.ClubRepository.save(Club);
    }
};
exports.ClubSocioService = ClubSocioService;
exports.ClubSocioService = ClubSocioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(club_entity_1.ClubEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(socio_entity_1.SocioEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ClubSocioService);
//# sourceMappingURL=club-socio.service.js.map