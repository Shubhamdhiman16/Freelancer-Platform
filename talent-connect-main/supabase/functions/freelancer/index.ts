import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FreelancerData {
  name: string
  email: string
  phone?: string
  skills?: string[]
  hourly_rate?: number
  experience_years?: number
  bio?: string
  portfolio_url?: string
  availability?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get auth token from header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const freelancerId = pathParts[1] || url.searchParams.get('id')

    console.log(`[Freelancer API] ${req.method} request by user ${user.id}`)

    switch (req.method) {
      case 'GET': {
        if (freelancerId) {
          // Get single freelancer
          const { data, error } = await supabase
            .from('freelancers')
            .select('*')
            .eq('id', freelancerId)
            .single()

          if (error) {
            console.error('Get freelancer error:', error)
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({ data }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // Get all freelancers with optional filters
          const status = url.searchParams.get('status')
          const search = url.searchParams.get('search')
          const limit = parseInt(url.searchParams.get('limit') || '50')
          const offset = parseInt(url.searchParams.get('offset') || '0')

          let query = supabase
            .from('freelancers')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

          if (status) {
            query = query.eq('status', status)
          }

          if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,skills.cs.{${search}}`)
          }

          const { data, error, count } = await query

          if (error) {
            console.error('List freelancers error:', error)
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({ data, count, limit, offset }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      case 'POST': {
        const body: FreelancerData = await req.json()
        
        if (!body.name || !body.email) {
          return new Response(
            JSON.stringify({ error: 'Name and email are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data, error } = await supabase
          .from('freelancers')
          .insert({
            ...body,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) {
          console.error('Create freelancer error:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log(`[Freelancer API] Created freelancer ${data.id}`)
        return new Response(
          JSON.stringify({ data, message: 'Freelancer created successfully' }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PUT': {
        if (!freelancerId) {
          return new Response(
            JSON.stringify({ error: 'Freelancer ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const body: Partial<FreelancerData> = await req.json()

        // Check if user owns this freelancer or is admin
        const { data: existingFreelancer } = await supabase
          .from('freelancers')
          .select('user_id')
          .eq('id', freelancerId)
          .single()

        const { data: userRole } = await supabase.rpc('get_user_role', { _user_id: user.id })

        if (existingFreelancer?.user_id !== user.id && userRole !== 'admin') {
          return new Response(
            JSON.stringify({ error: 'Not authorized to update this freelancer' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data, error } = await supabase
          .from('freelancers')
          .update(body)
          .eq('id', freelancerId)
          .select()
          .single()

        if (error) {
          console.error('Update freelancer error:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log(`[Freelancer API] Updated freelancer ${freelancerId}`)
        return new Response(
          JSON.stringify({ data, message: 'Freelancer updated successfully' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        if (!freelancerId) {
          return new Response(
            JSON.stringify({ error: 'Freelancer ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if user is admin
        const { data: userRole } = await supabase.rpc('get_user_role', { _user_id: user.id })

        if (userRole !== 'admin') {
          return new Response(
            JSON.stringify({ error: 'Only admins can delete freelancers' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error } = await supabase
          .from('freelancers')
          .delete()
          .eq('id', freelancerId)

        if (error) {
          console.error('Delete freelancer error:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log(`[Freelancer API] Deleted freelancer ${freelancerId}`)
        return new Response(
          JSON.stringify({ message: 'Freelancer deleted successfully' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})