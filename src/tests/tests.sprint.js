const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const server = require('../app.js');
const supertest = require('supertest');
const input = require('./input');
const request = supertest.agent(server);
const mochaCredentials = input.mochaCredentials;

chai.use(chaiHTTP);
process.env.NODE_ENV = 'test';

describe('controller.sprint', function() {
    let mochaSession;
    describe('Testing Sprints', function() {
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
        const sprintId = input.sprintId;
        it('/GET /project/projectId + sprint routes', function(done) {
            request.get('/project/' + projectId)
            .set('Cookie', mochaSession)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.text).to.nested.include('/modifySprint/'+sprintId);
                expect(res.text).to.nested.include('/deleteSprint/'+sprintId);
                done();
            });
        });
        it('/GET /project/projectId/modifySprint/sprintId', function(done) {
            request.get('/project/'+projectId+'/modifySprint/'+sprintId)
            .set('Cookie', mochaSession)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.text).to.nested.include('value=\"sprint1\"');
                done();
            });
        });
    });
});
