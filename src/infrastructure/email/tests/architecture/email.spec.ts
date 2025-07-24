import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Email Module Layered Architecture Compliance', () => {
  it('core does not depend on infrastructure, interface, or config', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/email/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/email/infrastructure')
      .inFolder('src/infrastructure/email/interface')
      .inFolder('src/infrastructure/email/config');

    return expect(rule).toPassAsync();
  });

  it('infrastructure does not depend on interface', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/email/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/email/interface');

    return expect(rule).toPassAsync();
  });

  it('interface depends only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/email/interface')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/email/config');

    return expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('src/infrastructure/email/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('src/infrastructure/email/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfaceCycleFree = filesOfProject()
      .inFolder('src/infrastructure/email/interface')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfaceCycleFree).toPassAsync();
  });
});
