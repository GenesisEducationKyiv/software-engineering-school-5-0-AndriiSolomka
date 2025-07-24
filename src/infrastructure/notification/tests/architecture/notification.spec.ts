import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Notification Module Architecture Compliance', () => {
  it('core does not depend on infrastructure, interface, or tests', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/notification/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/notification/infrastructure')
      .inFolder('src/infrastructure/notification/interface')
      .inFolder('src/infrastructure/notification/tests');

    return expect(rule).toPassAsync();
  });

  it('infrastructure does not depend on interface or tests', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/notification/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/notification/interface')
      .inFolder('src/infrastructure/notification/tests');

    return expect(rule).toPassAsync();
  });

  it('interface depends only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/notification/interface')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/notification/tests');

    return expect(rule).toPassAsync();
  });

  it('tests do not depend on other layers', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/notification/tests')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/notification/core')
      .inFolder('src/infrastructure/notification/infrastructure')
      .inFolder('src/infrastructure/notification/interface');

    return expect(rule).toPassAsync();
  });
  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('src/infrastructure/notification/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('src/infrastructure/notification/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfaceCycleFree = filesOfProject()
      .inFolder('src/infrastructure/notification/interface')
      .should()
      .beFreeOfCycles();
    const testsCycleFree = filesOfProject()
      .inFolder('src/infrastructure/notification/tests')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfaceCycleFree).toPassAsync();
    expect(testsCycleFree).toPassAsync();
  });
});
