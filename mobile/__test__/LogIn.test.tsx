import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Navigation from '../src/navigation';

describe('Testing Navigation to Sign Up Screen', () => {  
    test('clicking on one item takes you to the details screen', async () => {
    const component = (
        <Navigation />
    );

    render(component);
    const toClick = await screen.findByText(`Don't have an account? Sign up!`);

    fireEvent(toClick, 'press');
    const newHeader = await screen.findByText('Create an Account!');

    expect(newHeader).toBeTruthy();
    });
});
