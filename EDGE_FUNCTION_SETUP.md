# 🔧 Configure Edge Function Environment Variables

The `send-contact-email` Edge Function is deployed but needs the Resend API key to send emails.

## Current Status

✅ **Edge Function**: Deployed and active  
✅ **Authentication**: Working (Supabase anon key is correct)  
❌ **Email Service**: Not configured (needs RESEND_API_KEY)

**Error when testing**: `{"success":false,"error":"Email service not configured"}`

## Quick Setup Steps

### 1️⃣ Get Your Resend API Key

You already have one: `re_VUmH6mTe_NSsCiB2JpMeCX77jqWYr6Do1`

But let's verify it's active:
- Go to https://resend.com/api-keys
- Check if the key is active
- If needed, create a new API key

### 2️⃣ Add Key to Supabase

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to: https://supabase.com/dashboard/project/pkjigvacvddcnlxhvvba/settings/functions
2. Scroll to "Edge Function Secrets"
3. Click "Add new secret"
4. Fill in:
   ```
   Name: RESEND_API_KEY
   Value: re_VUmH6mTe_NSsCiB2JpMeCX77jqWYr6Do1
   ```
5. Click "Save"

**Option B: Via Supabase CLI**

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref pkjigvacvddcnlxhvvba

# Set the secret
supabase secrets set RESEND_API_KEY=re_VUmH6mTe_NSsCiB2JpMeCX77jqWYr6Do1

# Optional: Set other secrets
supabase secrets set CONTACT_EMAIL_FROM=noreply@monynha.com
supabase secrets set CONTACT_EMAIL_TO=marcelo@monynha.com
```

### 3️⃣ Test the Function

**After adding the secret**, test again:

```bash
# On WSL/Linux/Mac
chmod +x test-edge-function.sh
./test-edge-function.sh

# Or manually with curl
curl -X POST https://pkjigvacvddcnlxhvvba.supabase.co/functions/v1/send-contact-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBramlndmFjdmRkY25seGh2dmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMjkzNDIsImV4cCI6MjA3NjcwNTM0Mn0.7OVF6Dbe6ByyU0rVDUXOHwUD3ZgkoQUI-7DxVDr5K8Y" \
  -d '{
    "name": "Test User",
    "email": "marcelo@monynha.com",
    "message": "Testing the edge function!"
  }'
```

**Expected Success Response:**
```json
{
  "success": true,
  "emailId": "re_abc123...",
  "message": "Email sent successfully"
}
```

### 4️⃣ Verify Email Sending Domain

In Resend, you need a verified sending domain:

1. Go to https://resend.com/domains
2. Either:
   - **Option A**: Verify `monynha.com` by adding DNS records
   - **Option B**: Use Resend's test domain `onboarding@resend.dev` for testing

If using test domain, update the Edge Function secret:
```bash
supabase secrets set CONTACT_EMAIL_FROM=onboarding@resend.dev
```

## Troubleshooting

### Error: "Email service not configured"
- **Cause**: `RESEND_API_KEY` not set in Supabase
- **Solution**: Follow Step 2 above

### Error: "Invalid JWT"
- **Cause**: Wrong API key in Authorization header
- **Solution**: Use Supabase anon key (not Resend key) in Authorization header
- **Correct**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Supabase key)
- **Wrong**: `Bearer re_VUmH6mTe_NSsCiB2JpMeCX77jqWYr6Do1` (Resend key)

### Error: "Failed to send email"
- **Cause**: Sending domain not verified in Resend
- **Solution**: Verify domain or use `onboarding@resend.dev`

### Error: "Missing required fields"
- **Cause**: Request missing name, email, or message
- **Solution**: Ensure all required fields are in request body

## Architecture Clarification

```
┌─────────────────────────────────────────────────────────────┐
│                     Contact Form Flow                        │
└─────────────────────────────────────────────────────────────┘

1. User submits form
   ↓
2. Frontend calls submitContactLead()
   ↓
3. Try: INSERT into public.leads (with Supabase anon key)
   ├─ ✅ Success → Show success message
   └─ ❌ Fail → Call Edge Function (with Supabase anon key)
              ↓
              Edge Function uses RESEND_API_KEY (from secrets)
              to send email via Resend API
              ├─ ✅ Email sent → Show email confirmation
              └─ ❌ Email failed → Show error

┌─────────────────────────────────────────────────────────────┐
│                      Key Differences                         │
└─────────────────────────────────────────────────────────────┘

Supabase Anon Key:
  • Used in: Authorization header when calling Edge Functions
  • Type: JWT token (long)
  • Where: Client-side code, curl commands
  • Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Resend API Key:
  • Used in: Edge Function environment (server-side)
  • Type: Resend key (re_xxxx)
  • Where: Supabase secrets (never in client code)
  • Example: re_VUmH6mTe_NSsCiB2JpMeCX77jqWYr6Do1
```

## Next Steps

1. ✅ Set `RESEND_API_KEY` in Supabase secrets
2. ✅ Verify sending domain in Resend (or use test domain)
3. ✅ Test the function with `test-edge-function.sh`
4. ✅ Test the contact form on your website
5. ✅ Check email inbox to confirm delivery

## Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/pkjigvacvddcnlxhvvba
- **Edge Function Settings**: https://supabase.com/dashboard/project/pkjigvacvddcnlxhvvba/settings/functions
- **Resend Dashboard**: https://resend.com/overview
- **Resend API Keys**: https://resend.com/api-keys
- **Resend Domains**: https://resend.com/domains
