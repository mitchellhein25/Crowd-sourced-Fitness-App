import { getDatabase, ref, push, get, remove } from 'firebase/database';
import app from '../../firebase';

describe('ChallengeGoals table tests', () => {

    beforeEach(() => {
        db = getDatabase(app);
    });

    it('Insert into challengeGoals table', async () => {
        const testChallengeIdentifier = '-N-s9zMh-nTI2Ffnhnzm';
        const challengeGoalsRef = ref(db, 'challengeGoals/');
        const key = push(challengeGoalsRef, {
            userIdentifier: 'testuseridentifier',
            challengeIdentifier: testChallengeIdentifier,
        }).key;
        const challengeIdentifierRef = ref(db, `challengeGoals/${key}/challengeIdentifier`);
        await get(challengeIdentifierRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testChallengeIdentifier);
        });
        const challengeGoalsDeleteRef = ref(db, `challengeGoals/${key}`);
        remove(challengeGoalsDeleteRef);
    });

    it('Retrieve from ChallengeGoals table', async () => {
        const testChallengeGoalId = '-N-s9zMoN7S0_1xcJHmr'
        const testChallengeGoalChallengeIdentifier = '-N-s9zMh-nTI2Ffnhnzm'
        const challengeGoalChallengeIdentifierdRef = ref(db, `challengeGoals/${testChallengeGoalId}/challengeIdentifier`);
        await get(challengeGoalChallengeIdentifierdRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testChallengeGoalChallengeIdentifier);
        });
    });

    it('Retrieve from ChallengeGoals table', async () => {
        const testChallengeGoalId = '-N-s9zMoN7S0_1xcJHmr'
        const testChallengeGoalGoalIdentifier = '-N-s9zMnq6D7Vlcgf1DM'
        const challengeGoalGoalIdentifierdRef = ref(db, `challengeGoals/${testChallengeGoalId}/goalsIdentifier`);
        await get(challengeGoalGoalIdentifierdRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testChallengeGoalGoalIdentifier);
        });
    });
});