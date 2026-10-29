/**
 * Utility functions for Sổ Chi Tiêu app
 */

function generateId() {
    // Use crypto.randomUUID if available, fallback to timestamp + random
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString('vi-VN') + ' ₫';
}

function formatDateDisplay(dateStr) {
    // dateStr in YYYY-MM-DD
    if (!dateStr) return '';
    try {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateStr;
    }
}

function getTodayISO() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function validateExpense(data) {
    const errors = [];
    
    if (data.amount === '' || data.amount === null || data.amount === undefined) {
        errors.push('Vui lòng nhập số tiền.');
    } else {
        const amountNum = Number(data.amount);
        if (isNaN(amountNum)) {
            errors.push('Số tiền không hợp lệ.');
        } else if (amountNum < 0) {
            errors.push('Số tiền không được âm.');
        } else if (amountNum === 0) {
            errors.push('Số tiền phải lớn hơn 0.');
        }
    }
    
    if (!data.category || data.category.trim() === '') {
        errors.push('Vui lòng chọn danh mục.');
    }
    
    if (!data.date) {
        errors.push('Vui lòng chọn ngày.');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

window.AppUtils = {
    generateId,
    formatCurrency,
    formatDateDisplay,
    getTodayISO,
    validateExpense
};
