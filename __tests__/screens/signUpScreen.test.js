import React from 'react';
import renderer, { act } from 'react-test-renderer';

import SignUpScreen from '../../src/screens/signUpScreen';

describe('<SignUpScreen /> load', () => {
    it('has 2 children', () => {
        const tree = renderer.create(<SignUpScreen />).toJSON();
        expect(tree.children.length).toBe(2);
    });

    it('renders correctly', async () => {
        const tree = renderer.create(<SignUpScreen />).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});