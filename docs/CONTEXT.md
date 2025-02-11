# CONTEXT.md

## Overview

This project is a **mobile-friendly, mobile-first tennis coaching web application** focusing on a **streamlined scheduling flow** between tennis coaches and clients. The core functionality includes:

- **User Authentication** (Email-based)
- **Role-Based Access Control** for Coaches and Clients
- **Scheduling & Availability Management** (Coaches set schedules, Clients book)
- **Session Management** (Booking, cancellation)
- **Offline Payments** (no in-app payments for MVP; cash payments directly to coach)
- **Email Notifications** for critical actions (booking/cancellation)
- **Basic User Profiles** (Client and Coach info)
- **News Feed** (for coaches to post news, announcements, etc.)
- **Scalable Architecture** for future enhancements (online payments, admin dashboard, recurring sessions)

## 1. Goals & Key Objectives

1. **Provide an Intuitive Booking Flow**  
   - Clients should be able to see coach availability quickly and book sessions easily.  
   - Coaches should be able to set their schedules and view/manage upcoming sessions.

2. **Ensure Clear Role Separation**  
   - Different dashboards for Coaches (managing availability, sessions) and Clients (booking, managing personal sessions).

3. **Establish a Strong Foundation for Future Features**  
   - The MVP focuses on essential scheduling.  
   - The architecture is designed to be flexible enough to incorporate advanced features later (online payments, session feedback, advanced analytics).

4. **Mobile-First User Experience**  
   - All screens and components are optimized for mobile devices.  
   - A responsive layout ensures a smooth experience on desktop and tablet views.

