const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const server = require('../app.js');
const supertest = require('supertest');

const mochaCredentials = {
    'email': "Mocha@auto.com",
    'password': "abcdef1"
};

process.env.NODE_ENV = 'test';

chai.use(chaiHTTP);

const request = supertest.agent(server);


describe('controller.userStory', function() {
    let mochaSession;

    describe('Testing User Stories', function() {
        it('/POST /users/login', function(done) {
            request.post('/users/login')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(mochaCredentials)
            .end((err, res) => {
                let cookies = res.header['set-cookie'];
                mochaSession = cookies[0].split(";")[0];
                expect(res).to.have.status(302);
                res.should.have.status(302);
                done();
            });
        });
        it('/GET /Projects', function(done) {
            request.get('/Projects')
            .set('Cookie', mochaSession)
            .set('Content-Type', 'text/plain')
            .end((err, res) => {
                expect(res.text)
                .to.nested.include("<a href=\"/project/5ddb77acb460163788345e83\" id=\"projectPageLink\">projet1</a></td>");
                done();
            });
        });
        it('/GET /project/projectId', function(done) {
            request.get('/project/5ddb77acb460163788345e83')
            .set('Cookie', mochaSession)
            .end((err, res) => {
                expect(res.text)
                .to.nested.include('<a href=\"/project/5ddb77acb460163788345e83/editUserStory/5ddb77e3b460163788345e85\" class=\"modifyUserstory\">');
                done();
            });
        });
        it('/GET /project/projectId/editUserStory/userStoryId', function(done) {
            request.get('/project/5ddb77acb460163788345e83/editUserStory/5ddb77e3b460163788345e85')
            .set('Cookie', mochaSession)
            .end((err, res) => {
                expect(res.text)
                .to.nested.include('<input type=\"hidden\" name=\"userStory\" value=\"{&#34;_id&#34;:&#34;5ddb77e3b460163788345e85&#34;,&#34;projectId&#34;:&#34;5ddb77acb460163788345e83&#34;,&#34;description&#34;:&#34;Première user Story&#34;,&#34;difficulty&#34;:1,&#34;priority&#34;:1,&#34;isOrphan&#34;:false,&#34;__v&#34;:0,&#34;sprintId&#34;:&#34;5ddb7801b460163788345e86&#34;}\">');
                done();
            });
        });
    });
});
