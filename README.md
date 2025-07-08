# AutoFlow Studio - Modern Automation Website

A professional, responsive website for an automation services company built with vanilla HTML, CSS, and JavaScript. Features a stunning gradient design, interactive carousel, pricing calculator, and AI chatbot modal.

## 🚀 Live Demo

[View Live Demo](https://your-username.github.io/autoflow-studio) *(Update with your actual URL)*

## ✨ Features

### Design & UX
- **Modern Gradient Design** - Eye-catching pink/purple gradient with abstract 3D elements
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - CSS animations and transitions throughout
- **Accessibility First** - ARIA labels, keyboard navigation, screen reader support

### Interactive Components
- **Advanced Carousel** - Auto-play, touch/swipe support, keyboard navigation
- **Pricing Calculator** - Real-time price estimation with form validation
- **AI Chatbot Modal** - Simulated AI assistant with predefined responses
- **Floating Action Button (FAB)** - Quick access to tools and calculator

### Pages
- **Home** - Hero section, features, work examples carousel, pricing plans
- **Blog** - Article listings with tags and newsletter signup
- **Portfolio** - Project case studies with detailed breakdowns
- **Contact** - Contact form, FAQ section, and company information

### Technical Features
- **Vanilla JavaScript** - No dependencies, fast loading
- **Modular Architecture** - Separated CSS and JS files for maintainability
- **Performance Optimized** - Efficient animations and lazy loading
- **SEO Ready** - Semantic HTML and proper meta tags

## 📁 Project Structure

```
autoflow-studio/
├── index.html              # Home page
├── blog.html               # Blog page
├── portfolio.html          # Portfolio page
├── contact.html            # Contact page
├── css/
│   ├── styles.css          # Main styles
│   └── components.css      # Component-specific styles
├── js/
│   ├── main.js             # Common functionality
│   ├── carousel.js         # Carousel functionality
│   └── tools.js            # FAB tools and calculator
├── assets/
│   └── images/             # Future images directory
└── README.md               # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- A modern web browser
- VS Code (recommended) or any text editor
- Live Server extension for VS Code (recommended)

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/your-username/autoflow-studio.git
   cd autoflow-studio
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Install Recommended Extensions**
   - Live Server (ritwickdey.LiveServer)
   - Prettier (esbenp.prettier-vscode)
   - Auto Rename Tag (formulahendry.auto-rename-tag)

4. **Start Development Server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Your site will open at `http://localhost:5500`

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from branch" → main branch
4. Your site will be available at `https://yourusername.github.io/autoflow-studio`

### Netlify (Free)
1. Visit [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Get instant deployment with custom domain options

### Vercel (Free)
1. Visit [vercel.com](https://vercel.com)
2. Import from GitHub or upload files
3. Automatic deployments with great performance

## 🎨 Customization

### Colors
The main brand colors are defined in CSS custom properties:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #e91e63, #9c27b0);
  --secondary-color: #6b7280;
  --background-color: #ffffff;
}
```

### Content
- Update company information in all HTML files
- Modify pricing in `js/tools.js` (pricing object)
- Add your own images to `assets/images/`
- Update social media links in contact section

### Functionality
- **Contact Form**: Integrate with Formspree, Netlify Forms, or your backend
- **Analytics**: Add Google Analytics or other tracking codes
- **CMS**: Consider integrating with Strapi, Contentful, or another headless CMS

## 📱 Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development

### File Organization
- **HTML**: Semantic markup with proper ARIA attributes
- **CSS**: BEM methodology, mobile-first responsive design
- **JavaScript**: ES6+ features, modular architecture

### Performance
- Optimized CSS with efficient selectors
- Minimal JavaScript with event delegation
- Lazy loading for animations
- Compressed and optimized assets

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- High contrast mode support
- Reduced motion preferences

## 🐛 Known Issues

- None currently known. Please report issues in the GitHub repository.

## 🚀 Future Enhancements

- [ ] Add blog post detail pages
- [ ] Implement real backend for contact form
- [ ] Add more portfolio case studies
- [ ] Integrate with a CMS
- [ ] Add multi-language support
- [ ] Implement dark mode toggle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions about this project:
- Email: hello@autoflowstudio.com
- Website: [autoflowstudio.com](https://autoflowstudio.com)

## 🙏 Acknowledgments

- Design inspiration from modern SaaS websites
- Icons from Heroicons and Lucide
- Fonts from Google Fonts (Inter)
- Color palette inspired by Material Design

---

**Built with ❤️ for automation enthusiasts**