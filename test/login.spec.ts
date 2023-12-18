import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as express from 'express';
import 'mocha';
import { TestConstants } from './testConstants';
import { URLConstants } from '../src/constants/urlConstants';
import { ErrorCodes } from '../src/constants/errorCodes';
import { LoginRequest } from '../src/types/request';

chai.use(chaiHttp);
let app: express.Application;

before(async function () {
    app = await TestConstants.getApp();
});


describe('Login Test cases', () => {
    it('should reject as unauthorized Request', () => {
        return chai.request(app).get('/namespace')
            .then(res => {
                chai.expect(res.status).to.eql(401);
            });
    });

    it('should reject as BAD request (clientID missing)', () => {
        return chai.request(app).get(URLConstants.URL_AUTH_LOGIN)
            .then(res => {
                chai.expect(res.body.success).to.eql(false);
                chai.expect(res.body.errorCode).to.eql(ErrorCodes.ERR_API_INVALID_REQUEST);
                chai.expect(res.status).to.eql(400);
            });
    });

    it('should reject as BAD request (Invalid clientID)', () => {
        return chai.request(app).get(URLConstants.URL_AUTH_LOGIN + '?clientId=Invalid_Client_ID')
            .then(res => {
                chai.expect(res.body.success).to.eql(false);
                chai.expect(res.body.errorCode).to.eql(ErrorCodes.ERR_DB_READ_EXCEPTION);
                chai.expect(res.status).to.eql(500);
            });
    });

    it('should return login HTML)', () => {
        return chai.request(app).get(URLConstants.URL_AUTH_LOGIN + '?clientId=' + TestConstants.CLIENT_ID)
            .then(res => {
                chai.expect(res.header['content-type']).to.eql('text/html; charset=utf-8');
                chai.expect(res.status).to.eql(200);
            });
    });

    it('should reject login request. (ClientID missing)', () => {
        return chai.request(app).post(URLConstants.URL_AUTH_LOGIN)
            .then(res => {
                chai.expect(res.body.success).to.eql(false);
                chai.expect(res.body.errorCode).to.eql(ErrorCodes.ERR_API_INVALID_REQUEST);
                chai.expect(res.status).to.eql(400);
            });
    });

    it('should reject login request. (Invalid login request)', () => {
        return chai.request(app).post(URLConstants.URL_AUTH_LOGIN)
            .field('clientId', TestConstants.CLIENT_ID)
            .field('', '')
            .field('', '')
            .then(res => {
                chai.expect(res.body.success).to.eql(false);
                chai.expect(res.body.errorCode).to.eql(ErrorCodes.ERR_API_INVALID_REQUEST);
                chai.expect(res.status).to.eql(400);
            });
    });

    it('should reject login request. (Invalid username/password)', () => {
        const loginRequest: LoginRequest = {
            clientId: TestConstants.CLIENT_ID,
            password: 'Invalid',
            username: 'Invalid'
        };
        return chai.request(app).post(URLConstants.URL_AUTH_LOGIN).send(loginRequest)
            .then(res => {
                chai.expect(res.header['content-type']).to.eql('text/html; charset=utf-8');
                chai.expect(res.status).to.eql(200);
            });
    });
});
