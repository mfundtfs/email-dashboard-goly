# Email Automation Dashboard - API Integration

## Overview
This dashboard displays email automation data fetched from a backend API.

## Backend Configuration

### Base URL
The backend API is configured at: `http://10.226.91.63:5001`

### Environment Setup

1. **Create a `.env` file** in the root of the `email-automation-dashboard` directory:
   ```bash
   cp .env.example .env
   ```

2. **Configure the API URL** in `.env`:
   ```env
   VITE_API_BASE_URL=http://10.226.91.63:5001
   ```

   > **Note**: The `.env` file is already added to `.gitignore` and will not be committed to the repository.

## API Endpoint

### POST `email_send_import/list`

Fetches a paginated list of email records.

#### Request
```json
{
  "page": 1,
  "per_page": 20,
  "date": "2026-02-12"
}
```

#### Response
```json
{
  "status": 200,
  "message": "Fetched successfully",
  "data": {
    "records": [
      {
        "id": 156,
        "sender_email": "umstfs29@gmail.com",
        "receiver_email": "sunny.singh@transformsolution.net",
        "status": "SENT",
        "status_message": "Sent successfully",
        "sent_at": "Fri, 13 Feb 2026 15:46:50 GMT",
        "responds": "No Response Yet",
        "subject": null,
        "body": null,
        "first_name": "Sunny",
        "company": "Transform",
        "created_at": "Fri, 13 Feb 2026 18:16:18 GMT"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total_pages": 5,
      "total_records": 96
    },
    "filters_applied": {
      "date": "2026-02-13",
      "receiver_email": null,
      "sender_email": null
    }
  }
}
```

## Features

- **Date Filtering**: Select a specific date to view email records
- **Response Filtering**: Filter by response status (Responds, No Response Yet, Unsubscribed)
- **Pagination**: Navigate through pages with configurable rows per page (10, 20, 50, 100, 500)
- **Loading States**: Visual feedback while data is being fetched
- **Error Handling**: User-friendly error messages if API calls fail
- **Body Preview**: Hover over the eye icon to view full email body content

## Files Structure

```
email-automation-dashboard/
├── .env                          # Environment variables (not committed)
├── .env.example                  # Example environment variables template
├── .gitignore                    # Git ignore rules
├── app/
│   ├── lib/
│   │   └── api.ts               # API service and TypeScript types
│   └── routes/
│       └── EmailAutomationSummary.tsx  # Main component
```

## Development

### Install Dependencies
```bash
cd email-automation-dashboard
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production
```bash
npm run build
```

## TypeScript Types

All API types are defined in [`app/lib/api.ts`](email-automation-dashboard/app/lib/api.ts):

- `EmailRecord` - Individual email record
- `PaginationInfo` - Pagination metadata
- `FiltersApplied` - Applied filters
- `EmailListResponse` - Complete API response
- `EmailListRequest` - API request payload

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend API has proper CORS headers configured to allow requests from your frontend domain.

### Environment Variables Not Working
- Ensure the environment variable starts with `VITE_` prefix (required by Vite)
- Restart the development server after changing `.env` file
- Check that `.env` file is in the correct directory

### API Connection Failed
- Verify the backend server is running at `http://10.226.91.63:5001`
- Check network connectivity
- Ensure no firewall is blocking the connection

## Git Workflow

The `.gitignore` file is configured to exclude:
- `.env` files (all variants)
- `node_modules/`
- Build outputs
- Logs
- Editor configuration files

**Important**: Never commit the `.env` file to the repository. Always use `.env.example` as a template.
