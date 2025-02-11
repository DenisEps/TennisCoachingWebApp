import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoachSelector } from '../CoachSelector';
import { supabaseAdmin } from '@/lib/supabase/config';

jest.mock('@/lib/supabase/config');

describe('CoachSelector', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<CoachSelector onSelect={mockOnSelect} />);
    expect(screen.getByText(/loading available coaches/i)).toBeInTheDocument();
  });

  it('shows error message when loading fails', async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockRejectedValue(new Error('Failed to load'))
      })
    });

    render(<CoachSelector onSelect={mockOnSelect} />);
    
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

    render(<CoachSelector onSelect={mockOnSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText(/no coaches available/i)).toBeInTheDocument();
    });
  });

  it('renders coaches and allows selection', async () => {
    const mockCoaches = [
      { id: '1', email: 'coach1@test.com', full_name: 'Coach One' },
      { id: '2', email: 'coach2@test.com', full_name: 'Coach Two' }
    ];

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: mockCoaches })
      })
    });

    render(<CoachSelector onSelect={mockOnSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText('Coach One')).toBeInTheDocument();
      expect(screen.getByText('Coach Two')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Coach One'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockCoaches[0]);
  });
}); 