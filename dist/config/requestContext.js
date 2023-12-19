"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const inversify_1 = require("inversify");
const httpContext = require("express-http-context");
const commonConstants_1 = require("../constants/commonConstants");
/**

 * @description HTTP request context

 */
let RequestContext = class RequestContext {
    setHeaders(headers) {
        return httpContext.set('headers', headers);
    }
    getHeaders() {
        return httpContext.get('headers');
    }
    setRequest(request) {
        return httpContext.set('request', request);
    }
    setResponse(response) {
        return httpContext.set('response', response);
    }
    getResponse() {
        return httpContext.get('response');
    }
    getRequest() {
        return httpContext.get('request');
    }
    getSessionInfo() {
        return httpContext.get('request')[commonConstants_1.CommonConstants.SESSION_INFO_NAME];
    }
};
RequestContext = __decorate([
    (0, inversify_1.injectable)()
], RequestContext);
exports.RequestContext = RequestContext;
