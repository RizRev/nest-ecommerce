import { Test, TestingModule } from '@nestjs/testing';
import { TestControllerCliController } from './test-controller-cli.controller';

describe('TestControllerCliController', () => {
  let controller: TestControllerCliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestControllerCliController],
    }).compile();

    controller = module.get<TestControllerCliController>(TestControllerCliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
