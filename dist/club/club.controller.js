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
exports.ClubController = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const business_errors_interceptor_1 = require("../shared/interceptors/business-errors/business-errors-interceptor");
const club_dto_1 = require("./club.dto");
const club_entity_1 = require("./club.entity");
const club_service_1 = require("./club.service");
let ClubController = class ClubController {
    constructor(clubService) {
        this.clubService = clubService;
    }
    async findAll() {
        return await this.clubService.findAll();
    }
    async findOne(clubId) {
        return await this.clubService.findOne(clubId);
    }
    async create(clubDto) {
        const club = (0, class_transformer_1.plainToInstance)(club_entity_1.ClubEntity, clubDto);
        return await this.clubService.create(club);
    }
    async update(clubId, clubDto) {
        const club = (0, class_transformer_1.plainToInstance)(club_entity_1.ClubEntity, clubDto);
        return await this.clubService.update(clubId, club);
    }
    async delete(clubId) {
        return await this.clubService.delete(clubId);
    }
};
exports.ClubController = ClubController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':clubId'),
    __param(0, (0, common_1.Param)('clubId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [club_dto_1.ClubDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':clubId'),
    __param(0, (0, common_1.Param)('clubId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, club_dto_1.ClubDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':clubId'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('clubId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "delete", null);
exports.ClubController = ClubController = __decorate([
    (0, common_1.Controller)('clubes'),
    (0, common_1.UseInterceptors)(business_errors_interceptor_1.BusinessErrorsInterceptor),
    __metadata("design:paramtypes", [club_service_1.ClubService])
], ClubController);
//# sourceMappingURL=club.controller.js.map