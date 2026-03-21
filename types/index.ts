export type ReceiptStatus = 'pending' | 'approved' | 'rejected'

export interface Receipt {
  id: string
  worker_name: string
  worker_id: string
  item_description: string
  amount: number
  purchase_date: string
  image_url: string | null
  status: ReceiptStatus
  manager_note: string | null
  created_at: string
  updated_at: string
  submitted_by: string // admin user id
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'manager'
  full_name: string
}

export interface ReceiptFormData {
  worker_name: string
  worker_id: string
  item_description: string
  amount: number
  purchase_date: string
  image?: File
}
