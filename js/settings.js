/**
 * Dynamic Portfolio Settings Manager
 * BGS College of Engineering and Technology (BGSCET)
 * Synchronizes custom student settings across all pages via LocalStorage.
 */

const SETTINGS_STORAGE_KEY = 'harshith_portfolio_config_v2';

const DEFAULT_SETTINGS = {
  name: 'Harshith V',
  role: 'AI & Machine Learning Scholar',
  usn: '1BG24CS001',
  branch: 'Artificial Intelligence & Machine Learning',
  section: 'A Section',
  sem: '1st Year / Sem 2',
  college: 'BGS College of Engineering and Technology (BGSCET)',
  email: 'harshithv1512@gmail.com',
  bio: 'First-year engineering scholar specializing in Artificial Intelligence & Machine Learning (AI & ML) at BGS College of Engineering and Technology (BGSCET), exploring intelligent systems, deep neural models, and human-centric engineering.',
  avatar: ''
};

// Retrieve active settings
function getPortfolioSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed reading settings:', e);
    return { ...DEFAULT_SETTINGS };
  }
}

// Save updated settings
function savePortfolioSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    applyPortfolioSettingsToDOM();
    return true;
  } catch (e) {
    console.error('Failed saving settings:', e);
    return false;
  }
}

// Reset to initial defaults
function resetPortfolioSettings() {
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
  applyPortfolioSettingsToDOM();
}

// Automatically inject settings into all matching DOM elements
function applyPortfolioSettingsToDOM() {
  const settings = getPortfolioSettings();

  // Text fields
  document.querySelectorAll('[data-setting]').forEach(el => {
    const key = el.getAttribute('data-setting');
    if (!settings[key]) return;

    if (key === 'email' && el.tagName.toLowerCase() === 'a') {
      el.textContent = settings.email;
      el.setAttribute('href', `mailto:${settings.email}`);
    } else if (key === 'avatar') {
      // Handled in avatar block
    } else {
      el.textContent = settings[key];
    }
  });

  // Avatar Photo handling across all pages
  const avatarWrappers = document.querySelectorAll('.avatar-wrapper');
  avatarWrappers.forEach(wrapper => {
    let img = wrapper.querySelector('.avatar-img');
    const initials = wrapper.querySelector('.avatar-initials');

    if (settings.avatar) {
      if (!img) {
        img = document.createElement('img');
        img.className = 'avatar-img';
        img.alt = `${settings.name} - Profile Photo`;
        wrapper.insertBefore(img, wrapper.firstChild);
      }
      img.src = settings.avatar;
      img.style.display = 'block';
      if (initials) initials.style.display = 'none';
    } else {
      if (img) img.style.display = 'none';
      if (initials) {
        initials.style.display = 'flex';
        // Compute 2-letter monogram
        const names = settings.name.trim().split(' ');
        const monogram = names.length > 1 
          ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
          : (names[0] ? names[0].substring(0, 2).toUpperCase() : 'HV');
        initials.textContent = monogram;
      }
    }
  });
}

// Execute immediately and on DOM Ready
applyPortfolioSettingsToDOM();
document.addEventListener('DOMContentLoaded', applyPortfolioSettingsToDOM);
