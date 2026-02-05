/**
 * Pipedrive CRM Integration Service
 * 
 * This service handles lead creation in Pipedrive CRM.
 * Should be called from a backend/edge function to keep API key secure.
 * 
 * Pipedrive API docs: https://developers.pipedrive.com/docs/api/v1
 */

export interface PipedrivePersonInput {
  name: string;
  email: string;
  phone?: string;
  org_id?: number;
  visible_to?: 1 | 3 | 5 | 7; // 1=owner, 3=owner's group, 5=entire company, 7=shared
}

export interface PipedriveDealInput {
  title: string;
  person_id: number;
  org_id?: number;
  value?: number;
  currency?: string;
  stage_id?: number;
  status?: 'open' | 'won' | 'lost' | 'deleted';
}

export interface PipedriveOrganizationInput {
  name: string;
  visible_to?: 1 | 3 | 5 | 7;
}

export interface PipedriveLeadInput {
  title: string;
  person_id?: number;
  organization_id?: number;
  value?: { amount: number; currency: string };
  expected_close_date?: string;
  label_ids?: string[];
}

interface PipedriveResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export class PipedriveService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, companyDomain: string = 'behavera') {
    this.apiKey = apiKey;
    this.baseUrl = `https://${companyDomain}.pipedrive.com/api/v1`;
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: Record<string, unknown>
  ): Promise<PipedriveResponse<T>> {
    const url = `${this.baseUrl}${endpoint}?api_token=${this.apiKey}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Pipedrive API error: ${response.status}`);
    }

    return data;
  }

  /**
   * Search for existing person by email
   */
  async findPersonByEmail(email: string): Promise<{ id: number } | null> {
    try {
      const response = await this.request<{ items: Array<{ item: { id: number } }> }>(
        `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true`
      );
      
      if (response.data.items && response.data.items.length > 0) {
        return { id: response.data.items[0].item.id };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Create a new person (contact)
   */
  async createPerson(input: PipedrivePersonInput): Promise<{ id: number }> {
    const response = await this.request<{ id: number }>('/persons', 'POST', {
      name: input.name,
      email: [input.email],
      phone: input.phone ? [input.phone] : undefined,
      org_id: input.org_id,
      visible_to: input.visible_to || 3,
    });
    
    return { id: response.data.id };
  }

  /**
   * Create a new organization
   */
  async createOrganization(input: PipedriveOrganizationInput): Promise<{ id: number }> {
    const response = await this.request<{ id: number }>('/organizations', 'POST', {
      name: input.name,
      visible_to: input.visible_to || 3,
    });
    
    return { id: response.data.id };
  }

  /**
   * Create a new lead
   */
  async createLead(input: PipedriveLeadInput): Promise<{ id: string }> {
    const response = await this.request<{ id: string }>('/leads', 'POST', {
      title: input.title,
      person_id: input.person_id,
      organization_id: input.organization_id,
      value: input.value,
      expected_close_date: input.expected_close_date,
      label_ids: input.label_ids,
    });
    
    return { id: response.data.id };
  }

  /**
   * Create a new deal
   */
  async createDeal(input: PipedriveDealInput): Promise<{ id: number }> {
    const response = await this.request<{ id: number }>('/deals', 'POST', {
      title: input.title,
      person_id: input.person_id,
      org_id: input.org_id,
      value: input.value,
      currency: input.currency || 'CZK',
      stage_id: input.stage_id,
      status: input.status || 'open',
    });
    
    return { id: response.data.id };
  }

  /**
   * Create complete lead flow: Organization + Person + Lead
   * This is the main method to use for website form submissions
   */
  async createWebsiteLead(data: {
    email: string;
    name?: string;
    phone?: string;
    company?: string;
    source?: string;
    companySize?: string;
    role?: string;
  }): Promise<{ personId: number; leadId?: string; organizationId?: number }> {
    
    // 1. Check if person already exists
    let personId: number;
    const existingPerson = await this.findPersonByEmail(data.email);
    
    if (existingPerson) {
      personId = existingPerson.id;
    } else {
      // 2. Create organization if company name provided
      let organizationId: number | undefined;
      if (data.company) {
        const org = await this.createOrganization({ name: data.company });
        organizationId = org.id;
      }

      // 3. Create person
      const person = await this.createPerson({
        name: data.name || data.email.split('@')[0],
        email: data.email,
        phone: data.phone,
        org_id: organizationId,
      });
      personId = person.id;

      // 4. Create lead
      const leadTitle = data.source 
        ? `[${data.source}] ${data.name || data.email}`
        : `Web Lead: ${data.name || data.email}`;
      
      const lead = await this.createLead({
        title: leadTitle,
        person_id: personId,
        organization_id: organizationId,
      });

      return { personId, leadId: lead.id, organizationId };
    }

    return { personId };
  }
}

/**
 * Factory function to create Pipedrive service
 * Use this in edge functions/API routes
 */
export function createPipedriveService(): PipedriveService | null {
  const apiKey = process.env.PIPEDRIVE_API_KEY;
  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || 'behavera';
  
  if (!apiKey) {
    console.warn('PIPEDRIVE_API_KEY not configured');
    return null;
  }
  
  return new PipedriveService(apiKey, domain);
}
