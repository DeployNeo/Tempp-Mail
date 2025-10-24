# Contributing to Guerrilla Fullstack

Thank you for your interest in contributing to Guerrilla Fullstack! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Redis 7+ (optional, app works without it)
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/guerrilla-fullstack.git
   cd guerrilla-fullstack
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker
- Provide detailed information about the bug
- Include steps to reproduce
- Add screenshots if applicable

### Suggesting Features
- Open a new issue with the "enhancement" label
- Describe the feature clearly
- Explain why it would be useful
- Consider the impact on existing functionality

### Code Contributions

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test  # when tests are added
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🎨 Code Style

### JavaScript/React
- Use ES6+ features
- Prefer functional components with hooks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### CSS/Tailwind
- Use Tailwind utility classes
- Create custom components for reusable styles
- Follow mobile-first responsive design

### Node.js/Express
- Use async/await for asynchronous operations
- Add proper error handling
- Use meaningful variable names
- Add comments for complex business logic

## 📁 Project Structure

```
guerrilla-fullstack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
├── server/                # Node.js backend
│   ├── services/           # Business logic
│   └── index.js           # Express server
├── docker-compose.yml     # Docker setup
└── README.md              # Documentation
```

## 🧪 Testing

### Frontend Testing
- Test components in isolation
- Test user interactions
- Test responsive design
- Test accessibility

### Backend Testing
- Test API endpoints
- Test error handling
- Test session management
- Test GuerrillaMail API integration

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's style guidelines
- [ ] Self-review of your code
- [ ] Code is properly commented
- [ ] Documentation is updated
- [ ] No console.log statements in production code

### PR Description
- Clearly describe what the PR does
- Reference any related issues
- Include screenshots for UI changes
- List any breaking changes

### Review Process
- All PRs require review
- Address feedback promptly
- Keep PRs focused and small
- Update your branch if needed

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**
   - OS and version
   - Node.js version
   - Browser version (for frontend issues)

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior

3. **Additional Context**
   - Screenshots or videos
   - Console errors
   - Network requests

## 💡 Feature Requests

When suggesting features:

1. **Use Case**
   - Why is this feature needed?
   - How would it improve the user experience?

2. **Implementation**
   - Any technical considerations
   - Potential challenges

3. **Alternatives**
   - Other ways to solve the problem
   - Workarounds that exist

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and feature requests
- **Email**: Contact the maintainer if needed

## 🎯 Development Focus Areas

### High Priority
- Performance optimization
- Security improvements
- Mobile responsiveness
- Accessibility

### Medium Priority
- Additional email providers
- Advanced filtering
- Export functionality
- Analytics

### Low Priority
- Themes and customization
- Advanced settings
- Integration with other services

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Guerrilla Fullstack! 🚀
