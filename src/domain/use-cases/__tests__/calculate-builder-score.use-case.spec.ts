/**
 * CalculateBuilderScoreUseCase Tests
 */

import { CalculateBuilderScoreUseCase } from '../calculate-builder-score.use-case';

describe('CalculateBuilderScoreUseCase', () => {
  let useCase: CalculateBuilderScoreUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findByGithubUsername: jest.fn(),
      save: jest.fn(),
    };
    useCase = new CalculateBuilderScoreUseCase(mockRepository);
  });

  it('should calculate builder score', async () => {
    const mockBuilder = {
      id: '1',
      githubUsername: 'testuser',
      updateScore: jest.fn(),
    };
    mockRepository.findByGithubUsername.mockResolvedValue(mockBuilder);

    await useCase.execute({
      builderId: '1',
      metrics: {
        githubContributions: 500,
        talentProtocolScore: 85,
      },
    });

    expect(mockBuilder.updateScore).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(mockBuilder);
  });

  it('should throw error if builder not found', async () => {
    mockRepository.findByGithubUsername.mockResolvedValue(null);

    await expect(
      useCase.execute({ builderId: '1', metrics: {} })
    ).rejects.toThrow();
  });
});

