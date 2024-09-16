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
exports.ClubService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const business_errors_1 = require("../shared/errors/business-errors");
const typeorm_2 = require("typeorm");
const club_entity_1 = require("./club.entity");
let ClubService = class ClubService {
    constructor(clubRepository) {
        this.clubRepository = clubRepository;
    }
    async findAll() {
        return await this.clubRepository.find({ relations: ["socios"] });
    }
    async findOne(id) {
        const club = await this.clubRepository.findOne({ where: { id }, relations: ["socios"] });
        if (!club)
            throw new business_errors_1.BusinessLogicException("El club con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        return club;
    }
    async create(club) {
        if (club.descripcion.length > 100)
            throw new business_errors_1.BusinessLogicException("Descripcion excede longitud maxima de 100 caracteres", business_errors_1.BusinessError.BAD_REQUEST);
        return await this.clubRepository.save(club);
    }
    async update(id, club) {
        const persistedClub = await this.clubRepository.findOne({ where: { id } });
        if (!persistedClub)
            throw new business_errors_1.BusinessLogicException("El club con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        if (club.descripcion.length > 100)
            throw new business_errors_1.BusinessLogicException("Descripcion excede longitud maxima de 100 caracteres", business_errors_1.BusinessError.BAD_REQUEST);
        club.id = id;
        return await this.clubRepository.save(club);
    }
    async delete(id) {
        const club = await this.clubRepository.findOne({ where: { id } });
        if (!club)
            throw new business_errors_1.BusinessLogicException("El club con este id no fue encontrado", business_errors_1.BusinessError.NOT_FOUND);
        await this.clubRepository.remove(club);
    }
};
exports.ClubService = ClubService;
exports.ClubService = ClubService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(club_entity_1.ClubEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClubService);
//# sourceMappingURL=club.service.js.map