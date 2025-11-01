import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Deno global is provided by Supabase Edge Runtime
declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: {
    get(key: string): string | undefined;
  };
};

/**
 * Edge Function: send-contact-email
 * 
 * Sends contact form submissions via email when database persistence fails.
 * This function is called as a fallback by the frontend when the direct
 * database insert to public.leads fails.
 * 
 * Environment Variables Required:
 * - RESEND_API_KEY: API key for Resend email service (https://resend.com)
 * - CONTACT_EMAIL_FROM: Sender email address (must be verified in Resend)
 * - CONTACT_EMAIL_TO: Default recipient email (can be overridden in request)
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactEmailPayload {
  name: string;
  email: string;
  message: string;
  company?: string;
  project?: string;
  to?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('CONTACT_EMAIL_FROM') || 'noreply@monynha.com';
    const defaultToEmail = Deno.env.get('CONTACT_EMAIL_TO') || 'marcelo@monynha.com';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      throw new Error('Email service not configured');
    }

    // Parse request body
    const payload: ContactEmailPayload = await req.json();
    
    // Validate required fields
    if (!payload.name || !payload.email || !payload.message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: name, email, message',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Sending contact email from:', payload.email);

    // Determine recipient
    const toEmail = payload.to || defaultToEmail;

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 20px; }
    .label { font-weight: 600; color: #6b7280; text-transform: uppercase; font-size: 12px; margin-bottom: 5px; }
    .value { color: #111827; font-size: 16px; }
    .message { background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; margin-top: 20px; }
    .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">📬 Nova Mensagem de Contato</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">MS-Portfolio Contact Form</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Nome</div>
        <div class="value">${payload.name}</div>
      </div>
      
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${payload.email}" style="color: #667eea;">${payload.email}</a></div>
      </div>
      
      ${payload.company ? `
      <div class="field">
        <div class="label">Empresa</div>
        <div class="value">${payload.company}</div>
      </div>
      ` : ''}
      
      ${payload.project ? `
      <div class="field">
        <div class="label">Projeto</div>
        <div class="value">${payload.project}</div>
      </div>
      ` : ''}
      
      <div class="message">
        <div class="label">Mensagem</div>
        <div class="value">${payload.message.replace(/\n/g, '<br>')}</div>
      </div>
      
      <div class="footer">
        <p>Esta mensagem foi enviada via fallback do formulário de contato.<br>
        O sistema tentou salvar no banco de dados, mas falhou e enviou por email.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Build plain text version
    const emailText = `
Nova Mensagem de Contato - MS-Portfolio

Nome: ${payload.name}
Email: ${payload.email}
${payload.company ? `Empresa: ${payload.company}` : ''}
${payload.project ? `Projeto: ${payload.project}` : ''}

Mensagem:
${payload.message}

---
Esta mensagem foi enviada via fallback do formulário de contato.
    `.trim();

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: payload.email,
        subject: `[MS-Portfolio] Contato de ${payload.name}`,
        html: emailHtml,
        text: emailText,
        tags: [
          {
            name: 'category',
            value: 'contact-form'
          },
          {
            name: 'source',
            value: 'portfolio'
          }
        ]
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', responseData);
      throw new Error(responseData.message || 'Failed to send email');
    }

    console.log('Email sent successfully:', responseData.id);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: responseData.id,
        message: 'Email sent successfully',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in send-contact-email:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
