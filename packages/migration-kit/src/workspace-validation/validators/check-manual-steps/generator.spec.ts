import { checkManualStepsGenerator } from './generator';

describe('check-manual-steps generator', () => {
    it('should run successfully', async () => {
        const data = await checkManualStepsGenerator();
        expect(data).toBeDefined();
    });
});
