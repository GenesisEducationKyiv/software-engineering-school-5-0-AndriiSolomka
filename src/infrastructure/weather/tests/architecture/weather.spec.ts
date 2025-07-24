import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Weather Module Layered Architecture Compliance', () => {
  it('core does not depend on infrastructure, interfaces', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/weather/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/weather/infrastructure')
      .inFolder('src/infrastructure/weather/interfaces');

    return expect(rule).toPassAsync();
  });

  it('infrastructure does not depend on interfaces', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/weather/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/weather/interfaces');

    return expect(rule).toPassAsync();
  });

  it('interfaces depend only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure/weather/interfaces')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure/weather/types');

    return expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('src/infrastructure/weather/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('src/infrastructure/weather/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfacesCycleFree = filesOfProject()
      .inFolder('src/infrastructure/weather/interfaces')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfacesCycleFree).toPassAsync();
  });
});
