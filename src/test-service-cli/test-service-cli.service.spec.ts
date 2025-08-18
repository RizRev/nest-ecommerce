import { Test, TestingModule } from '@nestjs/testing';
import { TestServiceCliService } from './test-service-cli.service';

describe('TestServiceCliService', () => {
  let service: TestServiceCliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestServiceCliService],
    }).compile();

    service = module.get<TestServiceCliService>(TestServiceCliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
