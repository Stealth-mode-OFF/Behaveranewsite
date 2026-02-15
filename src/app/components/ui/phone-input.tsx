import * as React from 'react';
import { cn } from './utils';
import { ChevronDown, Phone } from 'lucide-react';

/**
 * PhoneInput - Premium phone input with auto-formatting
 * 
 * Features:
 * - Country code selector with flags
 * - Auto-formatting (spaces every 3 digits)
 * - Preset for Czech Republic (+420)
 * - Validates as user types
 * - Accessible and mobile-friendly
 */

export interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
  pattern: RegExp;
  placeholder: string;
  format: (value: string) => string;
}

const COUNTRIES: CountryCode[] = [
  {
    code: 'CZ',
    dialCode: '+420',
    name: 'Česká republika',
    flag: '🇨🇿',
    pattern: /^\d{9}$/,
    placeholder: '777 888 999',
    format: (v) => v.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').trim()
  },
  {
    code: 'SK',
    dialCode: '+421',
    name: 'Slovensko',
    flag: '🇸🇰',
    pattern: /^\d{9}$/,
    placeholder: '901 234 567',
    format: (v) => v.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').trim()
  },
  {
    code: 'DE',
    dialCode: '+49',
    name: 'Německo',
    flag: '🇩🇪',
    pattern: /^\d{10,11}$/,
    placeholder: '170 1234567',
    format: (v) => v.replace(/(\d{3})(\d{7})/, '$1 $2').trim()
  },
  {
    code: 'AT',
    dialCode: '+43',
    name: 'Rakousko',
    flag: '🇦🇹',
    pattern: /^\d{9,10}$/,
    placeholder: '664 1234567',
    format: (v) => v.replace(/(\d{3})(\d{7})/, '$1 $2').trim()
  },
  {
    code: 'PL',
    dialCode: '+48',
    name: 'Polsko',
    flag: '🇵🇱',
    pattern: /^\d{9}$/,
    placeholder: '501 234 567',
    format: (v) => v.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').trim()
  },
  {
    code: 'GB',
    dialCode: '+44',
    name: 'Velká Británie',
    flag: '🇬🇧',
    pattern: /^\d{10}$/,
    placeholder: '7911 123456',
    format: (v) => v.replace(/(\d{4})(\d{6})/, '$1 $2').trim()
  },
  {
    code: 'US',
    dialCode: '+1',
    name: 'USA',
    flag: '🇺🇸',
    pattern: /^\d{10}$/,
    placeholder: '(555) 123-4567',
    format: (v) => v.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3').trim()
  },
];

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  defaultCountry?: string;
  error?: boolean;
  name?: string;
  className?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = '', onChange, onBlur, defaultCountry = 'CZ', error, className, name }, ref) => {
    const [selectedCountry, setSelectedCountry] = React.useState<CountryCode>(
      COUNTRIES.find(c => c.code === defaultCountry) || COUNTRIES[0]
    );
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [localValue, setLocalValue] = React.useState('');
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Parse incoming value
    React.useEffect(() => {
      if (!value) {
        setLocalValue('');
        return;
      }

      // Check if value starts with a dial code
      const country = COUNTRIES.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        const numberPart = value.slice(country.dialCode.length).replace(/\s/g, '');
        setLocalValue(country.format(numberPart));
      } else {
        // Just use the raw value
        const digitsOnly = value.replace(/\D/g, '');
        setLocalValue(selectedCountry.format(digitsOnly));
      }
    }, [value]);

    // Close dropdown on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      // Remove all non-digits
      const digitsOnly = input.replace(/\D/g, '');
      
      // Limit to reasonable length
      const limited = digitsOnly.slice(0, 12);
      
      // Format with spaces
      const formatted = selectedCountry.format(limited);
      setLocalValue(formatted);
      
      // Send full value with dial code
      const fullValue = `${selectedCountry.dialCode} ${formatted}`.trim();
      onChange?.(fullValue);
    }, [selectedCountry, onChange]);

    const handleCountrySelect = (country: CountryCode) => {
      setSelectedCountry(country);
      setIsDropdownOpen(false);
      
      // Re-format with new country
      const digitsOnly = localValue.replace(/\D/g, '');
      const formatted = country.format(digitsOnly);
      setLocalValue(formatted);
      
      // Send updated value
      const fullValue = `${country.dialCode} ${formatted}`.trim();
      onChange?.(fullValue);
    };

    return (
      <div className="relative">
        <div
          className={cn(
            "flex items-center w-full rounded-xl border bg-white transition-all duration-200",
            error 
              ? "border-brand-error/40 focus-within:border-brand-error focus-within:ring-2 focus-within:ring-brand-error/20" 
              : "border-brand-border focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20",
            className
          )}
        >
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3 border-r border-brand-border hover:bg-brand-background-secondary transition-colors rounded-l-xl",
                isDropdownOpen && "bg-brand-background-secondary"
              )}
              aria-label="Select country"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-brand-text-secondary">{selectedCountry.dialCode}</span>
              <ChevronDown className={cn(
                "w-3.5 h-3.5 text-brand-text-muted transition-transform",
                isDropdownOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-brand-border rounded-xl shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-brand-background-secondary transition-colors",
                      selectedCountry.code === country.code && "bg-brand-primary/5 text-brand-primary"
                    )}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-sm font-medium">{country.name}</span>
                    <span className="text-sm text-brand-text-muted">{country.dialCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone Icon */}
          <div className="pl-3">
            <Phone className="w-4 h-4 text-brand-text-muted" />
          </div>

          {/* Input */}
          <input
            ref={ref}
            type="tel"
            name={name}
            value={localValue}
            onChange={handleInputChange}
            onBlur={onBlur}
            placeholder={selectedCountry.placeholder}
            className="flex-1 px-3 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-brand-text-primary placeholder:text-brand-text-muted/50 text-base"
          />
        </div>
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

/**
 * Utility to validate phone with country code
 */
export function validatePhone(value: string): boolean {
  if (!value) return false;
  
  // Extract dial code and number
  const match = value.match(/^(\+\d+)\s*(.*)$/);
  if (!match) return false;
  
  const [, dialCode, numberPart] = match;
  const country = COUNTRIES.find(c => c.dialCode === dialCode);
  
  if (!country) {
    // Unknown country, just check we have some digits
    const digits = numberPart.replace(/\D/g, '');
    return digits.length >= 7;
  }
  
  const digits = numberPart.replace(/\D/g, '');
  return country.pattern.test(digits);
}

/**
 * Get validation rules for react-hook-form
 */
export const phoneValidationRules = {
  required: "Telefon je povinný",
  validate: (value: string) => {
    if (!value) return "Telefon je povinný";
    if (!validatePhone(value)) {
      return "Zadejte platné telefonní číslo";
    }
    return true;
  }
};

export { PhoneInput };
