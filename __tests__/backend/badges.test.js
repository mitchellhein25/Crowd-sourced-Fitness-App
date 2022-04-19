import { getDatabase, ref, push, get, remove } from 'firebase/database';
import app from '../../firebase';

describe('Badges table tests', () => {

    beforeEach(() => {
        db = getDatabase(app);
    });

    it('Insert into Badges table', async () => {
        const testBadge = 'testbadge'
        const badgesRef = ref(db, 'badges/');
        const key = push(badgesRef, {
            description: testBadge
        }).key;
        const badgeRef = ref(db, `badges/${key}/description`);
        await get(badgeRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testBadge);
        });
        const badgeDeleteRef = ref(db, `badges/${key}`);
        remove(badgeDeleteRef);
    });

    it('Retrieve from Badge table', async () => {
        const testBadgeId = '-N-s9zMs_VZ4nk9BBq_h'
        const testBadgeDescription = 'BBStrength'
        const badgeDescriptionRef = ref(db, `badges/${testBadgeId}/description`);
        await get(badgeDescriptionRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testBadgeDescription);
        });
    });
});