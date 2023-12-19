"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosHttpService = void 0;
const axios_1 = require("axios");
const inversify_1 = require("inversify");
/**

 * @description Axios HTTP service implementation

 */
let AxiosHttpService = class AxiosHttpService {
    post(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.method = 'POST';
            return this.executeHttpCall(request);
        });
    }
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.method = 'GET';
            return this.executeHttpCall(request);
        });
    }
    put(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.method = 'PUT';
            return this.executeHttpCall(request);
        });
    }
    delete(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.method = 'DELETE';
            return this.executeHttpCall(request);
        });
    }
    executeHttpCall(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.request(request);
            return response;
        });
    }
};
AxiosHttpService = __decorate([
    (0, inversify_1.injectable)()
], AxiosHttpService);
exports.AxiosHttpService = AxiosHttpService;
