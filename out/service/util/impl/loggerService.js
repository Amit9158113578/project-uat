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
exports.LoggerService = void 0;
const inversify_1 = require("inversify");
const bunyan = require("bunyan");
const commonConstants_1 = require("../../../constants/commonConstants");
const commonUtils_1 = require("../../../util/commonUtils");
/**

 * @description Logger service implementation

 */
let LoggerService = class LoggerService {
    // constructor() {
    //     this.logger = bunyan.createLogger({
    //         name: CommonConstants.APP_NAME,
    //         level: 'debug',
    //         streams: [
    //             {
    //                 type: 'file',
    //                 path: 'D:/MTG/log/file.log', // Specify the desired file path here
    //                 level: 'debug'
    //             }
    //         ]
    //     });
    // }
    constructor() {
        this.logger = bunyan.createLogger({ name: commonConstants_1.CommonConstants.APP_NAME, level: 'debug' });
    }
    log(message, ...optionalParams) {
        this.logMessage('debug', message, optionalParams);
    }
    debug(message, ...optionalParams) {
        this.logMessage('debug', message, optionalParams);
    }
    warn(message, ...optionalParams) {
        this.logMessage('warn', message, optionalParams);
    }
    error(message, ...optionalParams) {
        this.logMessage('error', message, optionalParams);
    }
    logMessage(level, message, params) {
        if (!commonUtils_1.CommonUtils.isEmpty(params)) {
            this.logger[level](message, params);
        }
        else {
            this.logger[level](message);
        }
    }
};
LoggerService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
exports.LoggerService = LoggerService;
