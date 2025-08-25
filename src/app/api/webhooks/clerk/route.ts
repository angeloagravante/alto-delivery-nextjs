import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  if (eventType === 'user.created') {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;
    
    console.log('Processing user.created event:', { clerkId, email_addresses, first_name, last_name, image_url });
    
    try {
      // Get the primary email
      const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id);
      
      if (primaryEmail) {
        console.log('Primary email found:', primaryEmail.email_address);
        
        // Create user in database
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
        const email = primaryEmail.email_address.toLowerCase()
        const role = adminEmail && email === adminEmail ? 'ADMIN' : 'CUSTOMER'
        // Admin users should be auto-onboarded
        const onboarded = role === 'ADMIN' ? true : false
        
        const baseData = {
          clerkId: clerkId,
          email: primaryEmail.email_address,
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
          imageUrl: image_url,
        }
        const user = await prisma.user.create({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore Prisma Client types may be stale during build in CI
          data: { ...baseData, role, onboarded },
        })
        
        console.log('✅ User created in database:', user);
      } else {
        console.log('❌ No primary email found in webhook data');
        return new Response('No primary email found', { status: 400 });
      }
    } catch (error) {
      console.error('❌ Error creating user in database:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;
    
    try {
      // Get the primary email
      const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id);
      
      if (primaryEmail) {
        // Update user in database
  const user = await prisma.user.update({
          where: { clerkId: clerkId },
          data: {
            email: primaryEmail.email_address,
            name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
            imageUrl: image_url,
          }
        });
        
        console.log('User updated in database:', user);
      }
    } catch (error) {
      console.error('Error updating user in database:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id: clerkId } = evt.data;
    
    try {
      // Delete user from database
      await prisma.user.delete({
        where: { clerkId: clerkId }
      });
      
      console.log('User deleted from database:', clerkId);
    } catch (error) {
      console.error('Error deleting user from database:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('', { status: 200 })
}
