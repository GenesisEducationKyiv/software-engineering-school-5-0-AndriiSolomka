import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Email Microservice Architecture test', () => {
  it('core does not depend on infrastructure, interface', () => {
    const rule = filesOfProject()
      .inFolder('apps/email/src/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/email/src/infrastructure')
      .inFolder('apps/email/src/interface');

    return expect(rule).toPassAsync();
  });

  it('infrastructure depends only on core', () => {
    const rule = filesOfProject()
      .inFolder('apps/email/src/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/email/src/interface');

    return expect(rule).toPassAsync();
  });

  it('interface depends only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('apps/email/src/interface')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/email/src/config');

    return expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('apps/email/src/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('apps/email/src/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfaceCycleFree = filesOfProject()
      .inFolder('apps/email/src/interface')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfaceCycleFree).toPassAsync();
  });
});
