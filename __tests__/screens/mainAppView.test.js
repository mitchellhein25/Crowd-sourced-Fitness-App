import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import MainAppView from '../../src/screens/mainAppView';

describe('<MainAppView /> load', () => {
    jest.useFakeTimers()
    it('has 2 children', async () => {
        const tree = await renderer.create(<NavigationContainer><MainAppView route={{}}/></NavigationContainer>).toJSON();
        expect(tree.children.length).toBe(2);
    });
    jest.useFakeTimers()
    it('renders correctly', async () => {
        const tree = await renderer.create(<NavigationContainer><MainAppView route={{}}/></NavigationContainer>).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});