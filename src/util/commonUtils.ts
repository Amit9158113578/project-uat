import { Response } from '../types/reponse';
import { Request } from 'express';

import * as uuidv4 from 'uuid/v4';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as ejs from 'ejs';
import * as path from 'path';
import * as mask from 'json-mask';
import { match } from 'path-to-regexp';
import axios, { AxiosResponse } from 'axios';
import { ApiRequest } from '../types/request';
import { CommonConstants } from '../constants/commonConstants';
import * as https from 'https';


/**

 * @description Common util functions

 */
export class CommonUtils {

    /**

     * @description checks if array is empty
     * @param array {string} - array to be validated
     * @returns boolean - true if array is empty
     */
    public static isEmpty(array: Array<any>): boolean {
        return (!array || array.length === 0);
    }

    /**

     * @description checks if response is success
     * @param array {Resonse} - response to be validated
     * @returns boolean - true if response is success and data is not empty
     */
    public static isSuccess(response: Response<any>): boolean {
        return (response.success && response.data);
    }

    /**
 * @description Saves a file in a directory based on the project name
 * @param {string} fileName - name of the file to be saved
 * @param {string} fileContent - content of the file to be saved
 * @param {string} projectName - name of the project
 * @returns {string} - file path where the file is saved
 */
    public static async saveFile(fileName, fileContent, projectName): Promise<string> {
        try {
            const modifiedProjectName = projectName.replace(/\s+/g, '').toLowerCase();
            const projectDirectory = path.join(CommonConstants.DIRNAME, modifiedProjectName);
            if (!fs.existsSync(projectDirectory)) {
                fs.mkdirSync(projectDirectory);
            }
            const filePath = path.join(projectDirectory, fileName);
            fs.writeFileSync(filePath, fileContent);

            return filePath;
        } catch (error) {
            // Handle the error here
            console.error('An error occurred while saving the file:', error);
            return null; // or any other appropriate value indicating failure
        }
    }

    /**
    * @description Retrieves a file from a directory based on the file path
    * @param {string} filePath - path of the file to be retrieved
    * @returns {string | null} - file content if the file exists, null otherwise
    */
    public static async getFile(filePath: string): Promise<Buffer> {
        try {
            if (fs.existsSync(filePath)) {
                const fileContent = await fs.promises.readFile(filePath);
                return fileContent;
            } else {
                console.log('File does not exist:', filePath);
                return null;
            }
        } catch (error) {
            console.error('An error occurred while retrieving the file:', error);
            return null;
        }
    }


    public static async callApi(endpoint: string, method: string, body: ApiRequest): Promise<AxiosResponse> {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'api-key': 'Comsense@007'
            };
            const agent = new https.Agent({
                rejectUnauthorized: false,
            });
            let response: AxiosResponse;
            if (method.toUpperCase() === 'GET') {
                response = await axios.get(endpoint, { headers, httpsAgent: agent });
            } else if (method.toUpperCase() === 'POST') {
                response = await axios.post(endpoint, body, { headers, httpsAgent: agent });
            } else {
                throw new Error('Invalid HTTP method');
            }
            return response;
        } catch (error) {
            console.error('callApi error:', error);
            throw error;
        }
    }

    /**

     * @description checks if req.path is a public route
     * @param req {Resonse} - express request object
     * @param publicRoutes {Array<string>} - configured public routes
     * @returns boolean - true if req.path is a public route
     */
    public static isPublicRoute(req: Request, publicRoutes: string[]): boolean {
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
    private static matchRouteWithPattern(route: string, pattern: string): boolean {
        let isMatch = false;
        if (pattern.includes('*')) {
            const delimiter = '/';
            const routes = route.split(delimiter);
            const patterns = pattern.split(delimiter);
            if (routes.length < patterns.length) {
                isMatch = false;
            } else {
                const length = patterns.length;
                isMatch = true;
                for (let i = 0; i < length; i++) {
                    if (routes[i] !== patterns[i] && patterns[i] !== '*') {
                        isMatch = false;
                        break;
                    }
                }
            }
        } else {
            isMatch = route === pattern;
        }

        return isMatch;
    }

    /**

     * @description generates 32 characters long unique string
     * @returns string - unique guid
     */
    public static generateUniqueID(): string {
        return uuidv4();
    }

    /**

     * @description generate MD5 checksum of file content
     * @param filePath {string} - Filepath of which file content would checksum generated for
     * @returns string - hash of the file in md5 base64 encoded format
     */
    public static generateMD5Checksum(filePath: string): Promise<string> {
        return new Promise<string>(function (resolve, reject) {
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

            } else {
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
    public static getHtmlFromTemplate(template: string, data: any, isMTGTemplate?: boolean): string {
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
    public static generateHash(data: any): string {
        const stringData = JSON.stringify(data);
        return crypto.createHash('MD5').update(stringData).digest('base64');
    }

    /**

     * @description get host
     * @param request {express.request} - Express request
     * @returns string - host
     */
    public static getHost(request: Request): string {
        return request.protocol + '://' + request.get('host');
    }

    /**
     
     * @description generates password
     * @returns string - random string
     */
    public static generateRandomString(length: number): string {
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
    public static getBaseRoutePath(path: string): { basePath: string, routePath: string } {
        const splitedPath = path.split('/');
        if (splitedPath.length > 3) {
            const basePath = `/${splitedPath[1]}/${splitedPath[2]}`;
            let routePath = '';
            for (let index = 3; index < splitedPath.length; index++) {
                const element = splitedPath[index];
                routePath += `/${element}`;
            }
            return { basePath, routePath };
        } else {
            return { basePath: path, routePath: path };
        }
    }

    /**

     * @description Mask JSON
     * @returns Masked JSON
     */
    public static maskJson(json: any, maskRule: string): any {
        json = mask(json, maskRule);
        return json;
    }

    /**

     * @description Match path with path pattern
     * @returns Boolean | ParsePath (false if path is not matched)
     */
    public static matchPathPattern(path: string, pathPattern: string): any {
        const matchPath = match(pathPattern);
        const result = matchPath(path);
        return result;
    }
}
