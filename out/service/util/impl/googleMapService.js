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
exports.GoogleMapService = void 0;
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const appVariables_1 = require("../../../config/appVariables");
const serviceException_1 = require("../../../exception/serviceException");
const errorCodes_1 = require("../../../constants/errorCodes");
/**

 * @description Google Map service implementation

 */
let GoogleMapService = class GoogleMapService {
    /**

     * @description gets distance between origin and destination
     * @param getDistanceRequest {GetDistanceRequest} - GetDistanceRequest object
     * @returns GetDistanceResponse
     * @throws ServiceException if failed to get distance
     */
    getDistance(getDistanceRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.debug('GoogleMapService:getDistance- Request to find distance', JSON.stringify(getDistanceRequest));
                const googleClient = this.getGoogleClient();
                const response = [];
                const distanceResponse = yield googleClient.distancematrix({
                    params: {
                        destinations: getDistanceRequest.destinations,
                        key: this.appVariables.googleConfiguration.apiKey,
                        origins: getDistanceRequest.origins,
                        units: 'imperial',
                    }
                });
                if (distanceResponse.data.status === 'OK') {
                    distanceResponse.data.rows.forEach(row => {
                        row.elements.forEach(result => {
                            response.push(result);
                        });
                    });
                }
                else {
                    throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_GOOGLE_FAILED_FIND_DISTANCE, 500);
                }
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getGoogleClient() {
        const client = new google_maps_services_js_1.Client({});
        return client;
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], GoogleMapService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.AppVariables),
    __metadata("design:type", appVariables_1.AppVariables)
], GoogleMapService.prototype, "appVariables", void 0);
GoogleMapService = __decorate([
    (0, inversify_1.injectable)()
], GoogleMapService);
exports.GoogleMapService = GoogleMapService;
