# Google Maps Setup Guide

This guide will help you set up Google Maps integration in your AirEstate application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. A project in Google Cloud Console
3. Billing enabled on your GCP account (required for Maps API)

## Step 1: Enable Google Maps API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced functionality)

## Step 2: Create API Credentials

1. In the Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** > **API key**
3. Copy the generated API key
4. (Recommended) Restrict the API key:
   - Click on the API key to edit it
   - Under **Application restrictions**, select **HTTP referrers**
   - Add your domain(s): `localhost:3000`, `your-domain.com`
   - Under **API restrictions**, select **Restrict key**
   - Choose **Maps JavaScript API** and **Places API**

## Step 3: Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Add your Google Maps API key to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key-here"
   ```

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Visit `http://localhost:3000` and verify that the map loads correctly

## Features

The map integration includes:
- ✅ Interactive Google Maps display
- ✅ Customizable center point and zoom level
- ✅ Responsive design with Tailwind CSS styling
- ✅ Loading and error states
- ✅ Property marker support (ready for future implementation)
- ✅ TypeScript support with proper types

## Components

### GoogleMap
The base Google Maps component with full API integration.

### PropertyMap
A specialized component for displaying real estate properties on the map.

### Marker
A reusable marker component for adding custom markers to the map.

## Usage Example

```tsx
import { PropertyMap } from "@/components/map";

export default function MyPage() {
  return (
    <PropertyMap
      center={{ lat: 37.7749, lng: -122.4194 }}
      zoom={12}
      height="400px"
    />
  );
}
```

## Troubleshooting

### Map not loading
- Check that your API key is correctly set in `.env.local`
- Verify that the Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for any error messages

### API key errors
- Ensure billing is enabled on your GCP account
- Check that the API key restrictions allow your domain
- Verify that the correct APIs are enabled

### TypeScript errors
- Make sure `@types/google.maps` is installed
- Restart your TypeScript server in your IDE

## Security Notes

- Never commit your `.env.local` file to version control
- Use API key restrictions to limit usage to your domains
- Monitor your API usage in Google Cloud Console
- Consider implementing usage quotas for production

## Next Steps

To enhance the map functionality, you can:
1. Add property markers with custom info windows
2. Implement map clustering for better performance
3. Add search functionality with the Places API
4. Create custom map styles
5. Add driving directions and distance calculations 