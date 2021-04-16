import React from 'react';
import { render, screen } from '@testing-library/react';
import Dropdown from './Dropdown';

describe('test Dropdown component', () => {
    const items = new Array(Math.floor(Math.random() * 100) + 1).fill().map((_, indx) => indx);

    it('should have equal items', async () => {
        render(<Dropdown label={'items'} items={items} />);
        const dropdown = screen.getAllByTestId(/dropdown-item/i);
        expect(dropdown.length).toEqual(items.length);
    });

    it('should call onChange with proper value', async () => {
        const onChangeMock = jest.fn();
        render(<Dropdown label={'items'} items={items} onChange={onChangeMock} />);
        const dropdown = screen.getAllByTestId(/dropdown-item/i);
        dropdown.pop().click();
        expect(onChangeMock).toBeCalledWith(items.length - 1);
    });
});
