# Application Flow Documentation

## Incorrect Implementation (Reverted)

### Changes Made:

1. **API Functions** (lib/api.ts):
   - Created `createApplication()` - POST to `/applications` with `{ goalId, status }`
   - Created `updateApplicationStatus()` - PATCH to `/applications/{applicationId}` with `{ status }`

2. **ApplyButton Component** (components/apply-button.tsx):
   - Initial version: Created application, then updated status
   - Second version: Only sent PATCH to `/applications/{goalId}` with `{ status: "accepted" }`

### Issues:

- Did not include required fields: clientId, assistantId, pitch, trialStatus
- Used PATCH instead of POST
- Did not collect user input for pitch

---

## Correct Implementation

### Proper Application Submission Flow:

When user clicks "Apply" on goal details page:

1. Show a modal/form where user enters their pitch
2. POST to `/applications` endpoint with complete object:

   ```json
   {
     "clientId": "65a8f4c2b1234567890abcde",
     "goalId": "65a8f4c2b1234567890abcdf",
     "assistantId": "65a8f4c2b1234567890abc00",
     "pitch": "User's pitch text",
     "status": "pending",
     "trialStatus": "none"
   }
   ```

3. On success, navigate to confirmation page

### Fields Explanation:

- `clientId`: Goal owner's ID
- `goalId`: The goal being applied for
- `assistantId`: Current logged-in assistant's ID
- `pitch`: Assistant's application pitch/message
- `status`: Always "pending" for new applications
- `trialStatus`: Always "none" for new applications

### API Endpoint:

- Endpoint: `POST http://192.168.1.9:3001/applications`
- Body: Complete application object (see above)
- No URL parameters needed
