import { generateAvailableTimeSlots } from '../timeSlots';

describe('generateAvailableTimeSlots', () => {
  const mockAvailability = [
    {
      id: '1',
      coach_id: 'coach-1',
      day_of_week: new Date().getDay(), // Use today's day of week
      start_time: '09:00',
      end_time: '17:00',
    }
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T08:00:00Z')); // Set fixed current time
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('generates slots for available times', () => {
    const slots = generateAvailableTimeSlots(mockAvailability, [], 1); // Only check one day
    expect(slots.length).toBeGreaterThan(0);
    expect(new Date(slots[0].start_time).getHours()).toBeGreaterThanOrEqual(9);
    expect(new Date(slots[slots.length - 1].end_time).getHours()).toBeLessThanOrEqual(17);
  });

  it('excludes slots that conflict with existing sessions', () => {
    const existingSessions = [
      {
        start_time: '2024-01-01T10:00:00Z',
        end_time: '2024-01-01T11:00:00Z',
      }
    ];

    const slots = generateAvailableTimeSlots(mockAvailability, existingSessions, 1);
    
    // Check that no slot overlaps with the existing session
    const hasConflict = slots.some(slot => 
      new Date(slot.start_time) >= new Date('2024-01-01T10:00:00Z') &&
      new Date(slot.end_time) <= new Date('2024-01-01T11:00:00Z')
    );
    
    expect(hasConflict).toBeFalsy();
  });

  it('excludes past time slots', () => {
    const slots = generateAvailableTimeSlots(mockAvailability, [], 1);
    
    // All slots should be in the future
    const now = new Date();
    const allSlotsInFuture = slots.every(slot => 
      new Date(slot.start_time) > now
    );
    
    expect(allSlotsInFuture).toBeTruthy();
  });

  it('respects session duration', () => {
    const slots = generateAvailableTimeSlots(mockAvailability, [], 1, 30); // 30-minute slots
    
    // Check that each slot is 30 minutes long
    slots.forEach(slot => {
      const duration = (new Date(slot.end_time).getTime() - new Date(slot.start_time).getTime()) / 1000 / 60;
      expect(duration).toBe(30);
    });
  });
}); 