/**
 * Main application logic for Sổ Chi Tiêu
 */

let expenses = [];
let editingId = null;
let categoryChart = null;

const expenseForm = document.getElementById('expenseForm');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const noteInput = document.getElementById('note');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formError = document.getElementById('formError');
const expenseListEl = document.getElementById('expenseList');
const emptyState = document.getElementById('emptyState');
const totalAmountEl = document.getElementById('totalAmount');
const totalCountEl = document.getElementById('totalCount');

const monthFilter = document.getElementById('monthFilter');
const monthTotalEl = document.getElementById('monthTotal');
const monthCountEl = document.getElementById('monthCount');
const categoryChartCanvas = document.getElementById('categoryChart');
const chartEmptyEl = document.getElementById('chartEmpty');
const categoryBreakdownEl = document.getElementById('categoryBreakdown');
const exportExcelBtn = document.getElementById('exportExcelBtn');

const CHART_COLORS = [
    '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#64748b'
];

function init() {
    // Set default date to today
    dateInput.value = window.AppUtils.getTodayISO();
    
    // Set default month filter to current month
    if (monthFilter) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        monthFilter.value = `${year}-${month}`;
        monthFilter.addEventListener('change', renderStats);
    }
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }
    
    // Load expenses from storage
    expenses = window.AppStorage.loadExpenses();
    
    // Setup event listeners
    expenseForm.addEventListener('submit', handleFormSubmit);
    cancelEditBtn.addEventListener('click', cancelEdit);
    
    // Initial render
    render();
}

function handleFormSubmit(e) {
    e.preventDefault();
    formError.textContent = '';
    
    const formData = {
        amount: amountInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        note: noteInput.value
    };
    
    const validation = window.AppUtils.validateExpense(formData);
    if (!validation.valid) {
        formError.textContent = validation.errors[0];
        return;
    }
    
    const amountNum = Number(formData.amount);
    
    if (editingId) {
        // Update existing
        const index = expenses.findIndex(item => item.id === editingId);
        if (index !== -1) {
            expenses[index] = {
                ...expenses[index],
                amount: amountNum,
                category: formData.category,
                date: formData.date,
                note: formData.note.trim()
            };
        }
        window.AppStorage.saveExpenses(expenses);
        cancelEdit();
    } else {
        // Add new
        const newExpense = {
            id: window.AppUtils.generateId(),
            amount: amountNum,
            category: formData.category,
            date: formData.date,
            note: formData.note.trim(),
            createdAt: Date.now()
        };
        expenses.unshift(newExpense);
        window.AppStorage.saveExpenses(expenses);
        expenseForm.reset();
        dateInput.value = window.AppUtils.getTodayISO();
    }
    
    render();
}

function render() {
    renderSummary();
    renderList();
    renderStats();
}

function renderSummary() {
    const total = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    totalAmountEl.textContent = window.AppUtils.formatCurrency(total);
    totalCountEl.textContent = expenses.length;
}