## 2. Tech Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/)
- **UI Library & Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [Shadcn UI](https://ui.shadcn.com/)

### Backend & Database

- **Supabase**  
  - **Authentication:** Supabase Auth for email sign-up/login.  
  - **Database:** Supabase's PostgreSQL for relational data.  
  - **Storage:** For any future file uploads (client/coach profile pictures, etc.).

### Other Libraries/Services

- **Email Notifications:**  
  - Leverage Supabase's serverless functions (Edge Functions) for MVP. For future enhancements, external email services such as [SendGrid](https://sendgrid.com/), [Mailgun](https://www.mailgun.com/), or [Postmark](https://postmarkapp.com/) may be considered.

- **Deployment:**  
  - The frontend can be deployed on [Vercel](https://vercel.com/) for MVP. Other options like [Netlify](https://www.netlify.com/) can be explored for future scope enhancements.  
  - Supabase handles hosting the backend.

## 3. MVP Features

1. **User Authentication** ✅  
   - Email sign-up via Supabase
   - Simplified login flow with Coach/Client buttons
   - Basic role-based access control

2. **Coach & Scheduling System** ✅  
   - Coaches set their availability (days/hours)
   - Clients can view available coaches and time slots

3. **Session Management** ✅  
   - Clients can book and cancel sessions
   - Coaches can view and manage sessions

4. **Offline Payment Handling** ✅  
   - Cash payments are made directly to the coach
   - A single uniform pricing model is used for simplicity

5. **Notifications**  
   - [POSTPONED for Post-MVP] Email alerts for booking/cancellation
   - Will be implemented after core functionality is stable

6. **Client Profiles & Session History** ✅  
   - Basic client information
   - Track session history (completed and upcoming)

7. **Coach Dashboard** ✅  
   - Overview of upcoming sessions
   - Functionality to set or adjust availability

8. **News Feed**  
   - A placeholder page for coaches to post news, announcements, etc.

## 4. Future Scope & Enhancements

- **Advanced Authentication:** Integration with Google, Apple, and phone-based sign-in.
- **Online Payments:** Integration with Stripe, PayPal, session packages, and subscriptions.
- **Recurring Sessions:** Enable clients to book recurring weekly or monthly sessions.
- **Coach Notes & Progress Tracking:** Provide detailed stats and session-based notes.
- **Admin Panel:** Tools to manage users, coaches, pricing, and advanced reporting.
- **Rating & Feedback:** Allow coaches and clients to exchange feedback.
- **Advanced Calendar Integration:** Embedding with Google Calendar or Cal.com.

## 5. User Flows

### 5.1 Authentication Flow

1. **Landing/Welcome Screen**  
   - Display options to login or sign up. For the MVP, only buttons to login as Coach or Client are provided.

2. **Sign Up**  
   - Collect email, password, role selection (Coach or Client), and basic profile information.

3. **Login**  
   - A login screen with buttons for Coach or Client.  
   - Include a non-functional "Forgot password" placeholder.

### 5.2 Client Flow

1. **Client Dashboard**  
   - Displays upcoming sessions, session history, a booking button, and profile settings.

2. **Booking Flow**  
   - Clients select a coach.  
   - Pick a date and time slot.  
   - Confirm the booking.

3. **Session Management**  
   - View session details (time, coach info).  
   - Cancel sessions (rescheduling is planned as a future enhancement).  
   - Access session history.

4. **Profile Settings**  
   - Manage personal information (name, contact details).

### 5.3 Coach Flow

1. **Coach Dashboard**  
   - Displays today's sessions, upcoming sessions, session history, and profile settings.

2. **Availability Management**  
   - Set working hours (e.g., 8AM-5PM).  
   - Mark available or blocked days.

3. **Session Overview**  
   - Displays client information, session time, and status.

4. **Profile Settings**  
   - Manage professional details (bio, experience) and contact information.

### 5.4 Common Screens

- **Help/Support**  
  - Provide basic contact information or FAQs.
- **Error States & Loading**  
  - Display messages for connection issues, data fetch errors, and maintenance notifications.
- **News Feed**  
  - A placeholder page for coaches to post news and announcements.
- **User Public Profile**  
  - For coaches: view client details (name, contact).  
  - For clients: view coach details (name, contact, with bio in future enhancements).

## 6. Database Schema

The detailed SQL schema for the project is maintained separately in the file:
**docs/DatabaseSchema.sql**

## 7. Further Considerations

- **Security:**  
  Ensure session details and user data are protected by using Supabase's row-level security (RLS) rules for data isolation.
- **Performance:**  
  Optimize for mobile data usage and implement caching strategies as needed (e.g., using SWR in React).
- **Scalability:**  
  The modular architecture with Supabase and Next.js facilitates future enhancements such as admin dashboards, advanced reporting, and payment integrations.
- **Version Control:**  
  Utilize Git to manage version control.
- **Linting & Formatting:**  
  Use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to maintain a consistent code style.
- **Naming Conventions:**  
  Keep file and function names descriptive and consistent across components, hooks, and utilities.
- **Automated Testing:**  
  Write unit tests for critical functions and components using [Jest](https://jestjs.io/).
- **Supabase Row-Level Security (RLS):**  
  Configure RLS rules so that coaches can only access their own data and clients can only access their own bookings.
- **Sensitive Data:**  
  Store API keys and service credentials securely in environment variables or through Supabase's configuration.
- **Database Indexing:**  
  Ensure frequently queried fields (e.g., `start_time` in sessions) are properly indexed.
- **Stateless Architecture:**  
  Maintain business logic in the backend (using Supabase Edge Functions or serverless endpoints) to simplify scaling.
- **Modular Code Structure:**  
  Build reusable components (e.g., booking widget, availability calendar) that can be easily extended or replaced.
- **Error Handling:**  
  Implement comprehensive error handling and provide user feedback for common issues (e.g., no availability, booking failure).

## 8. Conclusion

This **mobile-friendly tennis coaching app** is designed to be lightweight, fast, and user-focused, simplifying the booking process for clients and the schedule management for coaches. With **Supabase** as the backend (handling authentication and data) and a modern **React/Next.js** frontend, the foundation is robust and scalable. The MVP will focus on core scheduling flows and offline (cash) payment handling, with room for incremental feature expansions as user needs grow.
