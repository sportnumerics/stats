'use strict';

const sinon = require('sinon');
const service = require('../../lib/service/teams');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/teams');
const fixtures = require('../fixtures');

describe('teams-controller', () => {
  describe('collect', () => {
    let serviceMock;

    beforeEach(() => {
      serviceMock = sinon.mock(service)
        .expects('getHtmlFromNcaa')
        .withArgs('2016', '1')
        .returns(Promise.resolve(fixtures.teamList));
    });

    afterEach(() => {
      service.getHtmlFromNcaa.restore();
    });

    it('should get teams from service and write to persistent store', () => {
      return controller.collect('2016', '1')
        .then(result => {
          expect(result).to.deep.equal(fixtures.expectedTeamsJson.teams);

          serviceMock.verify();
        });
    });
  });
});
