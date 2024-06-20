export interface CertificationFarmsModel {
  certification_id: string;
  response: ResponseData;
}

export interface ResponseData {
  current_page: number;
  data: Datum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface Datum {
  id: number;
  name: string;
  contact: null | string;
  phone: null | string;
  fax: null | string;
  mobile: null | string;
  email: null | string;
  address: null | string;
  status: number;
  qbid: null;
  seller_id_parent: number;
  grainchain_origin_weight: number;
  source_id: null;
  branch_id: null;
  mstatus: number;
  farms: Farm[];
  showing?: boolean;
  isRotated?: boolean;
}

export interface Farm {
  id: number;
  name: string;
  seller: number;
  address: null | string;
  status: number;
  acres: string;
  active: boolean;
  selected?: boolean;
}
