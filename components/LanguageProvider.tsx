'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
    'sidebar.myExpenses': 'My Expenses',
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
    'admin.history.title': 'My Receipts',
    'admin.history.subtitle': 'Track all your submitted receipts',
    'admin.history.noReceipts': 'No receipts found',
    'admin.new.back': '← Back to Dashboard',
    'admin.new.title': 'Submit New Receipt',
    'admin.new.subtitle': 'Fill in the purchase details and upload the receipt image',
    'admin.new.workerInfo': 'Worker Information',
    'admin.new.worker': 'Worker *',
    'admin.new.selectWorker': 'Select worker...',
    'admin.new.purchaseDetails': 'Purchase Details',
    'admin.new.itemDesc': 'Item Description *',
    'admin.new.amount': 'Amount Paid (IQD) *',
    'admin.new.date': 'Purchase Date *',
    'admin.new.image': 'Receipt Image',
    'admin.new.drop': 'Drop image here or',
    'admin.new.browse': 'click to browse',
    'admin.new.cancel': 'Cancel',
    'admin.new.submit': '📤 Submit Receipt to Manager',
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
    'manager.expense.title': 'Request Expense',
    'manager.expense.subtitle': 'Submit a simple expense to the admin',
    'manager.expense.name': 'Expense Name',
    'manager.expense.namePlaceholder': 'What is this expense for?',
    'manager.expense.amount': 'Amount',
    'manager.expense.currency': 'Currency',
    'manager.expense.note': 'Note (Optional)',
    'manager.expense.notePlaceholder': 'Any additional details...',
    'manager.expense.cancel': 'Cancel',
    'manager.expense.submit': 'Submit Request',
    'manager.expense.submitting': 'Submitting...',
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
    'factory.title': 'Daily Attendance',
    'factory.subtitle': 'Mark workers present or absent for today',
    'factory.present': '✓ Present',
    'factory.absent': '✗ Absent',
    'factory.save': 'Save Attendance',
    'factory.noWorkers': 'No workers assigned for attendance tracking.',
    'factory.settings.title': 'Settings',
    'factory.settings.subtitle': 'Configure how the app behaves.',
    'factory.settings.language': 'Language',
    'factory.settings.languageDesc': 'Choose between English and Kurdish for the interface.',
    'factory.settings.saved': 'Your choice is saved in this browser and will be used the next time you open the app.',
  },
  ku: {
    'sidebar.dashboard': 'داشبۆرد',
    'sidebar.newReceipt': 'وەسڵی نوێ',
    'sidebar.myReceipts': 'وەسڵەکانم',
    'sidebar.myExpenses': 'خەرجییەکانم',
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
    'admin.history.title': 'وەسڵەکانم',
    'admin.history.subtitle': 'هەموو وەصڵە نێردراوەکانت لێرە ببینە',
    'admin.history.noReceipts': 'هیچ وەسڵێک نەدۆزرایەوە',
    'admin.new.back': '← گەڕانەوە بۆ داشبۆرد',
    'admin.new.title': 'ناردنی وەسڵی نوێ',
    'admin.new.subtitle': 'زانیارییەکانی کڕین پڕبکەرەوە و وێنەی وەسڵەکە بەرزبکەرەوە',
    'admin.new.workerInfo': 'زانیاری کرێکار',
    'admin.new.worker': 'کرێکار *',
    'admin.new.selectWorker': 'کرێکار هەڵبژێرە...',
    'admin.new.purchaseDetails': 'وردەکاری کڕین',
    'admin.new.itemDesc': 'وەسفی کاڵا *',
    'admin.new.amount': 'بڕی پارەی دراو (IQD) *',
    'admin.new.date': 'بەرواری کڕین *',
    'admin.new.image': 'وێنەی وەسڵ',
    'admin.new.drop': 'وێنەکە لێرە دابنێ یان',
    'admin.new.browse': 'کرتە بکە بۆ هەڵبژاردن',
    'admin.new.cancel': 'پاشگەزبوونەوە',
    'admin.new.submit': '📤 ناردنی وەسڵ بۆ بەڕێوەبەر',
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
    'manager.expense.title': 'داواکردنی خەرجی',
    'manager.expense.subtitle': 'ناردنی خەرجییەکی سادە بۆ بەڕێوەبەر',
    'manager.expense.name': 'ناوی خەرجی',
    'manager.expense.namePlaceholder': 'ئەم خەرجییە بۆ چییە؟',
    'manager.expense.amount': 'بڕی پارە',
    'manager.expense.currency': 'جۆری دراو',
    'manager.expense.note': 'تێبینی (ئارەزوومەند)',
    'manager.expense.notePlaceholder': 'هەر زانیارییەکی زیاتر...',
    'manager.expense.cancel': 'پاشگەزبوونەوە',
    'manager.expense.submit': 'ناردنی داواکاری',
    'manager.expense.submitting': 'لە ناردندایە...',
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
    'factory.title': 'ئامادەبوونی ڕۆژانە',
    'factory.subtitle': 'کرێکارەکان وەک ئامادەبوو یان غائیب دیاری بکە بۆ ئەمڕۆ',
    'factory.present': '✓ ئامادەیە',
    'factory.absent': '✗ غائیبە',
    'factory.save': 'سەیڤکردن',
    'factory.noWorkers': 'هیچ کرێکارێک دیاری نەکراوە بۆ ئامادەبوون.',
    'factory.settings.title': 'ڕێکخستنەکان',
    'factory.settings.subtitle': 'شێوازی کارکردنی بەرنامەکە ڕێکبخە.',
    'factory.settings.language': 'زمان',
    'factory.settings.languageDesc': 'زمانێک لە نێوان ئینگلیزی و کوردی هەڵبژێرە بۆ ڕووکارەکە.',
    'factory.settings.saved': 'هەڵبژاردنەکەت لەم وێبگەڕەدا پاشەکەوت دەکرێت و بۆ جاری داهاتوو بەکاردێت.',
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  const applyLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'en' ? 'en' : 'ku'
      document.documentElement.dir = lang === 'ku' ? 'rtl' : 'ltr'
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session && typeof window !== 'undefined') {
        const stored = window.localStorage.getItem(`appLanguage_${session.user.id}`)
        if (stored === 'en' || stored === 'ku') {
          applyLanguage(stored)
        } else {
          // Fallback to global if account-specific not found
          const globalStored = window.localStorage.getItem('appLanguage')
          if (globalStored === 'en' || globalStored === 'ku') {
            applyLanguage(globalStored)
          }
        }
      } else if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('appLanguage')
        if (stored === 'en' || stored === 'ku') {
          applyLanguage(stored)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (typeof window === 'undefined') return

      if (event === 'SIGNED_IN' && session) {
        const stored = window.localStorage.getItem(`appLanguage_${session.user.id}`)
        if (stored === 'en' || stored === 'ku') {
          applyLanguage(stored as Language)
        } else {
          // If no specific language for this user, fallback to global or EN
          const globalStored = window.localStorage.getItem('appLanguage')
          applyLanguage((globalStored === 'en' || globalStored === 'ku') ? globalStored as Language : 'en')
        }
      } else if (event === 'SIGNED_OUT') {
        const defaultLang = window.localStorage.getItem('appLanguage') || 'en'
        applyLanguage(defaultLang as Language)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const setLanguage = async (lang: Language) => {
    applyLanguage(lang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('appLanguage', lang) // Global fallback
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        window.localStorage.setItem(`appLanguage_${session.user.id}`, lang)
      }
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

