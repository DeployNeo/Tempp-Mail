# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Guerrilla Fullstack, please report it responsibly:

### How to Report

1. **DO NOT** create a public GitHub issue
2. Email the maintainer directly at your-security-email@example.com
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Include

- **Vulnerability Type**: XSS, CSRF, SQL Injection, etc.
- **Affected Components**: Frontend, Backend, API, etc.
- **Severity**: Low, Medium, High, Critical
- **Proof of Concept**: Code or steps to reproduce
- **Environment**: OS, Node.js version, browser, etc.

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix Development**: Within 2-4 weeks (depending on severity)
- **Public Disclosure**: After fix is deployed

## Security Measures

### Current Security Features

- **Rate Limiting**: API endpoints are rate-limited
- **CORS Protection**: Configured CORS for security
- **Helmet**: Security headers middleware
- **Input Validation**: Server-side validation
- **Session Management**: Secure session handling
- **Error Handling**: Comprehensive error management

### Data Protection

- **No Data Storage**: Temporary emails are not permanently stored
- **Session Cleanup**: Sessions expire automatically
- **Memory Management**: In-memory storage is cleared on restart
- **API Security**: GuerrillaMail API integration is secure

### Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Dependencies**
   - Keep dependencies updated
   - Use `npm audit` to check for vulnerabilities
   - Remove unused dependencies

3. **Code Security**
   - Validate all inputs
   - Sanitize user data
   - Use parameterized queries
   - Implement proper error handling

## Security Checklist

### For Developers

- [ ] Input validation on all user inputs
- [ ] Output encoding to prevent XSS
- [ ] Secure session management
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Dependencies updated
- [ ] No sensitive data in logs
- [ ] Error messages don't leak information

### For Deployment

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database connections encrypted
- [ ] Regular security updates
- [ ] Monitoring and logging
- [ ] Backup and recovery procedures

## Known Security Considerations

### GuerrillaMail API
- The application integrates with GuerrillaMail API
- No sensitive data is stored locally
- Sessions are managed securely
- API calls are made over HTTPS

### Redis (Optional)
- Redis is used for session storage (optional)
- No sensitive data is stored in Redis
- Redis connections should be secured in production

### Client-Side Security
- No sensitive data stored in localStorage
- Session data is properly managed
- XSS protection through React
- CSRF protection through proper API design

## Security Updates

Security updates will be released as:
- **Patch versions** (1.0.1, 1.0.2) for security fixes
- **Minor versions** (1.1.0) for security improvements
- **Major versions** (2.0.0) for significant security changes

## Contact

For security-related questions or to report vulnerabilities:

- **Email**: your-security-email@example.com
- **GitHub**: Create a private security advisory
- **Discord**: Join our security channel (if available)

## Acknowledgments

We appreciate the security research community and responsible disclosure practices. Security researchers who follow responsible disclosure will be acknowledged in our security advisories.

## Legal

This security policy is provided for informational purposes only. The maintainers of this project are not responsible for any security issues that may arise from the use of this software. Users are responsible for implementing appropriate security measures in their own environments.
