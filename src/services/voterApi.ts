export interface OptionItem {
  id: number | string;
  name: string;
  districtId?: number | string;
}

export interface VoterOptionsData {
  districts: OptionItem[];
  talukas: OptionItem[];
  institutes: OptionItem[];
}

export interface VoterSearchParams {
  districtId?: number | string;
  talukaId?: number | string;
  taluka?: string;
  schoolId?: number | string;
  institute?: string;
  search?: string;
  name?: string;
  page?: number;
  size?: number;
}

export interface SearchVotersApiResponse {
  records: ApiVoterRecord[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLiveApi: boolean;
  error?: string;
}

export interface ApiVoterRecord {
  TeacherId: string;
  TeacherName: string;
  RelativeName?: string;
  Gender: 'Male' | 'Female' | 'Other';
  Age: number | string;
  EpicNo: string;
  District: string;
  Taluka: string;
  InstituteName: string;
  Address: string;
  SrNo: string | number;
  MobileNumber?: string;
  BoothNo?: string;
  BoothName?: string;
}

// Fallback initial options if API is unreachable
export const FALLBACK_OPTIONS: VoterOptionsData = {
  districts: [
    { id: '32', name: 'Amravati' },
    { id: '33', name: 'Akola' },
    { id: '34', name: 'Buldhana' },
    { id: '35', name: 'Yavatmal' },
    { id: '36', name: 'Washim' },
  ],
  talukas: [
    { id: '101', name: 'Amravati', districtId: '32' },
    { id: '102', name: 'Achalpur', districtId: '32' },
    { id: '103', name: 'Chandurbazar', districtId: '32' },
    { id: '104', name: 'Morshi', districtId: '32' },
    { id: '105', name: 'Warud', districtId: '32' },
    { id: '106', name: 'Daryapur', districtId: '32' },
    { id: '107', name: 'Anjangaon Surji', districtId: '32' },
    { id: '108', name: 'Bhatkuli', districtId: '32' },
    { id: '109', name: 'Tiwsa', districtId: '32' },
    { id: '110', name: 'Nandgaon Khandeshwar', districtId: '32' },
    { id: '111', name: 'Dharni', districtId: '32' },
    { id: '112', name: 'Chikhaldara', districtId: '32' },
    { id: '113', name: 'Dhamangaon Rly', districtId: '32' },

    { id: '201', name: 'Akola', districtId: '33' },
    { id: '202', name: 'Murtizapur', districtId: '33' },
    { id: '203', name: 'Akot', districtId: '33' },
    { id: '204', name: 'Balapur', districtId: '33' },
    { id: '205', name: 'Telhara', districtId: '33' },
    { id: '206', name: 'Patur', districtId: '33' },
    { id: '207', name: 'Barshitakli', districtId: '33' },

    { id: '301', name: 'Buldhana', districtId: '34' },
    { id: '302', name: 'Chikhli', districtId: '34' },
    { id: '303', name: 'Khamgaon', districtId: '34' },
    { id: '304', name: 'Malkapur', districtId: '34' },
    { id: '305', name: 'Shegaon', districtId: '34' },
    { id: '306', name: 'Mehkar', districtId: '34' },
    { id: '307', name: 'Nandura', districtId: '34' },

    { id: '401', name: 'Yavatmal', districtId: '35' },
    { id: '402', name: 'Pusad', districtId: '35' },
    { id: '403', name: 'Digras', districtId: '35' },
    { id: '404', name: 'Umarkhed', districtId: '35' },
    { id: '405', name: 'Darwha', districtId: '35' },
    { id: '406', name: 'Wani', districtId: '35' },

    { id: '501', name: 'Washim', districtId: '36' },
    { id: '502', name: 'Karanja', districtId: '36' },
    { id: '503', name: 'Risod', districtId: '36' },
    { id: '504', name: 'Malegaon', districtId: '36' },
    { id: '505', name: 'Mangrulpir', districtId: '36' },
    { id: '506', name: 'Manora', districtId: '36' },
  ],
  institutes: [],
};

const BASE_URL_CANDIDATES = [
  '/api', // Vite proxy routes to http://localhost:3001
  'http://localhost:3001/api',
];

/** Helper to fetch with timeout and fallback candidates */
async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  let lastError: any = null;

