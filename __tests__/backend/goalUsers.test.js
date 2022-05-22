import { getDatabase, ref, push, get, remove } from 'firebase/database';
import app from '../../firebase';

describe('goalUsers table tests', () => {

    beforeEach(() => {
        db = getDatabase(app);
    });

    it('Insert into goalUsers table', async () => {
        const testUserIdentifier = '-N-gWcl-XCle0sF_Zf7E'
        const goalUsersRef = ref(db, 'goalUsers/');
        const key = push(goalUsersRef, {
            userIdentifier: testUserIdentifier,
            goalIdentifier: '-N-vs4GS4ApaCKUnT7xT', 
            completed: false
        }).key;
        const goalUserRef = ref(db, `goalUsers/${key}/userIdentifier`);
        await get(goalUserRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testUserIdentifier);
        });
        const gURef = ref(db, `goalUsers/${key}`);
        remove(gURef);
    });

    it('Retrieve from goalUsers table', async () => {
        const testGoalUser = '-N2JIdqEMdz-uNcWTS2h'
        const testUserIdentifier = 'Summer'
        const userIdentifierRef = ref(db, `goalUsers/${testGoalUser}/userIdentifier`);
        await get(userIdentifierRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testUserIdentifier);
        });
    });
});