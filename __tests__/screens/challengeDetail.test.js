import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import ChallengeDetail from '../../src/screens/challengeDetail';

describe('<ChallengeDetail /> load', () => {
    beforeAll(() => {
        item = {
            id: 'challengeTestId',
            description: '',
            date: '',
            type: 'RUNNING',
            goals: [],
            tags: [''],
            badges: ['BBStrength']
        }

        userId = 'testId'

        route = {
            params: {
                challenge: item,
                userId: userId
            }
        }
    });
    
    it('has 6 children', () => {
        const tree = renderer.create(<ChallengeDetail route={route} />).toJSON();
        expect(tree.children.length).toBe(6);
    });

    it('renders correctly', async () => {
        const tree = renderer.create(<ChallengeDetail route={route} />).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});

