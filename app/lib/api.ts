// API Types
export interface EmailRecord {
  id: number;
  sender_email: string;
  receiver_email: string;
  status: string;
  status_message: string;
  sent_at: string;
  responds: string;
  subject: string | null;
  body: string | null;
  first_name: string;
  company: string;
  created_at: string;
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

export interface FiltersApplied {
  date: string | null;
  receiver_email: string | null;
  sender_email: string | null;
}

export interface EmailListResponse {
  status: number;
  message: string;
  data: {
    records: EmailRecord[];
    pagination: PaginationInfo;
    filters_applied: FiltersApplied;
  };
}

export interface EmailListRequest {
  page: number;
  per_page: number;
  date: string;
}


// API Service
export const emailApi = {
  async getEmails(request: EmailListRequest): Promise<EmailListResponse> {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/';
    console.log('Fetching from:', `${apiBaseUrl}email_send_import/list`);
    console.log('Request payload:', request);
    
    try {
      const response = await fetch(`${apiBaseUrl}email_send_import/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
};
