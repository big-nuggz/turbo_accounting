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

  themeList.innerHTML = availableThemes.map(item => `
    <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="${item}" value="${item}" /></li>
  `).join('');
}