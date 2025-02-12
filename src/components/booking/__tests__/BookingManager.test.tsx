import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingManager } from '../BookingManager';
import { supabaseAdmin } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';

// Mock the hooks and supabase
jest.mock('@/contexts/AuthContext');
jest.mock('@/lib/supabase/config');

const mockUser = {
  id: 'user-1',
  email: 'client@example.com',
  role: 'client'
};

describe('BookingManager', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser
    });
  });

  it('shows loading state initially', () => {
    render(<BookingManager />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message when coach loading fails', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockRejectedValue(new Error('Failed to load coaches'))
      })
    });

    render(<BookingManager />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load coaches/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no coaches are available', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [] })
      })
    });

    render(<BookingManager />);
    await waitFor(() => {
      expect(screen.getByText(/no coaches available/i)).toBeInTheDocument();
    });
  });

  it('allows selecting a coach and shows time slots', async () => {
    const mockCoach = {
      id: 'coach-1',
      email: 'coach@example.com',
      full_name: 'Test Coach'
    };

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [mockCoach] })
      })
    });

    render(<BookingManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Coach')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Test Coach'));
    
    await waitFor(() => {
      expect(screen.getByText(/select a date/i)).toBeInTheDocument();
    });
  });

  it('shows success message after booking', async () => {
    // Mock successful booking
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: [{ id: 'new-session' }] })
    });

    render(<BookingManager />);
    
    // Simulate booking process
    // ... (we'll add this when we implement the booking flow)

    await waitFor(() => {
      expect(screen.getByText(/booking successful/i)).toBeInTheDocument();
    });
  });

  it('starts with coach selection step', () => {
    render(<BookingManager />);
    expect(screen.getByText('Select a Coach')).toBeInTheDocument();
  });

  it('progresses through booking flow', async () => {
    // Mock coach data
    const mockCoach = {
      id: 'coach-1',
      email: 'coach@example.com',
      full_name: 'Test Coach'
    };

    // Mock time slot
    const mockTimeSlot = {
      start_time: '2024-01-01T10:00:00Z',
      end_time: '2024-01-01T11:00:00Z'
    };

    // Setup mocks for API calls
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [mockCoach] })
      })
    });

    render(<BookingManager />);

    // Step 1: Coach Selection
    await waitFor(() => {
      expect(screen.getByText('Test Coach')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Test Coach'));

    // Step 2: Time Selection
    expect(screen.getByText('Select a Time')).toBeInTheDocument();
    expect(screen.getByText('Change Coach')).toBeInTheDocument();

    // Mock time slots data
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [mockTimeSlot] })
      })
    });

    // Select time slot
    await waitFor(() => {
      const timeButton = screen.getByText(/10:00 AM/);
      fireEvent.click(timeButton);
    });

    // Step 3: Confirmation
    expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument();
  });

  it('allows going back to previous steps', async () => {
    render(<BookingManager />);

    // Mock and progress to time selection
    const mockCoach = {
      id: 'coach-1',
      email: 'coach@example.com',
      full_name: 'Test Coach'
    };

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [mockCoach] })
      })
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Test Coach'));
    });

    // Go back to coach selection
    fireEvent.click(screen.getByText('Change Coach'));
    expect(screen.getByText('Select a Coach')).toBeInTheDocument();
  });

  it('shows success message after booking completion', async () => {
    render(<BookingManager />);

    // Mock and complete booking flow
    // ... (similar to previous test)

    // Trigger booking completion
    await waitFor(() => {
      const confirmButton = screen.getByText('Confirm Booking');
      fireEvent.click(confirmButton);
    });

    expect(screen.getByText('Booking Successful!')).toBeInTheDocument();
    expect(screen.getByText('Book Another Session')).toBeInTheDocument();
  });

  it('allows starting a new booking after completion', async () => {
    const { container } = render(<BookingManager />);
    fireEvent.click(screen.getByText('Book Another Session'));
    expect(screen.getByText('Select a Coach')).toBeInTheDocument();
  });
}); 