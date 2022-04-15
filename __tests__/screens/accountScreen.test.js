import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import AccountScreen from '../../src/screens/accountScreen';

describe('<AccountScreen /> load', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<AccountScreen />).toJSON();
        expect(tree.children.length).toBe(2);
    });

    it('renders correctly', async () => {
        const tree = renderer.create(<AccountScreen />).toJSON();
        await act(async () => { await expect(tree).toMatchSnapshot(); })
    });

});

describe('<AccountScreen /> functionality', () => {

    beforeEach(() => {
        user = {
            "-N-gWcl-XCle0sF_Zf7E": {
                email: "Test@email.com",
                firstName: "Joseph",
                lastName: "Deer",
                password: "testpass",
                profilePic: ""
            }
        }
        screen = render (
            <AccountScreen user={user} />
        );
    });

    it('First Name Edit Button', async () => {
        const { getByDisplayValue, getAllByText } = screen;
        const editButtons = await getAllByText('Edit');
        await fireEvent.press(editButtons[0]);
        const element = await getByDisplayValue('Joseph');
        expect(element).toBeTruthy();
    });

    it('Last Name Edit Button', async () => {
        const { getByDisplayValue, getAllByText } = screen;
        const editButtons = await getAllByText('Edit');
        await fireEvent.press(editButtons[1]);
        const element = await getByDisplayValue('Deer');
        expect(element).toBeTruthy();
    });

    it('Email Edit Button', async () => {
        const { getByDisplayValue, getAllByText } = screen;
        const editButtons = await getAllByText('Edit');
        await fireEvent.press(editButtons[2]);
        const element = await getByDisplayValue('Test@email.com');
        expect(element).toBeTruthy();
    });

    it('Password Edit Button', async () => {
        const { getByDisplayValue, getAllByText } = screen;
        const editButtons = await getAllByText('Edit');
        await fireEvent.press(editButtons[3]);
        const element = await getByDisplayValue('testpass');
        expect(element).toBeTruthy();
    });
});