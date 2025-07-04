import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Clean Architecture Compliance', () => {
  it('core does not depend on outer layers', () => {
    const rule = filesOfProject()
      .inFolder('src/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure')
      .inFolder('src/interface')
      .inFolder('src/application')
      .inFolder('src/use-cases');

    return expect(rule).toPassAsync();
  });

  it('use cases depend only on core', () => {
    const rule = filesOfProject()
      .inFolder('src/use-cases')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure')
      .inFolder('src/interface')
      .inFolder('src/application');

    return expect(rule).toPassAsync();
  });

  it('infrastructure depends only on core and use-cases', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/interface')
      .inFolder('src/application');

    expect(rule).toPassAsync();
  });

  it('interface depends only on core and use-cases', () => {
    const rule = filesOfProject()
      .inFolder('src/interface')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure')
      .inFolder('src/application');

    expect(rule).toPassAsync();
  });

  it('application does not depend on interface layer', () => {
    const rule = filesOfProject()
      .inFolder('src/application')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/interface');

    expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('src/core')
      .should()
      .beFreeOfCycles();
    const useCasesCycleFree = filesOfProject()
      .inFolder('src/use-cases')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('src/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfaceCycleFree = filesOfProject()
      .inFolder('src/interface')
      .should()
      .beFreeOfCycles();
    const applicationCycleFree = filesOfProject()
      .inFolder('src/application')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(useCasesCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfaceCycleFree).toPassAsync();
    expect(applicationCycleFree).toPassAsync();
  });
});
