import i18next from 'i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      books: 'Books',
      authors: 'Authors',
      borrowers: 'Borrowers',
      loans: 'Loans',
      categories: 'Categories',
      // Add more translations as needed
    }
  },
  fr: {
    translation: {
      dashboard: 'Tableau de bord',
      books: 'Livres',
      authors: 'Auteurs',
      borrowers: 'Emprunteurs',
      loans: 'Prêts',
      categories: 'Catégories',
    }
  },
  ar: {
    translation: {
      dashboard: 'لوحة القيادة',
      books: 'الكتب',
      authors: 'المؤلفون',
      borrowers: 'المستعيرون',
      loans: 'الإعارات',
      categories: 'التصنيفات',
    }
  }
};

export async function setupI18n() {
  await i18next.init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

  const languageSelector = document.getElementById('language-selector');
  languageSelector.addEventListener('change', (e) => {
    i18next.changeLanguage(e.target.value);
    updateContent();
  });
}

function updateContent() {
  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = i18next.t(key);
  });
}