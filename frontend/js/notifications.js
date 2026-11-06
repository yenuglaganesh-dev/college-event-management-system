/**
 * Notifications and UI Helpers - Glassmorphism Theme
 */

const Toast = {
  getContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  },

  show(message, type = 'success', duration = 4000) {
    const container = this.getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'SUCCESS:' : (type === 'error' ? 'ERROR:' : 'INFO:');
    toast.innerHTML = `<span style="font-weight:700; font-size:0.75rem; color:${type==='success'?'#34d399':(type==='error'?'#f87171':'#60a5fa')};">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error', 5000); },
  info(msg) { this.show(msg, 'info'); }
};

window.Toast = Toast;

// Update Header Navigation based on auth state
function updateAuthNavigation() {
  const user = window.Api ? window.Api.getUser() : null;
  const navActions = document.getElementById('navbar-auth-actions');
  if (!navActions) return;

  if (user) {
    let dashboardLink = '/pages/student-dashboard.html';
    let label = 'Dashboard';
    if (user.role === 'ROLE_ADMIN') {
      dashboardLink = '/pages/admin-dashboard.html';
      label = 'Admin Console';
    }

    navActions.innerHTML = `
      <a href="${dashboardLink}" class="btn btn-secondary btn-sm btn-pill">${label}</a>
      <button onclick="handleLogout()" class="btn btn-secondary btn-sm btn-pill" style="color:#f87171;">Sign Out (${user.username || 'User'})</button>
    `;
  } else {
    navActions.innerHTML = `
      <a href="/pages/login.html" class="btn btn-secondary btn-sm btn-pill">Sign In</a>
      <a href="/pages/register.html" class="btn btn-primary btn-sm btn-pill">Sign Up</a>
    `;
  }
}

function handleLogout() {
  if (window.Api) {
    window.Api.clearAuth();
  }
  Toast.info('Logged out successfully');
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 400);
}

// Password visibility toggle helper
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}
window.togglePasswordVisibility = togglePasswordVisibility;

document.addEventListener('DOMContentLoaded', () => {
  updateAuthNavigation();
});
