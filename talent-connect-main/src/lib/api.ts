import { supabase } from '@/integrations/supabase/client';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
};

// Freelancer API
export const freelancerApi = {
  getAll: async (params?: { status?: string; search?: string; limit?: number; offset?: number }) => {
    const { data, error } = await supabase.functions.invoke('freelancer', {
      method: 'GET',
      body: null,
    });
    
    // Use direct query with RLS instead
    let query = supabase
      .from('freelancers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (params?.status) {
      query = query.eq('status', params.status);
    }
    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    }
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
    }

    const result = await query;
    return { data: result.data, count: result.count, error: result.error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('freelancers')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  create: async (freelancer: {
    name: string;
    email: string;
    phone?: string;
    skills?: string[];
    hourly_rate?: number;
    experience_years?: number;
    bio?: string;
    portfolio_url?: string;
    availability?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('freelancers')
      .insert({ ...freelancer, user_id: user?.id })
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, freelancer: Partial<{
    name: string;
    email: string;
    phone?: string;
    skills?: string[];
    hourly_rate?: number;
    experience_years?: number;
    bio?: string;
    portfolio_url?: string;
    availability?: string;
    status?: string;
  }>) => {
    const { data, error } = await supabase
      .from('freelancers')
      .update(freelancer)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('freelancers')
      .delete()
      .eq('id', id);
    return { error };
  },
};

// Reports API
export const reportsApi = {
  getAll: async (type?: string) => {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    return { data, error };
  },

  create: async (report: {
    title: string;
    description?: string;
    type: string;
    data?: Record<string, unknown>;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    const insertData = {
      title: report.title,
      description: report.description,
      type: report.type,
      data: report.data as any,
      created_by: user?.id,
    };
    const { data, error } = await supabase
      .from('reports')
      .insert(insertData)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    return { error };
  },
};

// Settings API
export const settingsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');
    return { data, error };
  },

  get: async (key: string) => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();
    return { data, error };
  },

  set: async (setting: {
    key: string;
    value: Record<string, unknown>;
    description?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    const upsertData = {
      key: setting.key,
      value: setting.value as any,
      description: setting.description,
      updated_by: user?.id,
    };
    const { data, error } = await supabase
      .from('settings')
      .upsert(upsertData, { onConflict: 'key' })
      .select()
      .single();
    return { data, error };
  },

  delete: async (key: string) => {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);
    return { error };
  },
};

// Admin API
export const adminApi = {
  getUsers: async () => {
    const { data, error } = await supabase.functions.invoke('admin', {
      body: { action: 'get-users' },
    });
    
    if (error) return { data: null, error };
    return { data: data.data, error: null };
  },

  setUserRole: async (userId: string, role: 'admin' | 'user') => {
    const { data, error } = await supabase.functions.invoke('admin', {
      body: { action: 'set-role', userId, role },
    });
    return { data, error };
  },

  getStats: async () => {
    const { data, error } = await supabase.functions.invoke('admin', {
      body: { action: 'get-stats' },
    });
    
    if (error) return { data: null, error };
    return { data: data.data, error: null };
  },
};