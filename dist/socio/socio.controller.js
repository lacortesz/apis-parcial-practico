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
exports.SocioController = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const business_errors_interceptor_1 = require("../shared/interceptors/business-errors/business-errors-interceptor");
const socio_dto_1 = require("./socio.dto");
const socio_entity_1 = require("./socio.entity");
const socio_service_1 = require("./socio.service");
let SocioController = class SocioController {
    constructor(socioService) {
        this.socioService = socioService;
    }
    async findAll() {
        return await this.socioService.findAll();
    }
    async findOne(socioId) {
        return await this.socioService.findOne(socioId);
    }
    async create(socioDto) {
        const socio = (0, class_transformer_1.plainToInstance)(socio_entity_1.SocioEntity, socioDto);
        return await this.socioService.create(socio);
    }
    async update(socioId, socioDto) {
        const socio = (0, class_transformer_1.plainToInstance)(socio_entity_1.SocioEntity, socioDto);
        return await this.socioService.update(socioId, socio);
    }
    async delete(socioId) {
        return await this.socioService.delete(socioId);
    }
};
exports.SocioController = SocioController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SocioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':socioId'),
    __param(0, (0, common_1.Param)('socioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socio_dto_1.SocioDto]),
    __metadata("design:returntype", Promise)
], SocioController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':socioId'),
    __param(0, (0, common_1.Param)('socioId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socio_dto_1.SocioDto]),
    __metadata("design:returntype", Promise)
], SocioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':socioId'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('socioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocioController.prototype, "delete", null);
exports.SocioController = SocioController = __decorate([
    (0, common_1.Controller)('members'),
    (0, common_1.UseInterceptors)(business_errors_interceptor_1.BusinessErrorsInterceptor),
    __metadata("design:paramtypes", [socio_service_1.SocioService])
], SocioController);
//# sourceMappingURL=socio.controller.js.map