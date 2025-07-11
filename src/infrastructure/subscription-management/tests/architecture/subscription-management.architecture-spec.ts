import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Subscription Management Module Architecture Compliance', () => {
  it('core does not depend on infrastructure, interface, or tests', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/subscription-management/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/subscription-management/infrastructure')
      .inFolder('src/infrastructure/subscription-management/interface')
      .inFolder('src/infrastructure/subscription-management/tests');

    return expect(rule).toPassAsync();
  });

  it('infrastructure does not depend on interface or tests', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/subscription-management/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/subscription-management/interface')
      .inFolder('src/infrastructure/subscription-management/tests');

    return expect(rule).toPassAsync();
  });

  it('interface depends only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/subscription-management/interface')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/subscription-management/tests');

    return expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('src/infrastructure/subscription-management/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('src/infrastructure/subscription-management/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfaceCycleFree = filesOfProject()
      .inFolder('src/infrastructure/subscription-management/interface')
      .should()
      .beFreeOfCycles();
    const testsCycleFree = filesOfProject()
      .inFolder('src/infrastructure/subscription-management/tests')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfaceCycleFree).toPassAsync();
    expect(testsCycleFree).toPassAsync();
  });
});
