import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Notification Microservice Architecture test', () => {
  it('core does not depend on infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('apps/notification/src/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/notification/src/infrastructure');

    return expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('apps/subscription/src/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('apps/notification/src/infrastructure')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
  });
});
