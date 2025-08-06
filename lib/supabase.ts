import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgbevojijyhhcicahrvi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY environment variable is required');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for common operations
export const supabaseHelpers = {
  // Get proofs with pagination and filtering
  async getProofs(options: {
    limit?: number;
    offset?: number;
    category?: string;
    ngoId?: string;
    userId?: string;
  } = {}) {
    const { limit = 10, offset = 0, category, ngoId, userId } = options;
    
    let query = supabase
      .from('Proof')
      .select(`
        id,
        title,
        category,
        location,
        tags,
        originalName,
        url,
        createdAt,
        cid,
        proofHash,
        blockchainStatus,
        topicId,
        sequenceNumber,
        user:User(id, name, email, avatar),
        ngo:NGO(id, name, logo)
      `)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }
    if (ngoId) {
      query = query.eq('ngoId', ngoId);
    }
    if (userId) {
      query = query.eq('userId', userId);
    }

    return await query;
  },

  // Get categories
  async getCategories() {
    return await supabase
      .from('Category')
      .select('*')
      .order('totalProofs', { ascending: false });
  },

  // Get NGOs with pagination
  async getNGOs(options: {
    limit?: number;
    offset?: number;
    verified?: boolean;
  } = {}) {
    const { limit = 10, offset = 0, verified } = options;
    
    let query = supabase
      .from('NGO')
      .select(`
        id,
        name,
        description,
        logo,
        website,
        email,
        phone,
        address,
        totalProofs,
        totalMembers,
        totalImpact,
        isVerified,
        verifiedAt,
        createdAt,
        _count:Proof(count)
      `)
      .order('totalProofs', { ascending: false })
      .range(offset, offset + limit - 1);

    if (verified !== undefined) {
      query = query.eq('isVerified', verified);
    }

    return await query;
  },

  // Get single NGO with details
  async getNGO(id: string) {
    return await supabase
      .from('NGO')
      .select(`
        *,
        members:NGOMember(
          role,
          user:User(id, name, email, avatar)
        ),
        proofs:Proof(
          id,
          title,
          category,
          createdAt,
          cid,
          blockchainStatus
        )
      `)
      .eq('id', id)
      .single();
  },

  // Count proofs
  async countProofs(filters: {
    category?: string;
    ngoId?: string;
    userId?: string;
  } = {}) {
    let query = supabase
      .from('Proof')
      .select('*', { count: 'exact', head: true });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.ngoId) {
      query = query.eq('ngoId', filters.ngoId);
    }
    if (filters.userId) {
      query = query.eq('userId', filters.userId);
    }

    const { count } = await query;
    return count || 0;
  }
}; 