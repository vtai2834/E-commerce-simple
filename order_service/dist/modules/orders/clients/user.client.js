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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClient = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
let UserClient = class UserClient {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getUser(userId) {
        const { data } = await this.httpService.get(`${process.env.USER_SERVICE_URL}/users/${userId}`).toPromise();
        return data;
    }
};
exports.UserClient = UserClient;
exports.UserClient = UserClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], UserClient);
//# sourceMappingURL=user.client.js.map