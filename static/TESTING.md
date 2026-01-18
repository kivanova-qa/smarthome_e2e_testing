# Testing Guide

This Smart Home Lights application should be tested using Playwright. Write comprehensive end-to-end tests to ensure all functionality works correctly.

## Test Setup

The application uses Playwright for testing. Run the application on `http://localhost:5175` and use Playwright to automate browser testing.

## Functionalities to Test

### Authentication & User Management
- **User Registration** - Users can create new accounts with email and password
- **Email Verification** - Users must verify their email before accessing the dashboard
- **User Login** - Users can login with verified credentials
- **Login with Invalid Credentials** - Error handling for wrong passwords
- **Login with Unverified Account** - Unverified users are rejected
- **User Logout** - Users can logout and clear their session
- **Account Deletion** - Users can delete their accounts (cascades to lights)
- **Session Protection** - Dashboard and protected routes redirect to login when not authenticated

### Light Management
- **Add New Light** - Users can add new lights with custom names
- **Toggle Light On/Off** - Users can turn lights on and off
- **Change Light Color** - Users can change light colors using a color picker
- **Edit Light Name** - Users can edit light names inline
- **Delete Light** - Users can delete lights with confirmation
- **Data Persistence** - All light changes persist after page refresh

### UI/UX
- **Navigation** - All navigation links work correctly between pages
- **Form Validation** - Forms validate required fields and password matching
- **Responsive Design** - Application works on desktop, tablet, and mobile viewports
- **Error Handling** - All error scenarios display appropriate messages

### Edge Cases
- **Empty Form Submission** - Validation prevents empty submissions
- **Mismatched Passwords** - Password confirmation validation
- **Duplicate Email Registration** - Proper error for existing emails
- **Direct Route Access** - Protected routes redirect unauthenticated users
- **Network Errors** - Graceful handling of API failures

## Running Tests

```bash
npx playwright test
```

## Test Structure

Create tests in the `tests/` directory. Each major functionality should have its own test file or test suite.
