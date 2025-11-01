#!/bin/bash

# Test script for send-contact-email Edge Function
# Replace the values below with your actual data

SUPABASE_URL="https://pkjigvacvddcnlxhvvba.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBramlndmFjdmRkY25seGh2dmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMjkzNDIsImV4cCI6MjA3NjcwNTM0Mn0.7OVF6Dbe6ByyU0rVDUXOHwUD3ZgkoQUI-7DxVDr5K8Y"

echo "Testing send-contact-email Edge Function..."
echo "URL: ${SUPABASE_URL}/functions/v1/send-contact-email"
echo ""

curl -X POST "${SUPABASE_URL}/functions/v1/send-contact-email" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -d '{
    "name": "Test User",
    "email": "marcelo@monynha.com",
    "message": "Testing the edge function from test script!"
  }'

echo ""
echo "Done!"
