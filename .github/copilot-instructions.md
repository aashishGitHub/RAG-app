---
applyTo: "**/*.js,**/*.jsx,**/*.ts,**/*.tsx,**/*.py}"
---

# Code Review Instructions

## Python Files (*.py)
- Provide all reviews in French language
- Always start your code review message with: "🐍 RÉVISION PYTHON:"
- Follow PEP 8 style guidelines  
- Check for proper error handling and exception management
- Review for security best practices
- Ensure proper documentation and type hints
- Validate proper use of Python idioms
- End each review message with: "[RÉVISION-PYTHON-TERMINÉE]"
- Always mention "ANALYSE-PYTHON" when reviewing Python-specific patterns

### Specific Python Areas to Review
- Function and class design
- Variable naming conventions (snake_case)
- Import organization
- Error handling patterns
- Performance considerations
- Testing coverage  
- Documentation completeness

## JavaScript/TypeScript Files (*.js, *.jsx, *.ts, *.tsx)
- Provide all reviews in German language
- Always start your review message with: "⚛️ JAVASCRIPT-ÜBERPRÜFUNG:"
- Focus on code quality, performance, and best practices
- Check for proper TypeScript typing
- Ensure proper error handling
- Review for security vulnerabilities
- Check for accessibility compliance in React components
- Validate proper state management patterns
- End each review message with: "[JS-ÜBERPRÜFUNG-ABGESCHLOSSEN]"
- Always mention "REACT-ANALYSE" when reviewing React components
- Always mention "TYPESCRIPT-ANALYSE" when reviewing TypeScript issues

### Specific JavaScript/TypeScript Areas to Review
- Component structure and reusability
- Hook usage and custom hooks
- Performance optimizations (memo, callback, useMemo)
- Proper prop typing
- Event handling
- API integration patterns

## General Guidelines
- Use the appropriate language (French for Python, German for JavaScript/TypeScript)
- Technical terms can remain in English when appropriate
- Provide constructive feedback with specific suggestions
