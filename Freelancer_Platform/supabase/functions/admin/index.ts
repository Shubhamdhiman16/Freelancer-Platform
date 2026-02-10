import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: userRole } = await supabase.rpc('get_user_role', { _user_id: user.id })
    
    if (userRole !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    const targetUserId = url.searchParams.get('userId')

    console.log(`[Admin API] ${action} request by admin ${user.id}`)

    switch (action) {
      case 'get-users': {
        // Get all users with their profiles and roles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (profilesError) {
          return new Response(
            JSON.stringify({ error: profilesError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get roles for all users
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')

        if (rolesError) {
          return new Response(
            JSON.stringify({ error: rolesError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const rolesMap = roles.reduce((acc: Record<string, string>, r) => {
          acc[r.user_id] = r.role
          return acc
        }, {})

        const usersWithRoles = profiles.map(p => ({
          ...p,
          role: rolesMap[p.user_id] || 'user'
        }))

        return new Response(
          JSON.stringify({ data: usersWithRoles }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'set-role': {
        if (!targetUserId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const body = await req.json()
        const newRole = body.role

        if (!['admin', 'user'].includes(newRole)) {
          return new Response(
            JSON.stringify({ error: 'Invalid role' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update or insert role
        const { error } = await supabase
          .from('user_roles')
          .upsert({
            user_id: targetUserId,
            role: newRole,
          }, { onConflict: 'user_id,role' })

        if (error) {
          // If upsert fails, try update
          const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role: newRole })
            .eq('user_id', targetUserId)

          if (updateError) {
            return new Response(
              JSON.stringify({ error: updateError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        console.log(`[Admin API] Set role ${newRole} for user ${targetUserId}`)
        return new Response(
          JSON.stringify({ message: 'Role updated successfully' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-stats': {
        // Get platform statistics
        const [freelancersRes, reportsRes, usersRes] = await Promise.all([
          supabase.from('freelancers').select('*', { count: 'exact', head: true }),
          supabase.from('reports').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ])

        // Get freelancers by status
        const { data: statusCounts } = await supabase
          .from('freelancers')
          .select('status')

        const statusStats = statusCounts?.reduce((acc: Record<string, number>, f) => {
          acc[f.status] = (acc[f.status] || 0) + 1
          return acc
        }, {}) || {}

        return new Response(
          JSON.stringify({
            data: {
              totalFreelancers: freelancersRes.count || 0,
              totalReports: reportsRes.count || 0,
              totalUsers: usersRes.count || 0,
              freelancersByStatus: statusStats,
            }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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