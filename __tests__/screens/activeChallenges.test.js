import React from 'react';
import renderer, { act } from 'react-test-renderer';

import ActiveChallenges from '../../src/screens/activeChallenges';

describe('<ActiveChallenges /> load', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<ActiveChallenges />).toJSON();
        expect(tree.children.length).toBe(1);
    });

    it('renders correctly', async () => {
        const tree = renderer.create(<ActiveChallenges />).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});