  for (const base of BASE_URL_CANDIDATES) {
    try {
      const url = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: 'application/json, text/plain, */*',
          ...options.headers,
        },
      });

      if (response.ok || response.status < 500) {
        clearTimeout(timeoutId);
        return response;
      }
    } catch (err) {
      lastError = err;
    }
  }

  clearTimeout(timeoutId);
  throw lastError || new Error(`Failed to fetch from ${endpoint}`);
}

/** Map any item shape returned by API into uniform ApiVoterRecord */
export function mapApiVoterToRecord(item: any, fallbackIndex: number): ApiVoterRecord {
  // Normalize gender
  let gender: 'Male' | 'Female' | 'Other' = 'Other';
  const rawGender = String(item.gender || item.Gender || '').toUpperCase();
  if (rawGender === 'M' || rawGender === 'MALE' || rawGender === 'पुरुष') {
    gender = 'Male';
  } else if (rawGender === 'F' || rawGender === 'FEMALE' || rawGender === 'महिला') {
    gender = 'Female';
  }

  const teacherName =
    item.teacherName ||
    item.electorName ||
    item.name ||
    [item.firstName, item.middleName, item.lastName].filter(Boolean).join(' ') ||
    'अज्ञात';

  const districtName =
    (typeof item.district === 'object' ? item.district?.name : item.district) ||
    item.districtName ||
    '';

  const talukaName =
    (typeof item.taluka === 'object' ? item.taluka?.name : item.taluka) ||
    item.talukaName ||
    '';

  const instituteName =
    (typeof item.school === 'object' ? item.school?.name : item.school) ||
    item.instituteName ||
    item.schoolName ||
    item.institute ||
    item.workplaceInstitute ||
    '';

  const address =
    item.address ||
    item.Address ||
    [item.village, talukaName, districtName].filter(Boolean).join(', ') ||
    '—';

  const srNo =
    item.srNo ??
    item.SrNo ??
    item.serialNo ??
    item.serialNumber ??
    (fallbackIndex + 1);

  const epicNo =
    item.epicNo ||
    item.EpicNo ||
    item.voterId ||
    item.epic_no ||
    '—';

  const mobileNumber =
    item.mobileNumber ||
    item.mobile ||
    item.phoneNumber ||
    item.newMobile ||
    '';

  const boothNo =
    item.boothNo ||
    item.BoothNo ||
    (item.partNo ? `Booth ${item.partNo}` : '') ||
    '';

  const boothName =
    item.boothName ||
    item.BoothName ||
    item.school ||
    '';

  return {
    TeacherId: String(item.teacherId || item.id || item.voterId || `voter-${fallbackIndex}`),
    TeacherName: teacherName,
    RelativeName: item.relativeName || item.RelativeName || '',
    Gender: gender,
    Age: item.age || item.Age || '—',
    EpicNo: epicNo,
    District: districtName,
    Taluka: talukaName,
    InstituteName: instituteName,
    Address: address,
    SrNo: srNo,
    MobileNumber: mobileNumber,
    BoothNo: boothNo,
    BoothName: boothName,
  };
}

/**
 * 1. GET /api/public/ec-voters/options
 * Returns available districts, talukas, and schools/institutes for filtration
 */
