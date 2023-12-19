"use strict";
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
exports.CommonUtils = void 0;
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const crypto = require("crypto");
const ejs = require("ejs");
const path = require("path");
const mask = require("json-mask");
const path_to_regexp_1 = require("path-to-regexp");
const axios_1 = require("axios");
const commonConstants_1 = require("../constants/commonConstants");
const https = require("https");
/**

 * @description Common util functions

 */
class CommonUtils {
    /**

     * @description checks if array is empty
     * @param array {string} - array to be validated
     * @returns boolean - true if array is empty
     */
    static isEmpty(array) {
        return (!array || array.length === 0);
    }
    /**

     * @description checks if response is success
     * @param array {Resonse} - response to be validated
     * @returns boolean - true if response is success and data is not empty
     */
    static isSuccess(response) {
        return (response.success && response.data);
    }
    /**
 * @description Saves a file in a directory based on the project name
 * @param {string} fileName - name of the file to be saved
 * @param {string} fileContent - content of the file to be saved
 * @param {string} projectName - name of the project
 * @returns {string} - file path where the file is saved
 */
    static saveFile(fileName, fileContent, projectName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modifiedProjectName = projectName.replace(/\s+/g, '').toLowerCase();
                const projectDirectory = path.join(commonConstants_1.CommonConstants.DIRNAME, modifiedProjectName);
                if (!fs.existsSync(projectDirectory)) {
                    fs.mkdirSync(projectDirectory);
                }
                const filePath = path.join(projectDirectory, fileName);
                fs.writeFileSync(filePath, fileContent);
                return filePath;
            }
            catch (error) {
                // Handle the error here
                console.error('An error occurred while saving the file:', error);
                return null; // or any other appropriate value indicating failure
            }
        });
    }
    /**
    * @description Retrieves a file from a directory based on the file path
    * @param {string} filePath - path of the file to be retrieved
    * @returns {string | null} - file content if the file exists, null otherwise
    */
    static getFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (fs.existsSync(filePath)) {
                    const fileContent = yield fs.promises.readFile(filePath);
                    return fileContent;
                }
                else {
                    console.log('File does not exist:', filePath);
                    return null;
                }
            }
            catch (error) {
                console.error('An error occurred while retrieving the file:', error);
                return null;
            }
        });
    }
    static callApi(endpoint, method, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'api-key': 'Comsense@007'
                };
                const agent = new https.Agent({
                    rejectUnauthorized: false,
                });
                let response;
                if (method.toUpperCase() === 'GET') {
                    response = yield axios_1.default.get(endpoint, { headers, httpsAgent: agent });
                }
                else if (method.toUpperCase() === 'POST') {
                    response = yield axios_1.default.post(endpoint, body, { headers, httpsAgent: agent });
                }
                else {
                    throw new Error('Invalid HTTP method');
                }
                return response;
            }
            catch (error) {
                console.error('callApi error:', error);
                throw error;
            }
        });
    }
    /**

     * @description checks if req.path is a public route
     * @param req {Resonse} - express request object
     * @param publicRoutes {Array<string>} - configured public routes
     * @returns boolean - true if req.path is a public route
     */
    static isPublicRoute(req, publicRoutes) {
        if (!CommonUtils.isEmpty(publicRoutes)) {
            for (const publicRoute of publicRoutes) {
                if (CommonUtils.matchRouteWithPattern(req.path, publicRoute)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**

     * @description checks route with provide pattern
     * @param route {string} - route
     * @param pattern {string} - pattern to be matched with route
     * @returns boolean - true if route is matched with pattern
     */
    static matchRouteWithPattern(route, pattern) {
        let isMatch = false;
        if (pattern.includes('*')) {
            const delimiter = '/';
            const routes = route.split(delimiter);
            const patterns = pattern.split(delimiter);
            if (routes.length < patterns.length) {
                isMatch = false;
            }
            else {
                const length = patterns.length;
                isMatch = true;
                for (let i = 0; i < length; i++) {
                    if (routes[i] !== patterns[i] && patterns[i] !== '*') {
                        isMatch = false;
                        break;
                    }
                }
            }
        }
        else {
            isMatch = route === pattern;
        }
        return isMatch;
    }
    /**

     * @description generates 32 characters long unique string
     * @returns string - unique guid
     */
    static generateUniqueID() {
        return uuidv4();
    }
    /**

     * @description generate MD5 checksum of file content
     * @param filePath {string} - Filepath of which file content would checksum generated for
     * @returns string - hash of the file in md5 base64 encoded format
     */
    static generateMD5Checksum(filePath) {
        return new Promise(function (resolve, reject) {
            if (fs.existsSync(filePath)) {
                let md5Hash = crypto.createHash('md5');
                let stream = fs.createReadStream(filePath);
                stream.on('data', function (data) {
                    md5Hash.update(data);
                });
                stream.on('end', function () {
                    let hash = md5Hash.digest('base64');
                    resolve(hash);
                });
            }
            else {
                reject('error');
            }
        });
    }
    /**

     * @description get html from ejs template
     * @param template {string} - template path
     * @param data {any} - template data
     * @returns string - HTML
     */
    static getHtmlFromTemplate(template, data, isMTGTemplate) {
        const templateName = isMTGTemplate ? 'template/mtg-template' : template;
        const templatePath = path.join(__dirname, `/../views/${templateName}.ejs`);
        const templateString = fs.readFileSync(templatePath, 'utf-8');
        if (isMTGTemplate) {
            data = {
                model: data,
                name: path.join(__dirname, `/../views/${template}.ejs`),
            };
        }
        const html = ejs.render(templateString, data);
        return html;
    }
    /**
     
     * @description generates hash of json data
     * @param data {any} - json data
     * @returns string - hashed value
     */
    static generateHash(data) {
        const stringData = JSON.stringify(data);
        return crypto.createHash('MD5').update(stringData).digest('base64');
    }
    /**

     * @description get host
     * @param request {express.request} - Express request
     * @returns string - host
     */
    static getHost(request) {
        return request.protocol + '://' + request.get('host');
    }
    /**
     
     * @description generates password
     * @returns string - random string
     */
    static generateRandomString(length) {
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
    /**

     * @description get BaseRoutePath
     * @returns {basePath,routePath}
     */
    static getBaseRoutePath(path) {
        const splitedPath = path.split('/');
        if (splitedPath.length > 3) {
            const basePath = `/${splitedPath[1]}/${splitedPath[2]}`;
            let routePath = '';
            for (let index = 3; index < splitedPath.length; index++) {
                const element = splitedPath[index];
                routePath += `/${element}`;
            }
            return { basePath, routePath };
        }
        else {
            return { basePath: path, routePath: path };
        }
    }
    /**

     * @description Mask JSON
     * @returns Masked JSON
     */
    static maskJson(json, maskRule) {
        json = mask(json, maskRule);
        return json;
    }
    /**

     * @description Match path with path pattern
     * @returns Boolean | ParsePath (false if path is not matched)
     */
    static matchPathPattern(path, pathPattern) {
        const matchPath = (0, path_to_regexp_1.match)(pathPattern);
        const result = matchPath(path);
        return result;
    }
}
exports.CommonUtils = CommonUtils;
