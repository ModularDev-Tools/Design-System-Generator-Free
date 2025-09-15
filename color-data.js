const colorAndContrastData = {
  "colorFormats": [
    {
      "name": "HEX",
      "syntax": "#RRGGBB or #RGB",
      "description": "A hexadecimal representation of an RGB color. The most common format for web design.",
      "values": ["#FFFFFF", "#2c3e50", "#F09"],
      "bestPractice": "Excellent for defining static color palettes. Use the 3-digit shorthand for simple colors when possible (e.g., #F09 instead of #FF0099)."
    },
    {
      "name": "RGB / RGBA",
      "syntax": "rgb(R, G, B) or rgba(R, G, B, A)",
      "description": "Represents a color using Red, Green, and Blue values (0-255). RGBA includes an Alpha channel (0-1) for transparency.",
      "values": ["rgb(44, 62, 80)", "rgba(255, 255, 255, 0.5)"],
      "bestPractice": "Use RGBA when you need to apply transparency to a color without affecting child elements, especially for overlays and backgrounds."
    },
    {
      "name": "HSL / HSLA",
      "syntax": "hsl(H, S%, L%) or hsla(H, S%, L%, A)",
      "description": "Represents a color using Hue (0-360), Saturation (0-100%), and Lightness (0-100%). HSLA adds an Alpha channel for transparency.",
      "values": ["hsl(210, 29%, 24%)", "hsla(210, 29%, 24%, 0.8)"],
      "bestPractice": "This is the best format for programmatically manipulating colors. To create a palette, you can keep the Hue and Saturation constant and only change the Lightness, or vice-versa."
    }
  ],
  "colorRelationships": [
    {
      "name": "Monochromatic",
      "description": "A palette built from a single hue, using various shades, tones, and tints (by varying saturation and lightness).",
      "bestPractice": "Creates a very clean, elegant, and harmonious look. Can be boring if not used carefully. Good for creating depth and order."
    },
    {
      "name": "Analogous",
      "description": "Uses three colors that are adjacent to each other on the color wheel (e.g., green, blue-green, blue).",
      "bestPractice": "Creates a serene and comfortable design. Often found in nature. Choose one color to dominate, a second to support, and a third as an accent."
    },
    {
      "name": "Complementary",
      "description": "Uses two colors that are directly opposite each other on the color wheel (e.g., blue and orange).",
      "bestPractice": "Creates high-contrast and visually stimulating palettes. Can be jarring if not managed well. Ideal for drawing attention to a specific element (like a call-to-action button)."
    },
    {
      "name": "Triadic",
      "description": "Uses three colors that are evenly spaced around the color wheel, forming a triangle.",
      "bestPractice": "Creates vibrant, balanced palettes. It's best to let one color be the dominant one, and use the other two for accents."
    }
  ],
  "uiColorRoles": [
    {
      "role": "Primary",
      "description": "The main brand color. Used most frequently for key UI elements like buttons, active links, and headers.",
      "bestPractice": "Should be a distinct and memorable color that represents the brand. Must have good contrast with white/light text."
    },
    {
      "role": "Secondary",
      "description": "A color that complements the primary color. Used for secondary actions, highlighting information, or as a background color.",
      "bestPractice": "Should work well alongside the primary color without competing for attention. Often an analogous or neutral color."
    },
    {
      "role": "Accent",
      "description": "A color used sparingly to draw attention to a specific element, like a call-to-action (CTA), notification, or special offer.",
      "bestPractice": "This should be the most vibrant color in your palette. Often a complementary or triadic color to the primary."
    },
    {
      "role": "Success",
      "description": "Indicates a successful operation, confirmation, or a positive status.",
      "bestPractice": "Almost always a shade of green, as this is universally understood."
    },
    {
      "role": "Warning",
      "description": "Indicates a potential issue, a caution, or a state that requires user attention.",
      "bestPractice": "Typically a shade of yellow or orange."
    },
    {
      "role": "Danger",
      "description": "Indicates an error, a destructive action (like deleting), or a critical failure.",
      "bestPractice": "Almost always a shade of red."
    }
  ],
  "accessibilityContrast": {
    "name": "WCAG Contrast Ratios",
    "description": "The contrast ratio measures the difference in luminance (brightness) between two colors. The WCAG (Web Content Accessibility Guidelines) provides minimum ratios to ensure text is readable for people with visual impairments.",
    "levels": [
      {
        "level": "AA (Minimum)",
        "normalText": "4.5:1",
        "largeText": "3:1",
        "description": "The most common accessibility standard. This level is achievable for most brand palettes and is the accepted minimum for most websites."
      },
      {
        "level": "AAA (Enhanced)",
        "normalText": "7:1",
        "largeText": "4.5:1",
        "description": "A stricter standard for projects that require maximum readability, such as sites for older audiences or government services. This level can be restrictive on color choices."
      }
    ],
    "bestPractice": "Always test your primary text and background color combinations to meet at least the AA standard. Use your app's contrast checker to provide users with this vital feedback in real-time."
  }
};