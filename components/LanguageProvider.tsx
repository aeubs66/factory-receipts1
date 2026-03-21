'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'ku'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    'sidebar.dashboard': 'Dashboard',
    'sidebar.newReceipt': 'New Receipt',
    'sidebar.myReceipts': 'My Receipts',
    'sidebar.userAccounts': 'User Accounts',
    'sidebar.workers': 'Workers',
    'sidebar.pending': 'Pending',
    'sidebar.allReceipts': 'All Receipts',
    'sidebar.signOut': 'Sign Out',
    'sidebar.account': 'Account',
    'sidebar.settings': 'Settings',
    'admin.dashboard.title': 'Admin Dashboard',
    'admin.dashboard.subtitle': 'Manage and track worker receipts',
    'admin.dashboard.totalReceipts': 'Total Receipts',
    'admin.dashboard.pending': 'Pending',
    'admin.dashboard.approved': 'Approved',
    'admin.dashboard.totalReimbursed': 'Total Reimbursed',
    'admin.dashboard.recentReceipts': 'Recent Receipts',
    'admin.dashboard.newReceipt': 'New Receipt',
    'admin.dashboard.noReceipts': 'No receipts yet.',
    'admin.dashboard.submitOne': 'Submit one!',
    'manager.dashboard.title': 'Manager Dashboard',
    'manager.dashboard.subtitle': 'Review and approve worker reimbursements',
    'manager.dashboard.totalReceipts': 'Total Receipts',
    'manager.dashboard.awaitingReview': 'Awaiting Review',
    'manager.dashboard.approved': 'Approved',
    'manager.dashboard.totalPaidOut': 'Total Paid Out',
    'manager.dashboard.pendingApproval': 'Pending Approval',
    'manager.dashboard.needsAttention': 'Needs attention',
    'manager.dashboard.allReceipts': 'All Receipts',
    'manager.dashboard.noReceipts': 'No receipts submitted yet',
    'manager.rejectReasonPrompt': 'Please enter a reason for rejecting this receipt:',
    'manager.rejectModal.title': 'Reject receipt',
    'manager.rejectModal.label': 'Reason for rejection',
    'manager.rejectModal.placeholder': 'Explain briefly why this receipt is rejected...',
    'manager.rejectModal.cancel': 'Cancel',
    'manager.rejectModal.confirm': 'Reject receipt',
    'receipt.status.pending': 'Pending',
    'receipt.status.approved': 'Approved',
    'receipt.status.rejected': 'Rejected',
    'receipt.worker': 'Worker',
    'receipt.id': 'ID',
    'receipt.managerNotePrefix': 'Manager note:',
    'receipt.viewDetails': 'View Details',
    'receipt.approve': '✓ Approve',
    'receipt.reject': '✗ Reject',
    'modal.title': 'Receipt Details',
    'modal.workerName': 'Worker Name',
    'modal.workerId': 'Worker ID',
    'modal.amount': 'Amount',
    'modal.purchaseDate': 'Purchase Date',
    'modal.itemDescription': 'Item Description',
    'modal.submitted': 'Submitted',
    'modal.managerNoteLabel': 'Manager Note (optional)',
    'modal.managerNotePlaceholder': 'Add a note for the worker...',
    'modal.approveAndPay': '✓ Approve & Pay',
    'modal.reject': '✗ Reject',
    'modal.managerNote': 'Manager Note',
  },
  ku: {
    'sidebar.dashboard': 'داشبۆرد',
    'sidebar.newReceipt': 'وەسڵی نوێ',
    'sidebar.myReceipts': 'وەسڵەکانم',
    'sidebar.userAccounts': 'ھەژماری بەکارهێنەر',
    'sidebar.workers': 'کرێکاران',
    'sidebar.pending': 'لە چاوەڕوانیدا',
    'sidebar.allReceipts': 'ھەموان',
    'sidebar.signOut': 'چوونە دەرەوە',
    'sidebar.account': 'ھەژمار',
    'sidebar.settings': 'ڕێکخستن',
    'admin.dashboard.title': 'داشبۆردی بەڕێوەبەر',
    'admin.dashboard.subtitle': 'بەڕێوەبردنی وەسڵەکانی کرێکاران',
    'admin.dashboard.totalReceipts': 'ژمارەی گشتی وەسڵەکان',
    'admin.dashboard.pending': 'لە چاوەڕوانیدا',
    'admin.dashboard.approved': 'قبوڵکراو',
    'admin.dashboard.totalReimbursed': 'کۆی پارەی گێڕخراو',
    'admin.dashboard.recentReceipts': 'وەسڵەکانی دوا',
    'admin.dashboard.newReceipt': 'وەسڵی نوێ',
    'admin.dashboard.noReceipts': 'ھێشتا وەسڵ نییە.',
    'admin.dashboard.submitOne': 'یەک دابنێ!',
    'manager.dashboard.title': 'داشبۆردی بەڕێوەبەری کار',
    'manager.dashboard.subtitle': 'پیشاندانی و قبوڵکردنی وەسڵەکان',
    'manager.dashboard.totalReceipts': 'ژمارەی گشتی وەسڵەکان',
    'manager.dashboard.awaitingReview': 'چاوەڕوانی پێداچونەوە',
    'manager.dashboard.approved': 'قبوڵکراو',
    'manager.dashboard.totalPaidOut': 'کۆی پارەی دراو',
    'manager.dashboard.pendingApproval': 'چاوەڕوانی قبوڵکردن',
    'manager.dashboard.needsAttention': ' پێویست بە سەرنجە',
    'manager.dashboard.allReceipts': 'ھەموو وەسڵەکان',
    'manager.dashboard.noReceipts': 'ھێشتا ھیچ وەسڵێک نەنێردراوە',
    'manager.rejectReasonPrompt': 'تکایە هۆکاری رەتکردنەوە بنووسە:',
    'manager.rejectModal.title': 'رەتکردنەوەی وەسڵ',
    'manager.rejectModal.label': 'هۆکاری رەتکردنەوە',
    'manager.rejectModal.placeholder': 'کورتە بنووسە بۆچی ئەم وەسڵە رەتکراوە...',
    'manager.rejectModal.cancel': 'پاشگەزبوونەوە',
    'manager.rejectModal.confirm': 'وەسڵەکە رەت بکە',
    'receipt.status.pending': 'چاوەڕوان',
    'receipt.status.approved': 'قبوڵکراو',
    'receipt.status.rejected': 'رەدکراو',
    'receipt.worker': 'کرێکار',
    'receipt.id': 'ناسنامە',
    'receipt.managerNotePrefix': 'تێبینی بەڕێوەبەر:',
    'receipt.viewDetails': 'وردەکاری',
    'receipt.approve': '✓ قبوڵکردن',
    'receipt.reject': '✗ رەتکردنەوە',
    'modal.title': 'وردەکاری وەسڵ',
    'modal.workerName': 'ناوی کرێکار',
    'modal.workerId': 'ناسنامەی کرێکار',
    'modal.amount': 'بڕ',
    'modal.purchaseDate': 'بەرواری کڕین',
    'modal.itemDescription': 'وەسفی کاڵا',
    'modal.submitted': 'کات/بەرواری ناردن',
    'modal.managerNoteLabel': 'تێبینی بەڕێوەبەر (ئارەزوومەند)',
    'modal.managerNotePlaceholder': 'تێبینی بۆ کرێکار بنووسە...',
    'modal.approveAndPay': '✓ قبوڵکردن و پارەدان',
    'modal.reject': '✗ رەتکردنەوە',
    'modal.managerNote': 'تێبینی بەڕێوەبەر',
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('appLanguage') : null
    if (stored === 'en' || stored === 'ku') {
      setLanguageState(stored)
      if (typeof document !== 'undefined') {
        document.documentElement.lang = stored === 'en' ? 'en' : 'ku'
        document.documentElement.dir = stored === 'ku' ? 'rtl' : 'ltr'
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('appLanguage', lang)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'en' ? 'en' : 'ku'
      document.documentElement.dir = lang === 'ku' ? 'rtl' : 'ltr'
    }
  }

  const t = (key: string): string => {
    return translations[language][key] ?? translations.en[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}

