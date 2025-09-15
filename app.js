document.addEventListener('DOMContentLoaded', function() {

// --- STATE & CONSTANTS ---
const DEFAULT_STATE = {
    'brand-primary': '#148aff',
    'brand-secondary': '#b6f702',
    'brand-accent': '#758e2e',
    'font-family': "'Courier New', monospace",
    'font-size-base': '16',
    'letter-spacing': '-1',
    'spacing-unit': '6',
    'border-radius': '8',
    'shadow-y': '10',
    'shadow-blur': '9',
    'shadow-opacity': '0.22',
};
const DARK_THEME_DEFAULTS = {
    '--bg-color': '#212529',
    '--surface-color': '#2c3e50',
    '--text-primary': '#ecf0f1',
    '--text-secondary': '#95a5a6',
    '--border-color': '#495057',
    '--shadow': '0 4px 6px rgba(0, 0, 0, 0.4)'
};

const cssBestPractices = {
    "Typography": [
      {
        "property": "font-family",
        "syntax": "font-family: 'Font Name', fallback, generic-family;",
        "description": "Specifies the font for an element.",
        "values": ["'Helvetica Neue'", "Arial", "sans-serif", "Georgia", "serif"],
        "bestPractice": "Always provide multiple fallback fonts, ending with a generic family name (e.g., 'sans-serif') to ensure compatibility."
      },
      {
        "property": "font-size",
        "syntax": "font-size: <value>;",
        "description": "Sets the size of the font.",
        "values": ["16px", "1.2rem", "1em", "12pt"],
        "bestPractice": "Use relative units like 'rem' for the base font size on the `html` element to make scaling for accessibility and responsiveness easier. Use 'em' for elements that should scale relative to their parent."
      },
      {
        "property": "font-weight",
        "syntax": "font-weight: <value>;",
        "description": "Sets the thickness of font characters.",
        "values": ["normal (400)", "bold (700)", "100", "900"],
        "bestPractice": "Use numeric values (100-900) for finer control if the font supports it. Avoid using 'bold' on text that is already bold."
      },
      {
        "property": "line-height",
        "syntax": "line-height: <value>;",
        "description": "Specifies the height of a line of text.",
        "values": ["normal", "1.5", "24px", "150%"],
        "bestPractice": "Use a unitless value (e.g., '1.5'). This allows the line height to scale proportionally with the font size, preventing unexpected overlaps."
      },
      {
        "property": "color",
        "syntax": "color: <color>;",
        "description": "Sets the color of the text and other foreground elements.",
        "values": ["#333333", "rgb(51, 51, 51)", "hsl(0, 0%, 20%)"],
        "bestPractice": "Use CSS Custom Properties (variables) for your color palette to ensure consistency and make theme updates easy. Ensure high contrast for accessibility (WCAG AA requires 4.5:1 for normal text)."
      },
      {
        "property": "letter-spacing",
        "syntax": "letter-spacing: <value>;",
        "description": "Adjusts the space between characters.",
        "values": ["normal", "0.1em", "1px", "-1px"],
        "bestPractice": "Use subtle adjustments. Extreme values can harm readability. 'em' units are often preferred as they scale with the font size."
      }
    ],
    "Box Model": [
      {
        "property": "margin",
        "syntax": "margin: <top> <right> <bottom> <left>;",
        "description": "Sets the outer space around an element. A spacing system uses a base unit for all margins and paddings.",
        "values": ["10px", "2rem", "auto"],
        "bestPractice": "Establish a base spacing unit (e.g., 8px) and use multiples of it for all margins and paddings to create a consistent visual rhythm."
      },
      {
        "property": "padding",
        "syntax": "padding: <top> <right> <bottom> <left>;",
        "description": "Sets the inner space within an element.",
        "values": ["10px", "2rem"],
        "bestPractice": "Use padding to create space inside an element's border, especially for buttons and containers, to give content breathing room."
      },
      {
        "property": "border-radius",
        "syntax": "border-radius: <value>;",
        "description": "Controls the roundness of corners on elements.",
        "values": ["8px", "50%", "1rem"],
        "bestPractice": "Use consistent border-radius values across your site. A small radius (e.g., 4px-8px) gives a modern, soft feel. Use '50%' for perfect circles."
      },
      {
        "property": "box-sizing",
        "syntax": "box-sizing: <keyword>;",
        "description": "Changes how the total width and height of an element are calculated.",
        "values": ["content-box", "border-box"],
        "bestPractice": "Apply `box-sizing: border-box;` to all elements for a more intuitive box model where padding and border are included in the element's width and height."
      }
    ],
    "Layout": [
      {
        "property": "display",
        "syntax": "display: <keyword>;",
        "description": "Specifies the display behavior of an element.",
        "values": ["block", "inline", "inline-block", "flex", "grid", "none"],
        "bestPractice": "Use 'flex' for one-dimensional layouts (rows or columns) and 'grid' for two-dimensional layouts (rows and columns)."
      },
      {
        "property": "position",
        "syntax": "position: <keyword>;",
        "description": "Specifies the positioning method for an element.",
        "values": ["static", "relative", "absolute", "fixed", "sticky"],
        "bestPractice": "Use 'relative' on a parent container to create a positioning context for 'absolute' children. Use 'sticky' for elements like headers that should scroll part-way."
      }
    ],
    "Effects": [
      {
        "property": "box-shadow",
        "syntax": "box-shadow: <offset-x> <offset-y> <blur-radius> <spread-radius> <color>;",
        "description": "Adds shadow effects around an element's frame.",
        "values": ["10px 5px 5px black", "0 4px 6px rgba(0,0,0,0.1)"],
        "bestPractice": "Use subtle, layered shadows for a more realistic depth effect. Use rgba() for the color to control opacity, which looks more natural than a solid color."
      }
    ]
  };


// --- THEME TOGGLE ---
function updateThemeToggle(theme) {
    const icon = document.querySelector('.theme-toggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    document.querySelector('.theme-toggle span').textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateThemeToggle(newTheme);
    checkOutlineContrast(); // Re-check outline button contrast on theme change
}

/**
 * Applies a given state object to the UI controls and CSS variables.
 * @param {object} state - A state object matching the keys in DEFAULT_STATE.
 */
function applyState(state) {
    // Set input values from the state object
    for (const [key, value] of Object.entries(state)) {
        const input = document.getElementById(key);
        if (input) {
            input.value = value;
        }
    }

    // Trigger all update functions to apply the new theme
    updateColor('brand-primary', state['brand-primary']);
    updateColor('brand-secondary', state['brand-secondary']);
    updateColor('brand-accent', state['brand-accent']);
    updateTypography('font-family', state['font-family']);
    updateTypography('font-size-base', state['font-size-base'] + 'px');
    updateTypography('letter-spacing', state['letter-spacing'] + 'px');
    updateSpacing(state['spacing-unit']);
    updateBorderRadius(state['border-radius'] + 'px');
    updateShadow();

    // Update all display spans for range inputs
    document.querySelectorAll('input[type="range"]').forEach(input => {
        const valueDisplay = document.getElementById(`${input.id}-value`);
        if (valueDisplay) valueDisplay.textContent = input.value + (input.id === 'shadow-opacity' ? '' : 'px');
    });
}
// --- LIVE UPDATE FUNCTIONS ---
function updateColor(variableName, value) {
    document.documentElement.style.setProperty(`--${variableName}`, value);

    // Also update the text input to keep it in sync when loading themes etc.
    const textInput = document.getElementById(`${variableName}-hex`);
    if (textInput) {
        textInput.value = value;
    }

    checkContrast(variableName, value);

    // If the primary color changes, the outline button is affected.
    if (variableName === 'brand-primary') {
        checkOutlineContrast();
    }
}

function updateTypography(property, value) {
    document.documentElement.style.setProperty(`--${property}`, value);
}

function updateSpacing(baseValue) {
    const multipliers = { 'xs': 0.5, 'sm': 1, 'md': 1.875, 'lg': 2.5, 'xl': 3.75 };
    for (const [key, multiplier] of Object.entries(multipliers)) {
        const value = `${baseValue * multiplier}px`;
        document.documentElement.style.setProperty(`--spacing-${key}`, value);
    }
}

function updateBorderRadius(value) {
    document.documentElement.style.setProperty('--border-radius', value);
}

/**
 * Updates the box-shadow based on sidebar controls.
 */
function updateShadow() {
    const y = document.getElementById('shadow-y').value;
    const blur = document.getElementById('shadow-blur').value;
    const opacity = document.getElementById('shadow-opacity').value;

    const shadowValue = `0 ${y}px ${blur}px rgba(0, 0, 0, ${opacity})`;
    document.documentElement.style.setProperty('--shadow', shadowValue);
}

// --- ACCESSIBILITY ---

/**
 * Parses a hex color string into an {r, g, b} object.
 * @param {string} hex The hex color string.
 * @returns {{r: number, g: number, b: number}|null}
 */
function parseColor(hex) {
    if (hex.startsWith('#')) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    if (hex.length === 6) {
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
        };
    }
    return null; // Invalid color format
}

/**
 * Calculates the relative luminance of a color based on WCAG standards.
 * @param {{r: number, g: number, b: number}} rgb The RGB color object.
 * @returns {number} The relative luminance (0-1).
 */
function getLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val /= 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0729 * b;
}

/**
 * Calculates the contrast ratio between two colors.
 * @param {{r: number, g: number, b: number}} rgb1
 * @param {{r: number, g: number, b: number}} rgb2
 * @returns {number} The contrast ratio.
 */
function getContrast(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Updates a contrast warning message element.
 * @param {string} elementId The ID of the warning element.
 * @param {boolean} isVisible Whether the warning should be visible.
 * @param {string} message The message to display.
 */
function updateWarning(elementId, isVisible, message = '') {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = message;
        el.classList.toggle('visible', isVisible);
    }
}

/**
 * Generates a detailed HTML report for a given contrast ratio.
 * @param {number} contrast The contrast ratio.
 * @param {string} contextText A short description of what is being compared (e.g., "vs. White Text").
 * @returns {{isFail: boolean, html: string}}
 */
function getContrastReport(contrast, contextText) {
    const levels = colorAndContrastData.accessibilityContrast.levels;
    const aa = levels.find(l => l.level === 'AA (Minimum)');
    const aaa = levels.find(l => l.level === 'AAA (Enhanced)');

    const aaNormalThreshold = parseFloat(aa.normalText);
    const aaLargeThreshold = parseFloat(aa.largeText);
    const aaaNormalThreshold = parseFloat(aaa.normalText);

    const aaNormalPass = contrast >= aaNormalThreshold;
    const aaLargePass = contrast >= aaLargeThreshold;
    const aaaNormalPass = contrast >= aaaNormalThreshold;

    const passIcon = '✓';
    const failIcon = '✕';

    // The overall status is a failure if it doesn't meet the basic AA standard for normal text.
    const isFail = !aaNormalPass;

    let summary = '';
    if (aaaNormalPass) { summary = 'Excellent'; } 
    else if (aaNormalPass) { summary = 'Good'; } 
    else if (aaLargePass) { summary = 'Poor'; } 
    else { summary = 'Fail'; }

    const reportHtml = `
        <span class="contrast-context">${contextText}</span>
        <div class="contrast-details">
            <span><strong>${contrast.toFixed(2)}:1</strong> (${summary})</span>
            <div class="contrast-breakdown">
                <span>${aaNormalPass ? passIcon : failIcon} AA</span>
                <span>${aaaNormalPass ? passIcon : failIcon} AAA</span>
            </div>
        </div>`;
    
    return { isFail, html: reportHtml };
}

/**
 * Checks contrast ratio for a specific brand color against white text.
 * @param {string} variableName The CSS variable name (e.g., 'brand-primary').
 * @param {string} colorValue The hex value of the color.
 */
function checkContrast(variableName, colorValue) {
    const colorRgb = parseColor(colorValue);
    if (!colorRgb) return;

    const white = { r: 255, g: 255, b: 255 };
    const contrast = getContrast(colorRgb, white);
    const report = getContrastReport(contrast, 'vs. White Text');

    updateWarning(
        `contrast-warning-${variableName}`,
        report.isFail,
        report.html
    );
}

/**
 * Checks contrast for all brand colors.
 */
function checkAllBrandColors() {
    checkContrast('brand-primary', document.getElementById('brand-primary').value);
    checkContrast('brand-secondary', document.getElementById('brand-secondary').value);
    checkContrast('brand-accent', document.getElementById('brand-accent').value);
}

/**
 * Checks contrast ratio for the outline button's text against its card background.
 */
function checkOutlineContrast() {
    const primaryColorValue = document.getElementById('brand-primary').value;
    const primaryColorRgb = parseColor(primaryColorValue);
    if (!primaryColorRgb) return;

    // The outline button sits on a card, which uses --surface-color.
    // We use the known values from style.css to avoid timing issues with getComputedStyle.
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const surfaceColorValue = currentTheme === 'dark' ? DARK_THEME_DEFAULTS['--surface-color'] : '#ffffff'; 
    const surfaceColorRgb = parseColor(surfaceColorValue);
    if (!surfaceColorRgb) return;

    const contrast = getContrast(primaryColorRgb, surfaceColorRgb);
    const report = getContrastReport(contrast, 'Outline on Card');

    updateWarning(
        'contrast-warning-outline',
        report.isFail,
        report.html
    );
}

// --- EXPORT AND RESET ---

/**
 * Gathers all current theme settings and triggers a download for a JSON file.
 */
function saveTheme() {
    const themeSettings = { ...DEFAULT_STATE };
    for (const key in themeSettings) {
        themeSettings[key] = document.getElementById(key).value;
    }
    const jsonString = JSON.stringify(themeSettings, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'praximous-theme.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Handles the file input change event to load a theme from a JSON file.
 * @param {Event} event The file input change event.
 */
function loadTheme(event) {
    const file = event.target.files[0];
    if (!file) { return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const themeSettings = JSON.parse(e.target.result);
            applyState(themeSettings);
        } catch (error) {
            console.error("Error loading or parsing theme file:", error);
            alert("Could not load theme. The file might be corrupted or not a valid theme file.");
        }
    };
    reader.readAsText(file);

    // Reset file input so the same file can be loaded again
    event.target.value = '';
}

function resetToDefault() {
    applyState(DEFAULT_STATE);
    // Also hide any open code previews
    document.getElementById('exported-css').style.display = 'none';
    document.getElementById('html-example-code').style.display = 'none';
}

/**
 * IMPROVED EXPORT FUNCTION
 * Generates a complete CSS file content with all variables and themes.
 * @param {boolean} [returnOnly=false] - If true, returns the CSS content instead of triggering a download.
 */
function exportCSS(returnOnly = false) {
    const computedStyle = getComputedStyle(document.documentElement);

    const variableGroups = {
        "Brand Colors": ['--brand-primary', '--brand-secondary', '--brand-accent', '--brand-success', '--brand-warning', '--brand-danger'],
        "Functional Colors": ['--power', '--ground', '--gpio', '--i2c', '--spi', '--uart'],
        "Typography": ['--font-family', '--font-size-base', '--letter-spacing', '--font-weight-normal', '--font-weight-bold'],
        "Spacing": ['--spacing-xs', '--spacing-sm', '--spacing-md', '--spacing-lg', '--spacing-xl'],
        "Layout": ['--border-radius', '--transition', '--shadow']
    };
    const lightThemeVars = ['--bg-color', '--surface-color', '--text-primary', '--text-secondary', '--border-color'];
    const darkThemeVars = DARK_THEME_DEFAULTS;

    let cssContent = `/* Praximous Brand Styles - Generated on ${new Date().toUTCString()} */\n\n`;
    cssContent += ':root {\n';
    
    const appendVariables = (groupTitle, varList) => {
        cssContent += `    /* ${groupTitle} */\n`;
        for (const variable of varList) {
            const value = computedStyle.getPropertyValue(variable).trim();
            cssContent += `    ${variable}: ${value};\n`;
        }
        cssContent += '\n';
    };

    for (const [title, vars] of Object.entries(variableGroups)) {
        appendVariables(title, vars);
    }
    appendVariables("Light Theme (Default)", lightThemeVars);
    cssContent += '}\n\n';

    cssContent += '/* Dark Theme Variables */\n[data-theme="dark"] {\n';
    for (const [variable, value] of Object.entries(darkThemeVars)) {
        cssContent += `    ${variable}: ${value};\n`;
    }
    cssContent += '}\n';

    if (returnOnly) {
        return cssContent;
    }

    const exportElement = document.getElementById('exported-css');
    const htmlExampleElement = document.getElementById('html-example-code');

    if (htmlExampleElement) {
        htmlExampleElement.style.display = 'none';
    }

    exportElement.textContent = cssContent;
    exportElement.style.display = 'block';

    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'praximous-styles.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Shows a basic HTML boilerplate example using the generated styles.
 */
function showHtmlExample() {
    const exampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Site</title>
    
    <!-- 1. Link to the generated stylesheet with your design tokens -->
    <link rel="stylesheet" href="praximous-styles.css">
    
    <!-- Optional: Add Font Awesome for icons if your components use them -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- 2. Define component styles that USE your design tokens. -->
    <!-- In a real project, this would be in your main component stylesheet. -->
    <style>
        /* Base styles */
        body {
            font-family: var(--font-family);
            background-color: var(--bg-color);
            color: var(--text-primary);
            padding: var(--spacing-lg);
            line-height: 1.6;
        }

        /* Card component */
        .card {
            background-color: var(--surface-color);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            padding: var(--spacing-lg);
            max-width: 600px;
            margin: 2rem auto;
        }
        .card-title {
            font-size: 1.5rem;
            font-weight: var(--font-weight-bold);
            margin-bottom: var(--spacing-md);
        }

        /* Button component */
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--spacing-xs); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--border-radius); border: 1px solid; font-weight: var(--font-weight-normal); cursor: pointer; transition: var(--transition); text-decoration: none; }
        .btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary { background-color: var(--brand-primary); border-color: var(--brand-primary); color: white; }
        .btn-secondary { background-color: var(--brand-secondary); border-color: var(--brand-secondary); color: white; }
        .btn-outline { background-color: transparent; border-color: var(--brand-primary); color: var(--brand-primary); }
        .btn-outline:hover { background-color: var(--brand-primary); color: white; }
        .btn-group { display: flex; flex-wrap: wrap; gap: var(--spacing-md); margin-top: var(--spacing-md); }

        /* Alert component */
        .alert { padding: var(--spacing-md); margin-bottom: var(--spacing-md); border: 1px solid var(--border-color); border-left-width: 5px; border-radius: var(--border-radius); display: flex; align-items: center; gap: var(--spacing-sm); background-color: var(--surface-color); }
        .alert-success { border-left-color: var(--brand-success); }
        .alert-success i { color: var(--brand-success); }
    </style>
</head>
<body>

    <!-- 3. Start building with your consistent styles! -->
    <div class="card">
        <h3 class="card-title">Example Card</h3>
        <p>This is a simple example of a card component using the styles you generated. It automatically adapts to light and dark themes because the components are built with your CSS variables.</p>
        
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            Your styles are ready to use!
        </div>

        <div class="btn-group">
            <button class="btn btn-primary">Primary Action</button>
            <button class="btn btn-secondary">Secondary Action</button>
            <button class="btn btn-outline">Outline</button>
        </div>
    </div>

</body>
</html>`;

    const htmlExampleElement = document.getElementById('html-example-code');
    const cssExportElement = document.getElementById('exported-css');

    cssExportElement.style.display = 'none'; // Hide the CSS preview
    htmlExampleElement.textContent = exampleHtml.trim();
    htmlExampleElement.style.display = 'block';
}

/**
 * Generates an SCSS file with all variables.
 */
function exportSCSS() {
    // Hide other output panes for a clean UI state
    document.getElementById('exported-css').style.display = 'none';
    document.getElementById('html-example-code').style.display = 'none';

    const computedStyle = getComputedStyle(document.documentElement);

    const variableGroups = {
        "Brand Colors": ['--brand-primary', '--brand-secondary', '--brand-accent', '--brand-success', '--brand-warning', '--brand-danger'],
        "Functional Colors": ['--power', '--ground', '--gpio', '--i2c', '--spi', '--uart'],
        "Typography": ['--font-family', '--font-size-base', '--letter-spacing', '--font-weight-normal', '--font-weight-bold'],
        "Spacing": ['--spacing-xs', '--spacing-sm', '--spacing-md', '--spacing-lg', '--spacing-xl'],
        "Layout": ['--border-radius', '--transition', '--shadow']
    };

    const lightThemeVars = {
        "Light Theme": ['--bg-color', '--surface-color', '--text-primary', '--text-secondary', '--border-color']
    };

    let scssContent = `// Praximous Brand Styles (SCSS) - Generated on ${new Date().toUTCString()}\n\n`;

    const appendVariables = (groupTitle, varList) => {
        scssContent += `// ${groupTitle}\n`;
        for (const variable of varList) {
            const value = computedStyle.getPropertyValue(variable).trim();
            const scssVarName = variable.substring(2); // from --var to var
            scssContent += `$${scssVarName}: ${value};\n`;
        }
        scssContent += '\n';
    };

    for (const [title, vars] of Object.entries(variableGroups)) {
        appendVariables(title, vars);
    }
    appendVariables("Light Theme (Default)", lightThemeVars["Light Theme"]);

    const blob = new Blob([scssContent], { type: 'text/x-scss' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'praximous-styles.scss';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Generates a self-contained HTML style guide document.
 */
function generateDocs() {
    // Hide other output panes for a clean UI state
    document.getElementById('exported-css').style.display = 'none';
    document.getElementById('html-example-code').style.display = 'none';

    // 1. Get template and clone it
    const template = document.getElementById('style-guide-template');
    if (!template) {
        console.error('Style guide template not found!');
        return;
    }
    const clone = template.content.cloneNode(true);

    // 2. Gather data
    const computedStyle = getComputedStyle(document.documentElement);
    const getVar = (name) => computedStyle.getPropertyValue(name).trim();
    const brandColors = { 'Primary': getVar('--brand-primary'), 'Secondary': getVar('--brand-secondary'), 'Accent': getVar('--brand-accent'), 'Success': getVar('--brand-success'), 'Warning': getVar('--brand-warning'), 'Danger': getVar('--brand-danger') };
    const spacing = { 'xs': getVar('--spacing-xs'), 'sm': getVar('--spacing-sm'), 'md': getVar('--spacing-md'), 'lg': getVar('--spacing-lg'), 'xl': getVar('--spacing-xl') };

    // 3. Inject dynamic content into the clone
    clone.querySelector('[data-placeholder="generation-date"]').textContent = new Date().toUTCString();

    const colorGrid = clone.querySelector('[data-placeholder="color-grid"]');
    colorGrid.innerHTML = Object.entries(brandColors).map(([name, value]) => `
        <div>
            <div class="color-swatch" style="background-color: ${value};">
                ${name}
            </div>
            <code>${value}</code>
        </div>
    `).join('');

    clone.querySelector('[data-placeholder="font-family"]').textContent = getVar('--font-family');
    clone.querySelector('[data-placeholder="font-size"]').textContent = getVar('--font-size-base');
    clone.querySelector('[data-placeholder="letter-spacing"]').textContent = getVar('--letter-spacing');

    const spacingDemos = clone.querySelector('[data-placeholder="spacing-demos"]');
    spacingDemos.innerHTML = Object.entries(spacing).map(([name, value]) => `
        <div class="spacing-demo">
            <div class="spacing-block" style="width: ${value}; height: ${value};"></div>
            <code>--spacing-${name}</code> (${value})
        </div>
    `).join('');

    clone.querySelector('[data-placeholder="border-radius"]').textContent = getVar('--border-radius');
    clone.querySelector('[data-placeholder="shadow"]').textContent = getVar('--shadow');

    // 4. Inject CSS into the <style> tag
    const cssVariableContent = exportCSS(true);
    const componentCss = `
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--spacing-xs); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--border-radius); border: 1px solid; font-weight: var(--font-weight-normal); cursor: pointer; transition: var(--transition); text-decoration: none; }
        .btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary { background-color: var(--brand-primary); border-color: var(--brand-primary); color: white; }
        .btn-secondary { background-color: var(--brand-secondary); border-color: var(--brand-secondary); color: white; }
        .btn-outline { background-color: transparent; border-color: var(--brand-primary); color: var(--brand-primary); }
        .btn-outline:hover { background-color: var(--brand-primary); color: white; }
        .alert { padding: var(--spacing-md); margin-bottom: var(--spacing-md); border: 1px solid var(--border-color); border-left-width: 5px; border-radius: var(--border-radius); display: flex; align-items: center; gap: var(--spacing-sm); background-color: var(--surface-color); }
        .alert:last-child { margin-bottom: 0; }
        .alert i { font-size: 1.2em; }
        .alert-success { border-left-color: var(--brand-success); }
        .alert-success i { color: var(--brand-success); }
        .alert-warning { border-left-color: var(--brand-warning); }
        .alert-warning i { color: var(--brand-warning); }
        .alert-danger { border-left-color: var(--brand-danger); }
        .alert-danger i { color: var(--brand-danger); }
    `;
    const styleTag = clone.querySelector('style');
    styleTag.textContent = cssVariableContent + '\n' + componentCss + '\n' + styleTag.textContent;

    // 5. Get final HTML and trigger download
    const finalHtml = '<!DOCTYPE html>\n' + clone.querySelector('html').outerHTML;
    const blob = new Blob([finalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'style-guide.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- PRO FEATURES ---
/**
 * Opens the Pro features modal.
 */
function showProFeatures() {
    const modal = document.getElementById('pro-modal');
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * Closes the Pro features modal.
 */
function closeProModal() {
    const modal = document.getElementById('pro-modal');
    modal.classList.remove('visible');
    document.body.style.overflow = ''; // Restore scrolling
}

// --- HELP TOOLTIPS ---
/**
 * Initializes the help icon tooltips in the sidebar.
 */
function initializeHelpTooltips() {
    const tooltip = document.getElementById('help-tooltip');
    if (!tooltip) return;
    
    let hideTimeout;

    const findPropertyInfo = (propName) => {
        for (const category in cssBestPractices) {
            const found = cssBestPractices[category].find(p => p.property === propName);
            if (found) return found;
        }
        return null;
    };

    document.querySelectorAll('.help-icon').forEach(icon => {
        icon.addEventListener('mouseenter', (event) => {
            clearTimeout(hideTimeout);
            const propName = icon.dataset.property;
            let content = '';

            if (propName === 'color') {
                const primaryRole = colorAndContrastData.uiColorRoles.find(r => r.role === 'Primary');
                const contrastInfo = colorAndContrastData.accessibilityContrast;
                content = `
                    <h4>UI Color Roles & Contrast</h4>
                    <p><strong>${primaryRole.role}:</strong> ${primaryRole.description}</p>
                    <hr style="margin: var(--spacing-xs) 0; border-color: var(--border-color); border-top: 1px solid var(--border-color);">
                    <p><strong>${contrastInfo.name}:</strong> ${contrastInfo.description}</p>
                    <p><strong>Best Practice:</strong> ${contrastInfo.bestPractice}</p>
                `;
            } else {
                const info = findPropertyInfo(propName);
                if (info) {
                    content = `
                        <h4>${info.property}</h4>
                        <p>${info.description}</p>
                        <hr style="margin: var(--spacing-xs) 0; border-color: var(--border-color); border-top: 1px solid var(--border-color);">
                        <p><strong>Best Practice:</strong> ${info.bestPractice}</p>
                    `;
                }
            }

            if (content) {
                tooltip.innerHTML = content;
                const rect = icon.getBoundingClientRect();
                tooltip.style.display = 'block';
                // Position it to the right of the icon, with a small gap
                tooltip.style.left = `${rect.right + 5 + window.scrollX}px`;
                // Center it vertically with the icon
                tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2) + window.scrollY}px`;

                // Check if it goes off-screen on the right and flip it to the left if it does
                if (tooltip.offsetLeft + tooltip.offsetWidth > window.innerWidth - 10) { // 10px buffer
                    tooltip.style.left = `${rect.left - tooltip.offsetWidth - 5 + window.scrollX}px`;
                }
            }
        });

        icon.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                tooltip.style.display = 'none';
            }, 200);
        });
    });

    tooltip.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
    });

    tooltip.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}

/**
 * Initializes two-way data binding for color pickers and their text inputs.
 */
function initializeColorPickers() {
    ['brand-primary', 'brand-secondary', 'brand-accent'].forEach(id => {
        const colorInput = document.getElementById(id);
        const textInput = document.getElementById(`${id}-hex`);

        if (!colorInput || !textInput) return;

        // Sync from color picker to text input
        colorInput.addEventListener('input', () => {
            const newValue = colorInput.value;
            textInput.value = newValue;
            updateColor(id, newValue);
        });

        // Sync from text input to color picker
        textInput.addEventListener('input', () => {
            const newValue = textInput.value;
            if (/^#([0-9a-f]{3}){1,2}$/i.test(newValue)) {
                colorInput.value = newValue;
                updateColor(id, newValue);
            }
        });
    });
}

// --- EVENT LISTENERS & INITIALIZATION ---

const sidebar = document.querySelector('.sidebar');
if (sidebar) {
    sidebar.addEventListener('input', (event) => {
        const input = event.target;
        const id = input.id;
        const value = input.value;

        // Update the text display for range inputs
        const valueDisplay = document.getElementById(`${id}-value`);
        if (input.type === 'range' && valueDisplay) {
            const suffix = (id === 'shadow-opacity') ? '' : 'px';
            valueDisplay.textContent = value + suffix;
        }

        // Call the appropriate update function based on the input's ID
        switch (id) {
            case 'font-family':
                updateTypography(id, value);
                break;
            case 'font-size-base':
                updateTypography(id, value + 'px');
                break;
            case 'letter-spacing':
                updateTypography(id, value + 'px');
                break;
            case 'spacing-unit':
                updateSpacing(value);
                break;
            case 'border-radius':
                updateBorderRadius(value + 'px');
                break;
            case 'shadow-y':
            case 'shadow-blur':
            case 'shadow-opacity':
                updateShadow();
                break;
        }
    });
}

document.body.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;

    const action = actionTarget.dataset.action;
    const actionMap = {
        'toggle-theme': toggleTheme,
        'show-pro-modal': showProFeatures,
        'close-pro-modal': closeProModal,
        'save-theme': saveTheme,
        'reset-theme': resetToDefault,
        'export-css': exportCSS,
        'export-scss': exportSCSS,
        'generate-docs': generateDocs,
        'show-html-example': showHtmlExample,
    };

    if (actionMap[action]) {
        actionMap[action]();
    }
});

document.getElementById('load-theme-input').addEventListener('change', loadTheme);
document.getElementById('pro-modal').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeProModal();
});

applyState(DEFAULT_STATE);
initializeHelpTooltips();
initializeColorPickers();
});