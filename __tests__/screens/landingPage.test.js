import React from 'react';
import renderer, { act } from 'react-test-renderer';

import LandingPage from '../../src/screens/landingPage';

describe('<LandingPage /> load', () => {
    it('has 3 children', () => {
        const tree = renderer.create(<LandingPage />).toJSON();
        expect(tree.children.length).toBe(3);
    });

    it('renders correctly', async () => {
        const tree = renderer.create(<LandingPage />).toJSON();
        await act(async () => { expect(tree).toMatchSnapshot(); })
    });
});