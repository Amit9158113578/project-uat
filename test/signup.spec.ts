import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as express from 'express';
import 'mocha';
import { TestConstants } from './testConstants';
import { URLConstants } from '../src/constants/urlConstants';
import { ErrorCodes } from '../src/constants/errorCodes';
import { SignupRequest } from '../src/types/request';

chai.use(chaiHttp);
let app: express.Application;

before(async function () {
    app = await TestConstants.getApp();
});

describe('Signup test cases', () => {
    it('should reject signup request. (Bad Request)', () => {
        return chai.request(app).post(URLConstants.URL_USER_REGISTRATION)
            .then(res => {
                chai.expect(res.body.success).to.eql(false);
                chai.expect(res.body.errorCode).to.eql(ErrorCodes.ERR_API_INVALID_REQUEST);
                chai.expect(res.status).to.eql(400);
            });
    });

    it('should reject signup request. (Bad Request - fullname null)', () => {
        const signupRequest: SignupRequest = {
            clientId: TestConstants.CLIENT_ID,
            email: '',
            fullName: '',
            password: '',
            phone: ''
        };
        return chai.request(app).post(URLConstants.URL_USER_REGISTRATION).send(signupRequest)
            .then(res => {
                console.log(res.body);
                chai.expect(res.body.success).to.eql(false);
                chai.expect(res.body.errorCode).to.eql(ErrorCodes.ERR_API_INVALID_REQUEST);
                chai.expect(res.status).to.eql(400);
            });
    });

});
