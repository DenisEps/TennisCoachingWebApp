import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingConfirmation } from '../BookingConfirmation';
import { supabaseAdmin } from '@/lib/supabase/config';

jest.mock('@/lib/supabase/config');

describe('BookingConfirmation', () => {
  const mockProps = {
    coach: {
      id: 'coach-1',
      email: 'coach@example.com',
      full_name: 'Test Coach'
    },
    timeSlot: {
      start_time: '2024-01-01T10:00:00Z',
      end_time: '2024-01-01T11:00:00Z'
    },
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    userId: 'user-1'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays booking details correctly', () => {
    render(<BookingConfirmation {...mockProps} />);
    
    expect(screen.getByText('Test Coach')).toBeInTheDocument();
    expect(screen.getByText(/monday, january 1, 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/10:00 AM - 11:00 AM/i)).toBeInTheDocument();
  });

  it('handles successful booking', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: [{ id: 'new-session' }], error: null })
    });

    render(<BookingConfirmation {...mockProps} />);
    
    fireEvent.click(screen.getByText('Confirm Booking'));
    
    await waitFor(() => {
      expect(mockProps.onConfirm).toHaveBeenCalled();
    });
  });

  it('handles booking error', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockRejectedValue(new Error('Booking failed'))
    });

    render(<BookingConfirmation {...mockProps} />);
    
    fireEvent.click(screen.getByText('Confirm Booking'));
    
    await waitFor(() => {
      expect(screen.getByText(/failed to book session/i)).toBeInTheDocument();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<BookingConfirmation {...mockProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('disables buttons during booking process', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    });

    render(<BookingConfirmation {...mockProps} />);
    
    fireEvent.click(screen.getByText('Confirm Booking'));
    
    expect(screen.getByText('Confirm Booking')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
}); 