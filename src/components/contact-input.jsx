"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils.js";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
// Country codes data with flags
const countryCodes = [
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+44", country: "GB", flag: "🇬🇧" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+55", country: "BR", flag: "🇧🇷" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+7", country: "RU", flag: "🇷🇺" },
    { code: "+82", country: "KR", flag: "🇰🇷" },
    { code: "+39", country: "IT", flag: "🇮🇹" },
    { code: "+34", country: "ES", flag: "🇪🇸" },
    { code: "+52", country: "MX", flag: "🇲🇽" },
    { code: "+31", country: "NL", flag: "🇳🇱" },
    { code: "+65", country: "SG", flag: "🇸🇬" },
    { code: "+971", country: "AE", flag: "🇦🇪" },
    { code: "+234", country: "NG", flag: "🇳🇬" },
    { code: "+27", country: "ZA", flag: "🇿🇦" },
    { code: "+966", country: "SA", flag: "🇸🇦" },
    { code: "+235", country: "TD", flag: "🇹🇩" },
    { code: "+255", country: "KE", flag: "🇰🇪" },
    { code: "+213", country: "MA", flag: "🇲🇦" },
    { code: "+261", country: "BW", flag: "🇧🇼" },
];

const countryCodeSet = new Set(countryCodes.map((country) => country.code));
const defaultCountryCode = "+86";

function extractCountryCode(phoneNumber) {
    for (let i = 4; i >= 2; i--) {
        const potentialCode = phoneNumber.substring(0, i);
        if (countryCodeSet.has(potentialCode)) {
            return potentialCode;
        }
    }
      
    return null;
}

function initState(value, inputMode) {
    // If inputMode is set to 'phone', force phone input type
    if (inputMode === 'phone') {
        let countryCode = defaultCountryCode;
        let phoneValue = "";
        
        if (value) {
            countryCode = extractCountryCode(value) || defaultCountryCode;
            phoneValue = countryCode ? value.substring(countryCode.length) : value;
        }
        
        return {
            inputType: "phone",
            phoneValue,
            countryCode,
            emailValue: ""
        };
    }
    
    // If inputMode is set to 'email', force email input type
    if (inputMode === 'email') {
        return {
            inputType: "email",
            phoneValue: "",
            countryCode: defaultCountryCode,
            emailValue: value || ""
        };
    }
    
    // Default behavior (inputMode is 'both' or not specified)
    if (!value) return {
        inputType: "email",
        phoneValue: "",
        countryCode: defaultCountryCode,
        emailValue: ""
    };
    
    if (value.includes('@')) {
        return {
            inputType: "email",
            phoneValue: "",
            countryCode: defaultCountryCode,
            emailValue: value
        };
    } else {
        let countryCode = extractCountryCode(value);
        let phoneValue = value;
        if (countryCode) {
            phoneValue = value.substring(countryCode.length);
        } else {
            countryCode = defaultCountryCode;
        }
        return {
            inputType: "phone",
            phoneValue,
            countryCode,
            emailValue: ""
        };
    }
}

/**
 * ContactInput component that allows input of phone numbers or email addresses
 * @param {Object} props - Component props
 * @param {string} props.name - Input name
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.value - Input value
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.ref - Ref object
 * @param {Function} props.onBlur - Blur event handler
 * @param {'phone'|'email'|'both'} props.inputMode - Restrict input to 'phone', 'email', or 'both' (default)
 */
export function ContactInput({
    name,
    className,
    onChange,
    value,
    disabled,
    placeholder = "Enter phone number or email",
    ref,
    onBlur,
    inputMode = "both",
    ...props}) {
    const [state, setState] = useState(() => initState(value, inputMode));
    // Handle input change
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        
        // If inputMode is 'email', only allow email input
        if (inputMode === 'email' || (inputMode === 'both' && newValue.includes('@'))) {
            setState(prev=> ({
                ...prev,
                inputType: "email",
                emailValue: newValue
            }));
            onChange?.(newValue);
        } 
        // If inputMode is 'phone' or 'both', allow phone input
        else {
            setState(prev=> ({
                ...prev,
                inputType: "phone",
                phoneValue: newValue
            }));
            onChange?.(`${state.countryCode}${newValue}`);
        }
    };

    // Handle country code change
    const handleCountryChange = (newCode) => {
        setState(prev=> ({
            ...prev,
            countryCode: newCode
        }));
        onChange?.(`${newCode}${state.phoneValue}`);
    };

    return (
        <div className={cn("flex w-full space-x-1", className)}>
            {state.inputType === "phone" && (
                <Select
                    value={state.countryCode}
                    onValueChange={handleCountryChange}
                    data-testid="country-code-select"
                >
                    <SelectTrigger className="flex-shrink-0 w-auto">
                        <SelectValue>
                            {countryCodes.find(c => c.code === state.countryCode)?.flag} {state.countryCode}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                                <span className="flex items-center gap-2">
                                    <span>{country.flag}</span>
                                    <span>{country.code}</span>
                                    <span className="text-muted-foreground text-xs">{country.country}</span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            <Input
                ref={ref}
                onBlur={onBlur}
                disabled={disabled}
                value={state.inputType === "phone" ? state.phoneValue : state.emailValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
}

ContactInput.displayName = "ContactInput";