function renderList() {
    // Sort by date descending, then by createdAt descending
    const sorted = [...expenses].sort((a, b) => {
        if (b.date !== a.date) {
            return b.date.localeCompare(a.date);
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    
    // Clear list
    expenseListEl.innerHTML = '';
    
    if (sorted.length === 0) {
        emptyState.classList.add('active');
        return;
    }
    
    emptyState.classList.remove('active');
    
    sorted.forEach(item => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.dataset.id = item.id;
        
        const mainDiv = document.createElement('div');
        mainDiv.className = 'expense-main';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'expense-info';
        
        const topDiv = document.createElement('div');
        topDiv.className = 'expense-top';
        
        const categorySpan = document.createElement('span');
        categorySpan.className = 'expense-category';
        categorySpan.textContent = item.category;
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'expense-date';
        dateSpan.textContent = window.AppUtils.formatDateDisplay(item.date);
        
        topDiv.appendChild(categorySpan);
        topDiv.appendChild(dateSpan);
        
        const noteP = document.createElement('p');
        noteP.className = 'expense-note';
        if (item.note && item.note.trim() !== '') {
            noteP.textContent = item.note;
        } else {
            noteP.textContent = '';
            noteP.style.display = 'none';
        }
        
        infoDiv.appendChild(topDiv);
        infoDiv.appendChild(noteP);
        
        const amountSpan = document.createElement('span');
        amountSpan.className = 'expense-amount';
        amountSpan.textContent = '-' + window.AppUtils.formatCurrency(item.amount);
        
        mainDiv.appendChild(infoDiv);
        mainDiv.appendChild(amountSpan);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'expense-actions';
        
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn btn-small btn-edit';
        editBtn.textContent = 'Sửa';
        editBtn.addEventListener('click', () => startEdit(item));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-small btn-delete';
        deleteBtn.textContent = 'Xóa';
        deleteBtn.addEventListener('click', () => deleteExpense(item.id));
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(mainDiv);
        li.appendChild(actionsDiv);
        
        expenseListEl.appendChild(li);
    });
}

function startEdit(item) {
    editingId = item.id;
    
    amountInput.value = item.amount;
    categoryInput.value = item.category;
    dateInput.value = item.date;
    noteInput.value = item.note || '';
    
    formTitle.textContent = 'Sửa khoản chi';
    submitBtn.textContent = 'Cập nhật';
    cancelEditBtn.style.display = 'inline-flex';
    formError.textContent = '';
    
    // Scroll to form
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    amountInput.focus();
}

function cancelEdit() {
    editingId = null;
    
    expenseForm.reset();
    dateInput.value = window.AppUtils.getTodayISO();
    
    formTitle.textContent = 'Thêm khoản chi';
    submitBtn.textContent = 'Thêm khoản chi';
    cancelEditBtn.style.display = 'none';
    formError.textContent = '';
}

function deleteExpense(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa khoản chi này?')) {
        return;
    }
    
    expenses = expenses.filter(item => item.id !== id);
    window.AppStorage.saveExpenses(expenses);
    
    if (editingId === id) {
        cancelEdit();
    }
    
    render();
}

function renderStats() {
    if (!monthFilter || !monthFilter.value) {
        if (categoryChart) {
            categoryChart.destroy();
            categoryChart = null;
        }
        if (chartEmptyEl) chartEmptyEl.style.display = 'block';
        if (categoryBreakdownEl) categoryBreakdownEl.innerHTML = '';
        if (monthTotalEl) monthTotalEl.textContent = '0 ₫';
        if (monthCountEl) monthCountEl.textContent = '0';
        return;
    }
    
    const [filterYear, filterMonth] = monthFilter.value.split('-').map(Number);
    
    const monthExpenses = expenses.filter(item => {
        if (!item.date) return false;
        const [year, month] = item.date.split('-').map(Number);
        return year === filterYear && month === filterMonth;
    });
    
    const monthTotal = monthExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    if (monthTotalEl) monthTotalEl.textContent = window.AppUtils.formatCurrency(monthTotal);
    if (monthCountEl) monthCountEl.textContent = monthExpenses.length;
    
    // Group by category
    const categoryMap = {};
    monthExpenses.forEach(item => {
        const cat = item.category || 'Khác';
        if (!categoryMap[cat]) {
            categoryMap[cat] = 0;
        }
        categoryMap[cat] += Number(item.amount) || 0;
    });
    
    const categories = Object.keys(categoryMap);
    const categoryData = categories.map(cat => categoryMap[cat]);
    
    if (categoryBreakdownEl) {
        categoryBreakdownEl.innerHTML = '';
        categories.slice().sort((a, b) => categoryMap[b] - categoryMap[a]).forEach((cat, idx) => {
            const row = document.createElement('div');
            row.className = 'category-row';
            
            const info = document.createElement('div');
            info.className = 'category-info';
            
            const dot = document.createElement('span');
            dot.className = 'category-dot';
            dot.style.backgroundColor = CHART_COLORS[idx % CHART_COLORS.length];
            
            const name = document.createElement('span');
            name.className = 'category-name';
            name.textContent = cat;
            
            info.appendChild(dot);
            info.appendChild(name);
            
            const amount = document.createElement('span');
            amount.className = 'category-amount';
            amount.textContent = window.AppUtils.formatCurrency(categoryMap[cat]);
            
            row.appendChild(info);
            row.appendChild(amount);
            categoryBreakdownEl.appendChild(row);
        });
    }
    
    if (chartEmptyEl) {
        if (categories.length === 0) {
            chartEmptyEl.style.display = 'block';
        } else {
            chartEmptyEl.style.display = 'none';
        }
    }
    
    if (typeof Chart === 'undefined' || !categoryChartCanvas) {
        return;
    }
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    if (categories.length === 0) {
        return;
    }
    
    categoryChart = new Chart(categoryChartCanvas, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: categoryData,
                backgroundColor: categories.map((_, idx) => CHART_COLORS[idx % CHART_COLORS.length]),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 12,
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return label + ': ' + window.AppUtils.formatCurrency(value) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

function exportToExcel() {
    if (!monthFilter || !monthFilter.value) {
        alert('Vui lòng chọn tháng để xuất dữ liệu.');
        return;
    }
    
    const [filterYear, filterMonth] = monthFilter.value.split('-').map(Number);
    
    const monthExpenses = expenses.filter(item => {
        if (!item.date) return false;
        const [year, month] = item.date.split('-').map(Number);
        return year === filterYear && month === filterMonth;
    });
    
    if (monthExpenses.length === 0) {
        alert('Không có dữ liệu để xuất trong tháng này.');
        return;
    }
    
    // Sort by date
    monthExpenses.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.createdAt || 0) - (b.createdAt || 0);
    });
    
    // CSV with BOM for UTF-8 (Excel Vietnamese support)
    const BOM = '\uFEFF';
    const headers = ['Ngày', 'Danh mục', 'Số tiền (VNĐ)', 'Ghi chú'];
    let csv = BOM + headers.join(',') + '\r\n';
    
    monthExpenses.forEach(item => {
        const date = item.date || '';
        const category = (item.category || '').replace(/,/g, ' ');
        const amount = item.amount || 0;
        const note = (item.note || '').replace(/"/g, '""').replace(/\r?\n/g, ' ');
        
        // Quote fields that may contain commas
        csv += `"${date}","${category}","${amount}","${note}"\r\n`;
    });
    
    // Add total row
    const total = monthExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    csv += `"TỔNG CỘNG","-","${total}",""\r\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `So_Chi_Tieu_${monthFilter.value}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else {
        // Fallback
        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        window.open(csvContent);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
