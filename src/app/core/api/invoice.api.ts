import { api } from "./api";

export type InvoiceStatus = "UNPAID" | "PARTIAL" | "PAID" | "CANCELLED";
export type PaymentMethod = "Tiền mặt" | "Chuyển khoản" | "Công nợ";
export type InvoiceType =
  | "Hóa đơn bán lẻ"
  | "Phiếu xuất kho"
  | "Giấy đề nghị thanh toán"
  | "Báo giá";

export interface InvoiceItem {
  productCode?: string;
  name: string;
  property?: string;
  unit?: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Invoice {
  id: string;
  code: string;
  customerName: string;
  taxCode: string | null;
  buyerAddress: string | null;
  buyerPerson: string | null;
  phone: string | null;
  email: string | null;
  accountNo: string | null;
  invoiceDate: string | null;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  paidValue: number;
  debtValue: number;
  paymentMethod: string | null;
  invoiceType: string | null;
  invoiceNote: string | null;
  internalNote: string | null;
  status: InvoiceStatus;
  sourceQuoteId: string | null;
  sourceQuoteCode: string | null;
  createdById: string | null;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetInvoicesParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: InvoiceStatus;
  invoiceType?: string;
  paymentMethod?: string;
  createdById?: string;
  fromDate?: string;
  toDate?: string;
  sortField?: "createdAt" | "invoiceDate" | "grandTotal" | "debtValue";
  sortOrder?: "asc" | "desc";
}

export interface InvoiceListResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateInvoicePayload {
  code?: string;
  customerName: string;
  taxCode?: string;
  buyerAddress: string;
  buyerPerson?: string;
  phone?: string;
  email?: string;
  accountNo?: string;
  invoiceDate?: string;
  paymentMethod?: PaymentMethod;
  invoiceType?: InvoiceType;
  items: InvoiceItem[];
  vatRate?: number;
  paidValue?: number;
  invoiceNote?: string;
  internalNote?: string;
  sourceQuoteId?: string;
  sourceQuoteCode?: string;
}

export type UpdateInvoicePayload = Partial<CreateInvoicePayload>;

export interface ReceivePaymentPayload {
  amount: number;
  note?: string;
}

export const getInvoices = async (
  params?: GetInvoicesParams
): Promise<InvoiceListResponse> => {
  const { data } = await api.get("/invoices", { params });
  return data;
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const { data } = await api.get(`/invoices/${id}`);
  return data;
};

export const createInvoice = async (
  payload: CreateInvoicePayload
): Promise<Invoice> => {
  const { data } = await api.post("/invoices", payload);
  return data;
};

export const updateInvoice = async (
  id: string,
  payload: UpdateInvoicePayload
): Promise<Invoice> => {
  const { data } = await api.patch(`/invoices/${id}`, payload);
  return data;
};

export const receivePayment = async (
  id: string,
  payload: ReceivePaymentPayload
): Promise<Invoice> => {
  const { data } = await api.post(`/invoices/${id}/payment`, payload);
  return data;
};

export const cancelInvoice = async (id: string): Promise<Invoice> => {
  const { data } = await api.patch(`/invoices/${id}/cancel`);
  return data;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  await api.delete(`/invoices/${id}`);
};