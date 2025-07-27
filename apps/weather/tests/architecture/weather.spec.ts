import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Weather Microservice Architecture test', () => {
  it('core does not depend on infrastructure or interfaces', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather/src/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather/src/infrastructure')
      .inFolder('apps/weather/src/interfaces');

    return expect(rule).toPassAsync();
  });

  it('infrastructure does not depend on interfaces', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather/src/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather/src/interfaces');

    return expect(rule).toPassAsync();
  });

  it('interfaces depend only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather/src/interfaces')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather/src/types');

    return expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('apps/weather/src/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('apps/weather/src/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfacesCycleFree = filesOfProject()
      .inFolder('apps/weather/src/interfaces')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfacesCycleFree).toPassAsync();
  });
});
