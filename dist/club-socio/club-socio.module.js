"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocioClubModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const club_socio_service_1 = require("./club-socio.service");
const club_socio_controller_1 = require("./club-socio.controller");
const socio_service_1 = require("../socio/socio.service");
const club_entity_1 = require("../club/club.entity");
const socio_entity_1 = require("../socio/socio.entity");
let SocioClubModule = class SocioClubModule {
};
exports.SocioClubModule = SocioClubModule;
exports.SocioClubModule = SocioClubModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([socio_entity_1.SocioEntity, club_entity_1.ClubEntity])],
        providers: [socio_service_1.SocioService, club_socio_service_1.ClubSocioService],
        controllers: [club_socio_controller_1.ClubSocioController]
    })
], SocioClubModule);
//# sourceMappingURL=club-socio.module.js.map