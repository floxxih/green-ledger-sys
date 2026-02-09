# Login Error Handling

This document explains the improved error handling system for login authentication.

## Overview

The login error handling system provides specific, actionable error messages to users when authentication fails, rather than generic "Invalid login" messages.

## Features

- **Field-Specific Errors**: Clearly indicates whether the email or password is incorrect
- **Actionable Messages**: Provides helpful suggestions and links to resolve issues
- **Accessibility**: ARIA attributes and semantic HTML for screen readers
- **User Guidance**: Contextual help text for each error type
- **Visual Feedback**: Color-coded error indicators on form fields

## Error Types

### Email Errors

**Invalid Email**
- **Message**: "The email address you entered is incorrect."
- **Help**: "Please check your email address and try again."
- **Field**: Email input highlighted

**Account Not Found**
- **Message**: "No account found with this email address."
- **Help**: "Please check your email or create a new account."
- **Action**: Link to sign up page

### Password Errors

**Invalid Password**
- **Message**: "The password you entered is incorrect."
- **Help**: "Passwords are case-sensitive. Check your caps lock key."
- **Action**: Link to forgot password page

### Account Status Errors

**Account Locked**
- **Message**: "Your account has been temporarily locked."
- **Help**: "Too many failed login attempts. Please try again in 15 minutes or reset your password."
- **Action**: Link to reset password page

**Email Not Verified**
- **Message**: "Please verify your email address before logging in."
- **Help**: "Check your inbox for a verification email."
- **Action**: Link to resend verification email

### System Errors

**Network Error**
- **Message**: "Unable to connect to the server."
- **Help**: "Please check your internet connection and try again."

**Server Error**
- **Message**: "Something went wrong on our end."
- **Help**: "Please try again in a few moments. If the problem persists, contact support."
- **Action**: Link to support page

**Rate Limit Exceeded**
- **Message**: "Too many login attempts."
- **Help**: "Please wait a few minutes before trying again."

## Usage

### Basic Implementation

```typescript
import { LoginForm } from '@/components/LoginForm';
import { authService } from '@/services/auth';

function MyLoginPage() {
  const handleLogin = async (email: string, password: string) => {
    await authService.login({ email, password });
  };

  const handleSuccess = () => {
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <LoginForm 
      onSubmit={handleLogin} 
      onSuccess={handleSuccess} 
    />
  );
}
```

### Custom Error Handling

```typescript
import { parseLoginError } from '@/lib/errors/loginErrors';

try {
  await authService.login(credentials);
} catch (error) {
  const loginError = parseLoginError(error);
  
  // Access error details
  console.log(loginError.code);      // e.g., 'INVALID_PASSWORD'
  console.log(loginError.message);   // User-friendly message
  console.log(loginError.field);     // 'email' | 'password' | 'general'
  console.log(loginError.helpText);  // Additional guidance
  console.log(loginError.actionUrl); // Suggested next step
}
```

### Display Error Alert

```typescript
import { LoginErrorAlert } from '@/components/LoginErrorAlert';

function MyComponent() {
  const [error, setError] = useState<LoginError | null>(null);

  return (
    <LoginErrorAlert 
      error={error} 
      onDismiss={() => setError(null)} 
    />
  );
}
```

### Field-Specific Error Display

```typescript
import { FieldError } from '@/components/LoginErrorAlert';

<input 
  type="email" 
  className={error?.field === 'email' ? 'border-red-500' : ''}
/>
<FieldError field="email" error={error} />
```

## Backend Integration

### Expected Error Response Format

The auth service expects backend errors in this format:

```json
{
  "errorCode": "INVALID_PASSWORD",
  "message": "Incorrect password",
  "field": "password"
}
```

### Status Code Mapping

| Status | Error Type | Description |
|--------|------------|-------------|
| 400 | INVALID_REQUEST | Malformed request |
| 401 | INVALID_EMAIL or INVALID_PASSWORD | Authentication failed |
| 403 | ACCOUNT_LOCKED or EMAIL_NOT_VERIFIED | Access forbidden |
| 404 | ACCOUNT_NOT_FOUND | User doesn't exist |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500+ | SERVER_ERROR | Server-side error |

### Backend Implementation Example

```javascript
// Express.js example
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findByEmail(email);
  
  if (!user) {
    return res.status(404).json({
      errorCode: 'ACCOUNT_NOT_FOUND',
      message: 'No account found with this email',
      field: 'email'
    });
  }
  
  if (!user.verifyPassword(password)) {
    return res.status(401).json({
      errorCode: 'INVALID_PASSWORD',
      message: 'Incorrect password',
      field: 'password'
    });
  }
  
  if (user.isLocked()) {
    return res.status(403).json({
      errorCode: 'ACCOUNT_LOCKED',
      message: 'Account temporarily locked'
    });
  }
  
  // Success
  res.json({ token: generateToken(user) });
});
```

## Accessibility

The error handling system follows WCAG 2.1 AA guidelines:

- **ARIA Labels**: Error messages linked to form fields via `aria-describedby`
- **ARIA Live Regions**: Errors announced to screen readers with `aria-live="assertive"`
- **Color Independence**: Icons supplement color coding
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Focus Management**: Error fields receive focus on validation

## Testing

Run tests with:

```bash
npm test loginErrors.test.ts
```

### Test Coverage

- Network error handling
- Status code parsing
- Error code detection
- Message parsing
- Field identification
- Action link generation

## Best Practices

1. **Be Specific**: Always indicate which field has the error
2. **Be Helpful**: Provide actionable next steps
3. **Be Clear**: Use simple, non-technical language
4. **Be Accessible**: Support assistive technologies
5. **Be Secure**: Don't reveal too much information about account status

## Security Considerations

- Avoid revealing whether an email exists in the system (use generic messages where appropriate)
- Implement rate limiting on the backend
- Log failed authentication attempts
- Consider CAPTCHA after multiple failures
- Use secure password reset flows

## Future Enhancements

- [ ] Multi-factor authentication error handling
- [ ] Social login error handling
- [ ] Password strength validation
- [ ] Biometric authentication errors
- [ ] Session timeout notifications
