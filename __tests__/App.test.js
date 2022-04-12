import React from 'react';
import renderer, { act } from 'react-test-renderer';

import App from '../App.js';
describe('<App /> load', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree.children.length).toBe(1);
    });
    it('renders correctly', async() => {
        const tree = renderer.create(<App />).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })    });
});