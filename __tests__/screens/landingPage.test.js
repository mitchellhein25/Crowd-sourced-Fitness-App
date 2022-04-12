import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import LandingPage from '../../src/screens/landingPage';
import { testAccountEmail, testAccountPass } from '../../assets/testVariables'

describe('<LandingPage /> rendering', () => {

    beforeAll(() => {
        tree = renderer.create(<LandingPage />).toJSON();
    });

    it('has 3 children', () => {
        expect(tree.children.length).toBe(3);
    });

    it('renders correctly', async () => {
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});

describe('<LandingPage /> functionality', () => {

    beforeEach(() => {
        landingPage = render(
            <LandingPage />
        );
    });

    it('short password error', async () => {
        const { getByPlaceholderText, getByText, getAllByText } = landingPage;
        fireEvent.changeText(
            getByPlaceholderText('Password'),
            '123'
        );
        await fireEvent.press(getByText('Sign In'));
        const elements = getAllByText('Password must be at least 6 characters.');
        expect(elements).toHaveLength(1); 
    });

    it('invalid email error', async () => {
        const { getByPlaceholderText, getByText, getAllByText } = landingPage;
        fireEvent.changeText(
            getByPlaceholderText('Email'),
            'test@test'
        );
        await fireEvent.press(getByText('Sign In'));
        const elements = getAllByText('Please enter a valid email address.');
        expect(elements).toHaveLength(1);
    });

    it('no existing users with that email', async () => {
        const { getByPlaceholderText, getByText, getAllByText } = landingPage;
        fireEvent.changeText(
            getByPlaceholderText('Email'),
            'testnotexistingindatabase@email.com'
        );
        fireEvent.changeText(
            getByPlaceholderText('Password'),
            'testpass'
        );
        await act(async() => {
            await fireEvent.press(getByText('Sign In'));
        });
        const elements = await getAllByText('There are no existing users with that email.');
        await expect(elements).toHaveLength(1);
    });

    it('incorrect password for that email', async () => {
        const { getByPlaceholderText, getByText, getAllByText } = landingPage;
        fireEvent.changeText(
            getByPlaceholderText('Email'),
            testAccountEmail
        );
        fireEvent.changeText(
            getByPlaceholderText('Password'),
            'incorrectPassword'
        );
        await act(async () => {
            await fireEvent.press(getByText('Sign In'));
        });
        const elements = await getAllByText('That is the incorrect password for that email.');
        await expect(elements).toHaveLength(1);
    });
});