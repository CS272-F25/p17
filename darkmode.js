
let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

const preferDark = window.matchMedia('(preferes-color-scheme: dark)').matches;

const enableDarkMode = () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('darkmode', 'active');
}

const disableDarkMode = () => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('darkmode', 'inactive');
}

const setSystemTheme = () => {
    if (preferDark) {
        document.documentElement.setAttribute('data-theme', 'dark');  
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkmode', 'system');
}
if (darkmode === 'active') {
    enableDarkMode();
} else if (darkmode === 'inactive') {
    disableDarkMode();
} else {
    setSystemTheme();
}

themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== 'active' ? enableDarkMode() : disableDarkMode()
})