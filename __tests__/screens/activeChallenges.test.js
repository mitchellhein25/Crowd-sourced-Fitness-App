import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import ActiveChallenges from '../../src/screens/activeChallenges';

describe('<ActiveChallenges /> load', () => {
    it('has 2 children', () => {
        const tree = renderer.create(
            <NavigationContainer>
                <ActiveChallenges />
            </NavigationContainer>
        ).toJSON();
        expect(tree.children.length).toBe(2);
    });

    it('renders correctly', async () => {
        const tree = renderer.create(
            <NavigationContainer>
                <ActiveChallenges />
            </NavigationContainer>
        ).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});