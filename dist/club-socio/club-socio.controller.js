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
exports.ClubSocioController = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const business_errors_interceptor_1 = require("../shared/interceptors/business-errors/business-errors-interceptor");
const club_socio_service_1 = require("./club-socio.service");
const socio_entity_1 = require("../socio/socio.entity");
let ClubSocioController = class ClubSocioController {
    constructor(clubSocioService) {
        this.clubSocioService = clubSocioService;
    }
    async addMemberToClub(clubId, socioId) {
        return await this.clubSocioService.addMemberToClub(clubId, socioId);
    }
    async findMemberFromClub(clubId, socioId) {
        return await this.clubSocioService.findMemberFromClub(clubId, socioId);
    }
    async findMembersFromClub(clubId) {
        return await this.clubSocioService.findMembersFromClub(clubId);
    }
    async updateMembersFromClub(sociosDto, clubId) {
        const socios = (0, class_transformer_1.plainToInstance)(socio_entity_1.SocioEntity, sociosDto);
        return await this.clubSocioService.updateMembersFromClub(clubId, socios);
    }
    async deleteMemberFromClub(clubId, socioId) {
        return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
    }
};
exports.ClubSocioController = ClubSocioController;
__decorate([
    (0, common_1.Post)(':clubId/members/:socioId'),
    __param(0, (0, common_1.Param)('clubId')),
    __param(1, (0, common_1.Param)('socioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClubSocioController.prototype, "addMemberToClub", null);
__decorate([
    (0, common_1.Get)(':clubId/members/:socioId'),
    __param(0, (0, common_1.Param)('clubId')),
    __param(1, (0, common_1.Param)('socioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClubSocioController.prototype, "findMemberFromClub", null);
__decorate([
    (0, common_1.Get)(':clubId/members'),
    __param(0, (0, common_1.Param)('clubId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClubSocioController.prototype, "findMembersFromClub", null);
__decorate([
    (0, common_1.Put)(':clubId/members'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('clubId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], ClubSocioController.prototype, "updateMembersFromClub", null);
__decorate([
    (0, common_1.Delete)(':clubId/members/:socioId'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('clubId')),
    __param(1, (0, common_1.Param)('socioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClubSocioController.prototype, "deleteMemberFromClub", null);
exports.ClubSocioController = ClubSocioController = __decorate([
    (0, common_1.Controller)('clubs'),
    (0, common_1.UseInterceptors)(business_errors_interceptor_1.BusinessErrorsInterceptor),
    __metadata("design:paramtypes", [club_socio_service_1.ClubSocioService])
], ClubSocioController);
//# sourceMappingURL=club-socio.controller.js.map