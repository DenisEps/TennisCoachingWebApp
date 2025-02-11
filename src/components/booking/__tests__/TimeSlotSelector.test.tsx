import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimeSlotSelector } from '../TimeSlotSelector';
import { supabaseAdmin } from '@/lib/supabase/config';

jest.mock('@/lib/supabase/config');

describe('TimeSlotSelector', () => {
  const mockOnSelect = jest.fn();
  const mockCoachId = 'coach-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<TimeSlotSelector coachId={mockCoachId} onSelect={mockOnSelect} />);
    expect(screen.getByText(/loading available time slots/i)).toBeInTheDocument();
  });

  it('shows error message when loading fails', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('Failed to load'))
    });

    render(<TimeSlotSelector coachId={mockCoachId} onSelect={mockOnSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load available time slots/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no slots are available', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [] }),
        gte: jest.fn().mockReturnValue({
          neq: jest.fn().mockResolvedValue({ data: [] })
        })
      })
    });

    render(<TimeSlotSelector coachId={mockCoachId} onSelect={mockOnSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText(/no available time slots found/i)).toBeInTheDocument();
    });
  });

  it('renders time slots and allows selection', async () => {
    const mockSlots = [
      {
        start_time: '2024-01-01T10:00:00Z',
        end_time: '2024-01-01T11:00:00Z'
      }
    ];

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: mockSlots }),
        gte: jest.fn().mockReturnValue({
          neq: jest.fn().mockResolvedValue({ data: [] })
        })
      })
    });

    render(<TimeSlotSelector coachId={mockCoachId} onSelect={mockOnSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText(/10:00 AM - 11:00 AM/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/10:00 AM - 11:00 AM/));
    expect(mockOnSelect).toHaveBeenCalledWith(mockSlots[0]);
  });
}); 