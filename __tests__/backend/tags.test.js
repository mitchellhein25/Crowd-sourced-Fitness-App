import { getDatabase, ref, push, get, remove } from 'firebase/database';
import app from '../../firebase';

describe('Tags table tests', () => {

    beforeEach(() => {
        db = getDatabase(app);
    });

    it('Insert into Tags table', async () => {
        const testTag = 'testtag'
        const tagsRef = ref(db, 'tags/');
        const key = push(tagsRef, {
            description: testTag
        }).key;
        const tagRef = ref(db, `tags/${key}/description`);
        await get(tagRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testTag);
        });
        const badgeDeleteRef = ref(db, `tags/${key}`);
        remove(badgeDeleteRef);
    });

    it('Retrieve from Tags table', async () => {
        const testTagId = '-N-s9zMq2Q33yj93O5vb'
        const testTagDescription = 'Summer'
        const tagDescriptionRef = ref(db, `tags/${testTagId}/description`);
        await get(tagDescriptionRef, (snapshot) => {
            const data = snapshot.val();
            expect(data).toBe(testTagDescription);
        });
    });
});