import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, message } = body;
    
    // Here you would normally send an email using Resend, SendGrid, or store in Supabase
    // For now, we simulate success.
    console.log(`Contact message received from ${firstName} ${lastName} (${email}): ${message}`);

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
