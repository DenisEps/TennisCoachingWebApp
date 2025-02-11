interface CoachAvailability {
  id: string;
  coach_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface ExistingSession {
  start_time: string;
  end_time: string;
}

export function generateAvailableTimeSlots(
  availability: CoachAvailability[],
  existingSessions: ExistingSession[],
  daysToShow = 14, // Show next 2 weeks by default
  sessionDuration = 60 // 60 minutes per session
): TimeSlot[] {
  const availableSlots: TimeSlot[] = [];
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + daysToShow);

  // For each day in the range
  for (let date = new Date(now); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();

    // Find availability for this day of the week
    const dayAvailability = availability.find(a => a.day_of_week === dayOfWeek);
    if (!dayAvailability) continue;

    // Parse availability times
    const [availStartHour, availStartMin] = dayAvailability.start_time.split(':').map(Number);
    const [availEndHour, availEndMin] = dayAvailability.end_time.split(':').map(Number);

    // Create slots for this day
    const dayStart = new Date(date);
    dayStart.setHours(availStartHour, availStartMin, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(availEndHour, availEndMin, 0, 0);

    // Skip if the entire day is in the past
    if (dayEnd <= now) continue;

    // Generate slots
    for (
      let slotStart = new Date(dayStart);
      slotStart < dayEnd;
      slotStart.setMinutes(slotStart.getMinutes() + sessionDuration)
    ) {
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + sessionDuration);

      // Skip if slot is in the past or ends after availability ends
      if (slotStart <= now || slotEnd > dayEnd) continue;

      // Check if slot conflicts with any existing session
      const hasConflict = existingSessions.some(session => {
        const sessionStart = new Date(session.start_time);
        const sessionEnd = new Date(session.end_time);
        return (
          (slotStart >= sessionStart && slotStart < sessionEnd) ||
          (slotEnd > sessionStart && slotEnd <= sessionEnd) ||
          (slotStart <= sessionStart && slotEnd >= sessionEnd)
        );
      });

      if (!hasConflict) {
        availableSlots.push({
          start_time: slotStart.toISOString(),
          end_time: slotEnd.toISOString(),
        });
      }
    }
  }

  return availableSlots;
} 