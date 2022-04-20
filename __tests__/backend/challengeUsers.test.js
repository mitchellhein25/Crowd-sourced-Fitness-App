import { getDatabase, ref, get, push, remove } from 'firebase/database';
import app from '../../firebase';

describe('challengeUsers table tests', () => {

    beforeEach(() => {
        db = getDatabase(app);
    });

    it('Insert into challengeUsers table', async () => {
        const testChallengeIdentifier = '-N-s9zMh-nTI2Ffnhnzm';
        const challengeUsersRef = ref(db, 'challengeUsers/');
        const key = push(challengeUsersRef, {
            userIdentifier: 'testuseridentifier',
            challengeIdentifier: testChallengeIdentifier,
        }).key;
        const challengeIdentifierRef = ref(db, `challengeUsers/${key}/challengeIdentifier`);
        await get(challengeIdentifierRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testChallengeIdentifier);
        });
        const challengeUsersDeleteRef = ref(db, `challengeUsers/${key}`);
        remove(challengeUsersDeleteRef);
    });

    it('Retrieve from challegeUsers table', async () => {
        const testChallegeUsersId = '-N07smcD2IfPXVednJDh';
        const testUserIdentifier = '-N-gWcl-XCle0sF_Zf7E';
        const userIdentifierRef = ref(db, `challengeUsers/${testChallegeUsersId}/userIdentifier`);
        await get(userIdentifierRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testUserIdentifier);
        });
    });
});