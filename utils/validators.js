// Validation functions for user-related operations
'use strict';

/**
 * Validate user ID
 * @param {any} id - User ID to validate
 * @returns {object} - { isValid: boolean, error: string|null, value: number|null }
 */
function validateUserId(id) {
    if (id === undefined || id === null) {
        return {
            isValid: false,
            error: 'User ID is required',
            value: null
        };
    }

    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
        return {
            isValid: false,
            error: 'User ID must be a positive integer',
            value: null
        };
    }

    return {
        isValid: true,
        error: null,
        value: userId
    };
}

/**
 * Validate birthday in DD/MM/YYYY format
 * @param {string} birthday - Birthday string to validate
 * @returns {object} - { isValid: boolean, error: string|null, date: Date|null }
 */
function validateBirthday(birthday) {
    if (!birthday || typeof birthday !== 'string') {
        return {
            isValid: false,
            error: 'Please provide a valid date in DD/MM/YYYY format',
            date: null
        };
    }

    // Validate format: DD/MM/YYYY
    const datePattern = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    const match = birthday.match(datePattern);

    if (!match) {
        return {
            isValid: false,
            error: 'Please provide a valid date in DD/MM/YYYY format',
            date: null
        };
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    // Validate that date is real (prevents invalid dates like 31/02/2024)
    const testDate = new Date(year, month - 1, day);

    if (testDate.getFullYear() !== year ||
        (testDate.getMonth() + 1) !== month ||
        testDate.getDate() !== day) {
        return {
            isValid: false,
            error: 'Please provide a valid date in DD/MM/YYYY format',
            date: null
        };
    }

    // Convert to UTC for storage
    const birthdayDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

    // Check for future dates
    if (birthdayDate.getTime() > Date.now()) {
        return {
            isValid: false,
            error: 'Birthday cannot be in the future',
            date: null
        };
    }

    // Check for unreasonably old dates
    const minDate = new Date(Date.UTC(1900, 0, 1));
    if (birthdayDate.getTime() < minDate.getTime()) {
        return {
            isValid: false,
            error: 'Birthday cannot be before year 1900',
            date: null
        };
    }

    return {
        isValid: true,
        error: null,
        date: birthdayDate
    };
}

module.exports = {
    validateUserId,
    validateBirthday
};