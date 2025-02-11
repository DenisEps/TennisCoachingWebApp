import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimeSlotInput } from '../TimeSlotInput';

describe('TimeSlotInput', () => {
  const mockProps = {
    startTime: '09:00',
    endTime: '17:00',
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays time slot correctly', () => {
    render(<TimeSlotInput {...mockProps} />);
    expect(screen.getByText('09:00 - 17:00')).toBeInTheDocument();
  });

  it('shows edit form when edit button is clicked', () => {
    render(<TimeSlotInput {...mockProps} />);
    
    // Find edit button by title attribute
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('09:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('17:00')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('handles successful update', async () => {
    mockProps.onUpdate.mockResolvedValueOnce(undefined);
    
    render(<TimeSlotInput {...mockProps} />);
    
    // Click edit button
    fireEvent.click(screen.getByTitle('Edit'));
    
    // Change start time
    const startInput = screen.getByDisplayValue('09:00');
    fireEvent.change(startInput, { target: { value: '10:00' } });
    
    // Click save button
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(mockProps.onUpdate).toHaveBeenCalledWith('10:00', '17:00');
    });
  });

  it('shows error message on update failure', async () => {
    mockProps.onUpdate.mockRejectedValueOnce(new Error('Update failed'));
    
    render(<TimeSlotInput {...mockProps} />);
    
    fireEvent.click(screen.getByTitle('Edit'));
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to update time slot')).toBeInTheDocument();
    });
  });

  it('confirms before deletion', () => {
    window.confirm = jest.fn(() => true);
    
    render(<TimeSlotInput {...mockProps} />);
    
    // Find delete button by title attribute
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockProps.onDelete).toHaveBeenCalled();
  });

  it('cancels deletion when not confirmed', () => {
    window.confirm = jest.fn(() => false);
    
    render(<TimeSlotInput {...mockProps} />);
    
    fireEvent.click(screen.getByTitle('Delete'));
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockProps.onDelete).not.toHaveBeenCalled();
  });

  it('shows loading spinner during delete operation', async () => {
    mockProps.onDelete.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    window.confirm = jest.fn(() => true);
    
    render(<TimeSlotInput {...mockProps} />);
    
    fireEvent.click(screen.getByTitle('Delete'));
    
    expect(screen.getByRole('status')).toBeInTheDocument(); // LoadingSpinner has role="status"
  });

  it('disables buttons during loading state', async () => {
    mockProps.onUpdate.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<TimeSlotInput {...mockProps} />);
    
    fireEvent.click(screen.getByTitle('Edit'));
    fireEvent.click(screen.getByText('Save'));
    
    expect(screen.getByText('Save')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('maintains visual styling', () => {
    const { container } = render(<TimeSlotInput {...mockProps} />);
    
    // Check for presence of styling classes
    expect(container.firstChild).toHaveClass(
      'flex',
      'items-center',
      'justify-between',
      'rounded-md',
      'border',
      'bg-white'
    );
  });
}); 