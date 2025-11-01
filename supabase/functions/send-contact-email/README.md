# Edge Function: send-contact-email

This Edge Function sends contact form submissions via email when database persistence fails. It acts as a fallback mechanism to ensure no contact submissions are lost.

## Purpose

When a user submits the contact form on MS-Portfolio:
1. **Primary**: Direct insert into `public.leads` table (Supabase database)
2. **Fallback**: If database insert fails → call this Edge Function to send email

## Environment Variables

Configure these secrets in Supabase Dashboard → Edge Functions → Secrets:

```bash
# Required: Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional: Sender email (must be verified in Resend)
CONTACT_EMAIL_FROM=noreply@monynha.com

# Optional: Default recipient email
CONTACT_EMAIL_TO=marcelo@monynha.com
```

### Getting a Resend API Key

1. Sign up at https://resend.com (free tier: 3,000 emails/month)
2. Verify your sending domain or use Resend's test domain
3. Generate an API key from Dashboard → API Keys
4. Add the key to Supabase secrets

## Request Format

```typescript
POST https://pkjigvacvddcnlxhvvba.supabase.co/functions/v1/send-contact-email

Headers:
  Content-Type: application/json
  Authorization: Bearer <SUPABASE_ANON_KEY>

Body:
{
  "name": "John Doe",           // Required
  "email": "john@example.com",  // Required
  "message": "Hello!",          // Required
  "company": "Acme Inc",        // Optional
  "project": "Web App",         // Optional
  "to": "custom@email.com"      // Optional (overrides default)
}
```

## Response Format

### Success (200)
```json
{
  "success": true,
  "emailId": "re_abc123...",
  "message": "Email sent successfully"
}
```

### Error (400/500)
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Testing Locally

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Deploy function locally
supabase functions serve send-contact-email

# Test with curl
curl -X POST http://localhost:54321/functions/v1/send-contact-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

## Deployment

The function is already deployed! To update:

```bash
# Deploy using Supabase CLI
supabase functions deploy send-contact-email

# Or use the Supabase Dashboard
# Dashboard → Edge Functions → Upload new version
```

## Current Status

✅ **Deployed**: Version 1  
✅ **Status**: ACTIVE  
⚠️ **Action Required**: Configure `RESEND_API_KEY` environment variable

## Email Template

The function sends a beautifully formatted HTML email with:
- Gradient header with portfolio branding
- All form fields clearly displayed
- Reply-to set to submitter's email
- Plain text fallback for email clients without HTML support
- Tags for analytics (category: contact-form, source: portfolio)

## Integration with Frontend

The frontend (`src/pages/Contact.tsx`) automatically uses this function as fallback:

```typescript
const result = await submitContactLead(
  supabase,
  formData,
  async (payload, reason) => {
    // This fallback calls send-contact-email
    const { error } = await supabase.functions.invoke('send-contact-email', {
      body: { ...payload, to: 'marcelo@monynha.com' }
    });
    if (error) throw error;
  }
);
```

## Monitoring

View function logs in Supabase Dashboard:
- Dashboard → Edge Functions → send-contact-email → Logs
- Check invocation count, errors, and execution time

## Security

- ✅ CORS headers configured for cross-origin requests
- ✅ JWT verification enabled (requires valid Supabase auth token)
- ✅ Input validation for required fields
- ✅ API keys stored as Supabase secrets (not in code)
- ✅ Rate limiting handled by Supabase platform

## Cost Estimation

**Resend Free Tier**: 3,000 emails/month  
**Expected Usage**: ~10-50 emails/month (fallback only)  
**Supabase Edge Functions**: 500K invocations/month (free tier)

💡 **Tip**: Since this is a fallback, it should rarely be called if the database is working correctly!
