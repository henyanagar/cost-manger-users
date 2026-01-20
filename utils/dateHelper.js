// Date utility functions for handling Israeli date format (DD/MM/YYYY)
'use strict';

/**
 * Format UTC Date object to Israeli date format (DD/MM/YYYY)
 * @param {Date} dateObj - UTC Date object
 * @returns {string} - Date in DD/MM/YYYY format
 */
function formatIsraeliDate(dateObj) {
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getUTCFullYear());

    return `${day}/${month}/${year}`;
}

module.exports = {
    formatIsraeliDate
};