import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import SignUpScreen from '../../src/screens/signUpScreen';
import { testAccountEmail, testAccountPass } from '../../src/utils/testVariables'

describe('<SignUpScreen /> rendering', () => {

    beforeAll(() => {
        tree = renderer.create(<SignUpScreen />).toJSON();
    });

    it('has 2 children', () => {
        expect(tree.children.length).toBe(2);
    });

    it('renders correctly', async () => {
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });
});

describe('<SignUpScreen /> functionality', () => {

    beforeEach(() => {
        screen = render(
            <SignUpScreen />
        );
    });

    it('short password error', async () => {
        const { getByPlaceholderText, getByText, getAllByText } = screen;
        fireEvent.changeText(
            getByPlaceholderText('Email'),
            'tester@notvalid.com'
        );
        fireEvent.changeText(
            getByPlaceholderText('First Name'),
            'first test'
        );
        fireEvent.changeText(
            getByPlaceholderText('Last Name'),
            'last test'
        );
        fireEvent.changeText(
            getByPlaceholderText('Password'),
            '123'
        );
        await fireEvent.press(getByText('Create Account'));
        const elements = getAllByText('Password must be at least 6 characters.');
        expect(elements).toHaveLength(1);
    });

    it('please fill out all fields error', async () => {
        const { getByPlaceholderText, getByText, getAllByText } = screen;
        fireEvent.changeText(
            getByPlaceholderText('First Name'),
            'first test'
        );
        fireEvent.changeText(
            getByPlaceholderText('Last Name'),
            'last test'
        );
        fireEvent.changeText(
            getByPlaceholderText('Password'),
            '123'
        );
        await fireEvent.press(getByText('Create Account'));
        const elements = getAllByText('Please fill out all fields.');
        expect(elements).toHaveLength(1);
    });

    it('email already used', async () => {
        const { getByPlaceholderText, getByText, getAllByText } = screen;
        fireEvent.changeText(
            getByPlaceholderText('Email'),
            testAccountEmail
        );
        fireEvent.changeText(
            getByPlaceholderText('First Name'),
            'first test'
        );
        fireEvent.changeText(
            getByPlaceholderText('Last Name'),
            'last test'
        );
        fireEvent.changeText(
            getByPlaceholderText('Password'),
            '1233453'
        );
        await act(async () => {
            await fireEvent.press(getByText('Create Account'));
        });
        const elements = getAllByText('That email has already been used to create an account.');
        expect(elements).toHaveLength(1);
    });

    it('email invalid', async () => {
        const { getByPlaceholderText, getByText, getAllByText } = screen;
        fireEvent.changeText(
            getByPlaceholderText('Email'),
            'testnotvalidemail@email'
        );
        fireEvent.changeText(
            getByPlaceholderText('First Name'),
            'first test'
        );
        fireEvent.changeText(
            getByPlaceholderText('Last Name'),
            'last test'
        );
        fireEvent.changeText(
            getByPlaceholderText('Password'),
            '1233463'
        );
        await fireEvent.press(getByText('Create Account'));
        const elements = getAllByText('Please enter a valid email address.');
        expect(elements).toHaveLength(1);
    });
});