export async function getVoterOptions(): Promise<{ options: VoterOptionsData; isLive: boolean }> {
  try {
    const res = await apiFetch('/public/ec-voters/options');
    if (!res.ok) {
      console.warn(`[voterApi] /public/ec-voters/options returned status ${res.status}`);
      return { options: FALLBACK_OPTIONS, isLive: false };
    }

    const json = await res.json();
    const data = json.data || json;

    const parseList = (list: any): OptionItem[] => {
      if (!Array.isArray(list)) return [];
      return list.map((item: any, i: number) => {
        if (typeof item === 'string') {
          return { id: item, name: item };
        }
        return {
          id: item.id ?? item.value ?? item.code ?? i,
          name: item.name ?? item.title ?? item.label ?? String(item),
          districtId: item.districtId ?? item.district_id,
        };
      });
    };

    const rawDistricts = data.districts || data.districtList || (Array.isArray(data) ? data : []);
    const rawTalukas = data.talukas || data.talukaList || [];
    const rawInstitutes = data.institutes || data.schools || data.schoolList || [];

    const districts = parseList(rawDistricts);
    const talukas = parseList(rawTalukas);
    const institutes = parseList(rawInstitutes);

    if (districts.length === 0) {
      return { options: FALLBACK_OPTIONS, isLive: true };
    }

    return {
      options: {
        districts,
        talukas: talukas.length > 0 ? talukas : FALLBACK_OPTIONS.talukas,
        institutes,
      },
      isLive: true,
    };
  } catch (error) {
    console.warn('[voterApi] Failed to fetch options from live API, using fallback:', error);
    return { options: FALLBACK_OPTIONS, isLive: false };
  }
}

/**
 * 2. GET /api/public/ec-voters/search?districtId=32
 * Used for filtration and searching data
 */
export async function searchEcVoters(
  params: VoterSearchParams
): Promise<SearchVotersApiResponse> {
  const query = new URLSearchParams();

  if (params.districtId !== undefined && params.districtId !== null && params.districtId !== '') {
    query.append('districtId', String(params.districtId));
  }
  if (params.talukaId !== undefined && params.talukaId !== null && params.talukaId !== '') {
    query.append('talukaId', String(params.talukaId));
  }
  if (params.taluka) {
    query.append('taluka', params.taluka);
  }
  if (params.schoolId !== undefined && params.schoolId !== null && params.schoolId !== '') {
    query.append('schoolId', String(params.schoolId));
  }
  if (params.institute) {
    query.append('institute', params.institute);
  }
  if (params.search) {
    query.append('search', params.search);
  }
  if (params.name) {
    query.append('name', params.name);
  }
  if (params.page !== undefined) {
    query.append('page', String(params.page));
  }
  if (params.size !== undefined) {
    query.append('size', String(params.size));
  } else {
    query.append('size', '50');
  }

  const endpoint = `/public/ec-voters/search?${query.toString()}`;

  try {
    const res = await apiFetch(endpoint);
    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const json = await res.json();
    const data = json.data || json;

    // Handle pagination structures (Spring Page or standard array)
    let content: any[] = [];
    let totalElements = 0;
    let totalPages = 1;
    let currentPage = params.page || 0;
    let pageSize = params.size || 50;

    if (Array.isArray(data)) {
      content = data;
      totalElements = data.length;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.content)) {
        content = data.content;
        totalElements = data.totalElements ?? data.content.length;
        totalPages = data.totalPages ?? 1;
        currentPage = data.number ?? currentPage;
        pageSize = data.size ?? pageSize;
      } else if (Array.isArray(data.records)) {
        content = data.records;
        totalElements = data.total ?? data.records.length;
      } else if (Array.isArray(data.items)) {
        content = data.items;
        totalElements = data.totalCount ?? data.items.length;
      }
    }

    const records = content.map((item, idx) => mapApiVoterToRecord(item, idx));

    return {
      records,
      totalElements,
      totalPages,
      currentPage,
      pageSize,
      isLiveApi: true,
    };
  } catch (error: any) {
    console.warn(`[voterApi] Search failed for ${endpoint}:`, error.message);
    return {
      records: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: params.size || 50,
      isLiveApi: false,
      error: error.message || 'API connection failed',
    };
  }
}
