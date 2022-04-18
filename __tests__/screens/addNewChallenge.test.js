import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import AddNewChallenge from '../../src/screens/AddNewChallenge';

describe('<AddNewChallenge /> load', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<NavigationContainer><AddNewChallenge /></NavigationContainer>).toJSON();
        expect(tree.children.length).toBe(2);
    });

    it('renders correctly', async () => {
        const tree = renderer.create(<NavigationContainer><AddNewChallenge /></NavigationContainer>).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});

