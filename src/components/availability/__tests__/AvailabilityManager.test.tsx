import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AvailabilityManager } from '../AvailabilityManager';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseAdmin } from '@/lib/supabase/config';

jest.mock('@/contexts/AuthContext');
jest.mock('@/lib/supabase/config');

const mockUser = {
  id: 'coach-1',
  email: 'coach@example.com',
  role: 'coach'
};

describe('AvailabilityManager', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser
    });
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<AvailabilityManager />);
    expect(screen.getByText(/loading availability/i)).toBeInTheDocument();
  });

  it('shows empty state when no slots are available', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [] })
          })
        })
      })
    });

    render(<AvailabilityManager />);
    
    await waitFor(() => {
      expect(screen.getByText(/no availability set/i)).toBeInTheDocument();
    });
  });

  it('displays availability slots', async () => {
    const mockSlots = [
      { id: '1', day_of_week: 1, start_time: '09:00', end_time: '17:00' }
    ];

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockSlots })
          })
        })
      })
    });

    render(<AvailabilityManager />);
    
    await waitFor(() => {
      expect(screen.getByText('09:00 - 17:00')).toBeInTheDocument();
    });
  });

  it('handles adding new time slot', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [] })
          })
        })
      }),
      insert: jest.fn().mockResolvedValue({ data: [{ id: 'new-slot' }] })
    });

    render(<AvailabilityManager />);
    
    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Add Time Slot')[0]); // Monday's button
    });

    fireEvent.click(screen.getByText('Add'));
    
    await waitFor(() => {
      expect(screen.getByText(/time slot added successfully/i)).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            order: jest.fn().mockRejectedValue(new Error('Failed to load'))
          })
        })
      })
    });

    render(<AvailabilityManager />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load availability/i)).toBeInTheDocument();
    });
  });
}); 