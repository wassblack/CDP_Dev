const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const server = require('../app.js');
const supertest = require('supertest');
const input = require('./input');

const mochaCredentials = input.mochaCredentials;

process.env.NODE_ENV = 'test';

chai.use(chaiHTTP);

const request = supertest.agent(server);

describe('controller.project', function() {
    let mochaSession;
    describe('Testing Projects', function() {
        it('/POST /users/login', function(done) {
            request.post('/users/login')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(mochaCredentials)
            .end((err, res) => {
                let cookies = res.header['set-cookie'];
                mochaSession = cookies[0].split(";")[0];
                res.should.have.status(302);
                done();
            });
        });
        const projectId = input.projectId;
        it('/GET /Projects', function(done) {
            request.get('/Projects')
            .set('Cookie', mochaSession)
            .set('Content-Type', 'text/plain')
            .end((err, res) => {
                expect(res.text).to.nested.include('href=\"/project/'+projectId+'\"');
                done();
            });
        });
        it('/GET /project/projectId', function(done) {
            request.get('/project/' + projectId)
            .set('Cookie', mochaSession)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });
});
