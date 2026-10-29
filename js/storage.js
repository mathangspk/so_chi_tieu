/**
 * Storage functions for Sổ Chi Tiêu app using localStorage
 */

const STORAGE_KEY = 'so_chi_tieu_items';

function loadExpenses() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        return [];
    } catch (e) {
        console.error('Lỗi khi đọc dữ liệu từ localStorage:', e);
        return [];
    }
}

function saveExpenses(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return true;
    } catch (e) {
        console.error('Lỗi khi lưu dữ liệu vào localStorage:', e);
        return false;
    }
}

window.AppStorage = {
    loadExpenses,
    saveExpenses,
    STORAGE_KEY
};
