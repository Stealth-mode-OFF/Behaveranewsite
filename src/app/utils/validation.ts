/**
 * Form Validation Rules & Utilities
 * Centralized validation patterns for consistent form behavior across the site
 */

import type { RegisterOptions } from 'react-hook-form';

/**
 * Standard email validation pattern
 * Accepts any format with @ and domain
 */
export const EMAIL_PATTERN = /^\S+@\S+$/i;

/**
 * Work email validation pattern
 * Rejects common free email providers (gmail, yahoo, seznam, etc.)
 */
export const WORK_EMAIL_PATTERN = /^(?!.*@(gmail|yahoo|outlook|hotmail|live|seznam|email\.cz|centrum\.cz|icloud|atlas\.cz|volny\.cz|post\.cz)\.).+@.+\..+$/i;

/**
 * Czech phone number validation pattern
 * Accepts formats:
 * - 777888999
 * - 777 888 999
 * - +420777888999
 * - +420 777 888 999
 */
export const CZECH_PHONE_PATTERN = /^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

/**
 * Blocked free email domains for work email validation
 */
export const FREE_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'seznam.cz',
  'email.cz',
  'centrum.cz',
  'icloud.com',
  'atlas.cz',
  'volny.cz',
  'post.cz'
];

/**
 * Validation rules for react-hook-form
 * Use these with register() or Controller rules prop
 */
export const validationRules = {
  /**
   * Standard email validation
   * Use for: Newsletter, general lead capture
   */
  email: {
    required: "Email je povinný",
    pattern: {
      value: EMAIL_PATTERN,
      message: "Zadejte platný email"
    }
  } as RegisterOptions,

  /**
   * Work email validation (rejects free providers)
   * Use for: Demo requests, consultation booking, gated content
   */
  workEmail: {
    required: "Email je povinný",
    pattern: {
      value: WORK_EMAIL_PATTERN,
      message: "Zadejte firemní email (ne gmail, seznam...)"
    }
  } as RegisterOptions,

  /**
   * Czech phone number validation
   * Use for: Demo requests, consultation booking
   */
  czechPhone: {
    required: "Telefon je povinný",
    pattern: {
      value: CZECH_PHONE_PATTERN,
      message: "Zadejte platné číslo (např. +420 777 888 999)"
    }
  } as RegisterOptions,

  /**
   * Optional name field
   */
  name: {
    minLength: {
      value: 2,
      message: "Jméno musí mít alespoň 2 znaky"
    },
    maxLength: {
      value: 100,
      message: "Jméno je příliš dlouhé"
    }
  } as RegisterOptions,

  /**
   * Required text field (generic)
   */
  requiredText: {
    required: "Toto pole je povinné",
    minLength: {
      value: 1,
      message: "Pole nemůže být prázdné"
    }
  } as RegisterOptions,

  /**
   * Optional company name
   */
  company: {
    minLength: {
      value: 2,
      message: "Název společnosti musí mít alespoň 2 znaky"
    },
    maxLength: {
      value: 200,
      message: "Název společnosti je příliš dlouhý"
    }
  } as RegisterOptions,
};

/**
 * Utility function to check if email is from a free provider
 * Useful for client-side warnings or custom validation logic
 */
export function isFreeEmailProvider(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return FREE_EMAIL_DOMAINS.includes(domain);
}

/**
 * Format Czech phone number to standard display format
 * Input: "777888999" or "+420777888999"
 * Output: "+420 777 888 999"
 */
export function formatCzechPhone(phone: string): string {
  // Remove all spaces and +420 prefix
  const cleaned = phone.replace(/\s/g, '').replace(/^\+420/, '');
  
  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(cleaned)) {
    return phone; // Return original if invalid
  }
  
  // Format as +420 777 888 999
  return `+420 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
}

/**
 * Normalize phone number for backend submission
 * Removes spaces, ensures +420 prefix
 * Input: "777 888 999" or "+420 777 888 999"
 * Output: "+420777888999"
 */
export function normalizeCzechPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+420')) {
    return cleaned;
  }
  return `+420${cleaned}`;
}

/**
 * Validation error messages
 * Centralized for consistency across all forms
 */
export const validationMessages = {
  // Email
  emailRequired: "Email je povinný",
  emailInvalid: "Zadejte platný email",
  workEmailRequired: "Zadejte firemní email (ne gmail, seznam...)",
  
  // Phone
  phoneRequired: "Telefon je povinný",
  phoneInvalid: "Zadejte platné telefonní číslo (např. +420 777 888 999)",
  
  // Generic
  fieldRequired: "Toto pole je povinné",
  fieldTooShort: "Pole je příliš krátké",
  fieldTooLong: "Pole je příliš dlouhé",
  
  // Submission
  submissionError: "Odeslání se nezdařilo. Zkuste to prosím znovu.",
  networkError: "Problém s připojením. Zkontrolujte internet.",
  serverError: "Chyba serveru. Kontaktujte podporu.",
  
  // Success
  submissionSuccess: "Formulář byl úspěšně odeslán",
};

/**
 * Autocomplete attribute mappings
 * Use these for proper browser autofill support
 */
export const autocompleteAttributes = {
  email: "email",
  name: "name",
  firstName: "given-name",
  lastName: "family-name",
  phone: "tel",
  company: "organization",
  role: "organization-title",
  jobTitle: "organization-title",
} as const;
