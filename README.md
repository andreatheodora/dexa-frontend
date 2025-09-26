## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Pages

**1. Login Page (Landing Page)**

- Application starts here
- If user has logged in, application will direct user to HR Dashboard or Regular Dashboard based on access token

<br></br>
**2. HR Dashboard**

- Only accessible by HR users
- **Attendance Tab**
  - Table of attendance of all employees, with date filter
  - View tap in & tap out times and uploaded image
- **Employee Tab**

  - Table of employees
  - HR can update, delete, or create employees

<br></br>
**3. Dashboard**

- Attendance dashboard for users to tap in, tap out, and upload image proof
- Components:
  - **Stopwatch Clock** - this clock starts when user taps in for the day. When user opens the page again, the clock will show the amount of time user has worked.
  - **Tap in/Tap out Button** - user can click this button to start or end their work day.
  - **Upload Image Button** - user can use this button to upload proof of WFH (image only)
