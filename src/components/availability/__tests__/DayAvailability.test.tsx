import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DayAvailability } from '../DayAvailability';

describe('DayAvailability', () => {
  const mockProps = {
    dayName: 'Monday',
    dayOfWeek: 1,
    slots: [
      { id: '1', start_time: '09:00', end_time: '12:00' },
      { id: '2', start_time: '14:00', end_time: '17:00' }
    ],
    onAddSlot: jest.fn(),
    onUpdateSlot: jest.fn(),
    onDeleteSlot: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays day name and slots', () => {
    render(<DayAvailability {...mockProps} />);
    
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('09:00 - 12:00')).toBeInTheDocument();
    expect(screen.getByText('14:00 - 17:00')).toBeInTheDocument();
  });

  it('shows add slot form when Add Time Slot is clicked', () => {
    render(<DayAvailability {...mockProps} />);
    
    fireEvent.click(screen.getByText('Add Time Slot'));
    
    expect(screen.getByDisplayValue('09:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('17:00')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('handles successful slot addition', async () => {
    mockProps.onAddSlot.mockResolvedValueOnce(undefined);
    
    render(<DayAvailability {...mockProps} />);
    
    fireEvent.click(screen.getByText('Add Time Slot'));
    fireEvent.click(screen.getByText('Add'));
    
    await waitFor(() => {
      expect(mockProps.onAddSlot).toHaveBeenCalledWith('09:00', '17:00');
    });
  });

  it('shows error message on add failure', async () => {
    mockProps.onAddSlot.mockRejectedValueOnce(new Error('Add failed'));
    
    render(<DayAvailability {...mockProps} />);
    
    fireEvent.click(screen.getByText('Add Time Slot'));
    fireEvent.click(screen.getByText('Add'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to add time slot')).toBeInTheDocument();
    });
  });

  it('handles slot update', async () => {
    mockProps.onUpdateSlot.mockResolvedValueOnce(undefined);
    
    render(<DayAvailability {...mockProps} />);
    
    // Click edit on first slot
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Change start time
    const startInput = screen.getByDisplayValue('09:00');
    fireEvent.change(startInput, { target: { value: '10:00' } });
    
    // Save changes
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(mockProps.onUpdateSlot).toHaveBeenCalledWith('1', '10:00', '12:00');
    });
  });

  it('handles slot deletion', async () => {
    mockProps.onDeleteSlot.mockResolvedValueOnce(undefined);
    window.confirm = jest.fn(() => true);
    
    render(<DayAvailability {...mockProps} />);
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockProps.onDeleteSlot).toHaveBeenCalledWith('1');
    });
  });

  it('disables inputs and buttons while loading', async () => {
    mockProps.onAddSlot.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<DayAvailability {...mockProps} />);
    
    fireEvent.click(screen.getByText('Add Time Slot'));
    fireEvent.click(screen.getByText('Add'));
    
    expect(screen.getByDisplayValue('09:00')).toBeDisabled();
    expect(screen.getByDisplayValue('17:00')).toBeDisabled();
    expect(screen.getByText('Add')).toBeDisabled();
  });

  it('cancels add form when Cancel is clicked', () => {
    render(<DayAvailability {...mockProps} />);
    
    fireEvent.click(screen.getByText('Add Time Slot'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });
}); 