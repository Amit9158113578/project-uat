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
exports.AppVariables = void 0;
const inversify_1 = require("inversify");
const aws_sdk_1 = require("aws-sdk");
const baseIdentifiers_1 = require("./baseIdentifiers");
/**

 * @description Application config variables

 */
let AppVariables = class AppVariables {
    get emailConfiguration() {
        return this.emailConfig;
    }
    get stripeConfiguration() {
        return this.stripeConfig;
    }
    get googleConfiguration() {
        return this.googleConfig;
    }
    get awsConfiguration() {
        return this.awsConfig;
    }
    get zoomConfiguration() {
        return this.zoomConfig;
    }
    get appConfiguration() {
        return this.appConfig;
    }
    get dbConfiguration() {
        return this.dbConfig;
    }
    get billConfiguration() {
        return this.billConfig;
    }
    get twilioConfiguration() {
        return this.twilioConfig;
    }
    // Load configuration file from cloud location
    loadConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            const s3Client = new aws_sdk_1.S3();
            const enviroment = process.env.NODE_ENV ? process.env.NODE_ENV : 'staging';
            const filename = `${enviroment}-configuration.json`;
            this.iLoggerService.debug('loadConfiguration:: File Name - ', filename);
            const getObjectOutput = yield s3Client.getObject({
                Bucket: 'medtransgo-config',
                Key: filename,
            }).promise();
            const config = JSON.parse(getObjectOutput.Body.toString('utf8'));
            this.emailConfig = config.emailConfig;
            this.stripeConfig = config.stripeConfig;
            this.googleConfig = config.googleConfig;
            this.awsConfig = config.awsConfig;
            this.zoomConfig = config.zoomConfig;
            this.appConfig = config.appConfig;
            this.dbConfig = config.dbConfig;
            this.billConfig = config.billConfig;
            this.twilioConfig = config.twilioConfig;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], AppVariables.prototype, "iLoggerService", void 0);
AppVariables = __decorate([
    (0, inversify_1.injectable)()
], AppVariables);
exports.AppVariables = AppVariables;
