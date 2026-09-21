const availableThemes = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 
  'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 
  'halloween', 'garden', 'forest', 'aqua', 'lofi', 
  'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 
  'dracula', 'cmyk', 'autumn', 'business', 'acid', 
  'lemonade', 'night', 'coffee', 'winter', 'dim', 
  'nord', 'sunset', 'caramellatte', 'abyss', 'silk'
];

export function populateThemes(){
  const themeList = document.getElementById("themeList");
  const currentTheme = loadTheme();

  themeList.innerHTML = availableThemes.map(item => `
    <li><button name="theme-dropdown" class="w-full btn btn-sm btn-block btn-ghost justify-start" value="${item}" />${item}${item === currentTheme? ' <i class="bi bi-check2"></i>' : ''}</button></li>
  `).join('');

  themeList.querySelectorAll('li').forEach(li => {
    li.querySelector('button').addEventListener('click', saveTheme)
  });
}

function loadTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme)
  return theme;
}

function saveTheme() {
  document.documentElement.setAttribute('data-theme', this.value)
  localStorage.setItem('theme', this.value);
  populateThemes();
}