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

describe('controller.task', function() {
    let mochaSession;
    describe('Testing Tasks', function() {
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
        const taskId = input.taskId;
        const userStoryId = input.userStoryId;
        it('/GET /project/projectId + tasks routes', function(done) {
            request.get('/project/' + projectId)
            .set('Cookie', mochaSession)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.text).to.nested.include('/project/'+projectId+'/createTask');
                expect(res.text).to.nested.include('/modifyTask/'+taskId);
                expect(res.text).to.nested.include('/deleteTask/'+taskId);
                expect(res.text).to.nested.include('/linkTask/'+taskId);
                done();
            });
        });
        it('/GET /project/projectId/modifyTask/taskId', function(done) {
            request.get('/project/'+projectId+'/modifyTask/'+taskId)
            .set('Cookie', mochaSession)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.text).to.nested.include('<option>Mocha@auto.com</option>');
                expect(res.text).to.nested.include('min=\"1\" max=\"3\" value=\"1\"');
                expect(res.text).to.nested.include('première tâche</textarea>');
                done();
            });
        });
        it('/GET /project/projectId/linkTask/taskId', function(done) {
            request.get('/project/'+projectId+'/linkTask/'+taskId)
            .set('Cookie', mochaSession)
            .end((err, res) => {
                expect(res.text).to.nested.include('first orphan us of mocha');
                expect(res.text).to.nested.include(userStoryId);
                done();
            });
        });
    });
});
