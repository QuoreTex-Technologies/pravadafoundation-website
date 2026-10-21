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
  instituteName?: string;
  search?: string;
  name?: string;
  electorName?: string;
  booth?: string;
  boothNo?: string;
  partNo?: number | string;
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

export const FALLBACK_OPTIONS: VoterOptionsData = {
  districts: [],
  talukas: [],
  institutes: [],
};

const envApiUrl = (import.meta as any).env?.VITE_API_BASE_URL
  ? `${String((import.meta as any).env.VITE_API_BASE_URL).replace(/\/$/, '')}/api`
  : null;

const BASE_URL_CANDIDATES = [
  '/api', // Vite proxy routes to VITE_API_BASE_URL
  ...(envApiUrl ? [envApiUrl] : []),
  'http://localhost:9056/api',
  'https://api.mishikshak.quore-tex.com/api',
  'http://localhost:3001/api',
];

/** Helper to fetch with timeout and fallback candidates */
async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

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
    'Unknown';

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
    TeacherId: String(item.teacherId || item.id || item.voterId || item.serialNumber || `voter-${fallbackIndex}`),
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
 * When districtId / talukaId is passed: GET /api/public/ec-voters/options?districtId={districtId}&talukaId={talukaId}
 * Returns available districts, talukas, and institutes for filtration
 */
export async function getVoterOptions(
  districtId?: number | string,
  talukaId?: number | string
): Promise<{ options: VoterOptionsData; isLive: boolean }> {
  try {
    const query = new URLSearchParams();
    if (districtId !== undefined && districtId !== null && districtId !== '') {
      query.append('districtId', String(districtId));
    }
    if (talukaId !== undefined && talukaId !== null && talukaId !== '') {
      query.append('talukaId', String(talukaId));
    }
    const queryString = query.toString();
    const endpoint = `/public/ec-voters/options${queryString ? `?${queryString}` : ''}`;
    const res = await apiFetch(endpoint);

    if (!res.ok) {
      console.warn(`[voterApi] /public/ec-voters/options returned status ${res.status}`);
      return { options: FALLBACK_OPTIONS, isLive: false };
    }

    const json = await res.json();
    const data = json.data || json;

    const parseList = (list: any): OptionItem[] => {
      if (!Array.isArray(list)) return [];
      const seen = new Set<string>();
      return list
        .map((item: any, i: number) => {
          if (typeof item === 'string') {
            const trimmed = item.trim();
            // Filter out empty or heavily corrupted strings
            if (!trimmed || /^[\s?._\-0-9\u0080-\uFFFF]{1,4}$/.test(trimmed)) {
              return null;
            }
            if (seen.has(trimmed.toLowerCase())) return null;
            seen.add(trimmed.toLowerCase());
            return { id: trimmed, name: trimmed };
          }
          const id = item.id ?? item.value ?? item.code ?? i;
          const name = item.name ?? item.title ?? item.label ?? String(item);
          return {
            id,
            name,
            districtId: item.districtId ?? item.district_id,
          };
        })
        .filter(Boolean) as OptionItem[];
    };

    const rawDistricts = data.districts || data.districtList || (Array.isArray(data) ? data : []);
    const rawTalukas = data.talukas || data.talukaList || [];
    const rawInstitutes = data.institutes || data.schools || data.schoolList || [];

    const districts = parseList(rawDistricts);
    const talukas = parseList(rawTalukas);
    const institutes = parseList(rawInstitutes);

    return {
      options: {
        districts,
        talukas,
        institutes,
      },
      isLive: true,
    };
  } catch (error) {
    console.warn('[voterApi] Failed to fetch options from live API:', error);
    return { options: FALLBACK_OPTIONS, isLive: false };
  }
}

/**
 * 2. GET /api/public/ec-voters/search
 * Supports electorName, partNo, districtId, talukaId, instituteName, page, size
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
  const instName = params.instituteName || params.institute;
  if (instName && instName.trim()) {
    query.append('instituteName', instName.trim());
  }
  const elector = params.electorName || params.name;
  if (elector && elector.trim()) {
    query.append('electorName', elector.trim());
  }
  const part =
    params.partNo !== undefined && params.partNo !== null && params.partNo !== ''
      ? params.partNo
      : params.boothNo || params.booth;
  if (part !== undefined && part !== null && String(part).trim() !== '') {
    query.append('partNo', String(part).trim());
  }
  if (params.page !== undefined) {
    query.append('page', String(params.page));
  }
  if (params.size !== undefined) {
    query.append('size', String(params.size));
  } else {
    query.append('size', '25');
  }

  const endpoint = `/public/ec-voters/search?${query.toString()}`;

  try {
    const res = await apiFetch(endpoint);
    let json: any = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      const serverMessage = json?.message || `API returned HTTP ${res.status}`;
      throw new Error(serverMessage);
    }

    if (json && json.success === false) {
      throw new Error(json.message || 'Search request was unsuccessful');
    }

    const data = json?.data || json;

    let content: any[] = [];
    let totalElements = 0;
    let totalPages = 1;
    let currentPage = params.page || 0;
    let pageSize = params.size || 25;

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
      pageSize: params.size || 25,
      isLiveApi: false,
      error: error.message || 'API connection failed',
    };
  }
}

/**
 * Helper to search across all districts when no specific district filter is chosen
 */
export async function searchAllDistricts(
  districtIds: (string | number)[],
  page: number = 0,
  pageSizePerDistrict: number = 10
): Promise<SearchVotersApiResponse> {
  if (!districtIds.length) {
    return {
      records: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 0,
      isLiveApi: false,
      error: 'No districts available to search',
    };
  }

  try {
    const promises = districtIds.map((id) =>
      searchEcVoters({
        districtId: id,
        page,
        size: pageSizePerDistrict,
      })
    );
    const results = await Promise.all(promises);
    const records = results.flatMap((r) => r.records);
    const totalElements = results.reduce((sum, r) => sum + r.totalElements, 0);
    const totalPages = Math.ceil(totalElements / (pageSizePerDistrict * districtIds.length)) || 1;

    return {
      records,
      totalElements,
      totalPages,
      currentPage: page,
      pageSize: pageSizePerDistrict * districtIds.length,
      isLiveApi: true,
    };
  } catch (error: any) {
    return {
      records: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: pageSizePerDistrict * districtIds.length,
      isLiveApi: false,
      error: error.message || 'Failed to search all districts',
    };
  }
}
