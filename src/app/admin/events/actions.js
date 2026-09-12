'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Initialize Supabase client for server actions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function createEvent(formData) {
  // Extract values matching your form inputs
  const title = formData.get('title')
  const category = formData.get('category')
  const event_date = formData.get('event_date')
  const time_schedule = formData.get('time_schedule')
  const venue = formData.get('venue')
  const coordinator = formData.get('coordinator')
  const guest_speaker = formData.get('guest_speaker')
  const description = formData.get('description')
  const registration_url = formData.get('registration_url')
  const banner_image_url = formData.get('banner_image_url')

  // Insert data into the 'events' table we created in Supabase
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        title,
        category,
        event_date,
        time_schedule,
        venue,
        coordinator,
        guest_speaker,
        description,
        registration_url,
        banner_image_url,
      },
    ])

  if (error) {
    console.error('Error inserting event:', error.message)
    return { success: false, error: error.message }
  }

  // Revalidate the public events page so new data appears instantly
  revalidatePath('/events')
  revalidatePath('/')

  return { success: true, data }
}