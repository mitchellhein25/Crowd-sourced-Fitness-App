import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import ChallengeSearch from '../../src/screens/challengeSearch';

describe('<ChallengeSearch /> load', () => {
    it('has 1 child', () => {
        const tree = renderer.create(
            <NavigationContainer>
                <ChallengeSearch />
            </NavigationContainer>
        ).toJSON();
        expect(tree.children.length).toBe(3);
    });

    it('renders correctly', async () => {
        const tree = renderer.create(
            <NavigationContainer>
                <ChallengeSearch />
            </NavigationContainer>
        ).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});