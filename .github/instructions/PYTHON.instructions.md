---
applyTo: "**/*.py"
---
# Python Code Instructions

Always provide review comments in Spanish for Python files.


Review reading these instructions and with a prefix in comments "Python-Reviews"


## Project Overview

This Python module supports the RAG Chat Application with utilities for document processing, analytics, and database operations. Focus on data science best practices, performance optimization, and integration with the existing Node.js backend.

## Python Coding Standards

### Code Style
- Follow **PEP 8** style guidelines strictly
- Use **type hints** for all function parameters and return values
- Prefer **dataclasses** over regular classes for data structures
- Use **pathlib** instead of os.path for file operations
- Follow **snake_case** naming convention for variables and functions

### Best Practices
- **Error handling**: Use specific exception types, not bare except clauses
- **Logging**: Use the logging module instead of print statements
- **Documentation**: Include docstrings for all functions and classes
- **Testing**: Write unit tests with pytest and proper test coverage
- **Virtual environments**: Always use virtual environments for dependencies

### Data Processing Patterns
- Use **pandas** for data manipulation and analysis
- Prefer **numpy** for numerical computations
- Use **pathlib.Path** for cross-platform file handling
- Implement **chunked processing** for large datasets
- Use **context managers** for file operations and database connections

### Integration Guidelines
- **Environment variables**: Use python-dotenv for configuration
- **Database operations**: Follow async patterns when possible
- **API calls**: Use requests with proper error handling and retries
- **JSON handling**: Use pydantic for data validation
- **Logging**: Integrate with existing application logging patterns

### Performance Considerations
- Use **generators** for memory-efficient data processing
- Implement **batch operations** for database queries
- Use **concurrent.futures** for CPU-bound tasks
- Profile code with **cProfile** for optimization
- Consider **numba** for numerical computation acceleration

### Security Best Practices
- **Input validation**: Validate all external inputs
- **Secrets management**: Never hardcode API keys or passwords
- **File operations**: Validate file paths and types
- **SQL injection**: Use parameterized queries
- **Data sanitization**: Clean user inputs before processing

## Common Python Patterns for RAG Applications

### Document Processing
```python
from pathlib import Path
from typing import List, Optional
import logging

def process_documents(doc_path: Path) -> List[str]:
    """Process documents with proper error handling."""
    logger = logging.getLogger(__name__)
    # Implementation here
```

### Vector Operations
```python
import numpy as np
from typing import Tuple

def calculate_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculate cosine similarity between vectors."""
    # Implementation with proper type checking
```

### Database Integration
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class DocumentChunk:
    content: str
    embedding: List[float]
    metadata: dict
    
    def to_dict(self) -> dict:
        """Convert to dictionary for database storage."""
        # Implementation here
```

## Testing Requirements
- Use **pytest** for test framework
- Achieve minimum **80% code coverage**
- Include **integration tests** for database operations
- Mock external API calls in tests
- Use **fixtures** for test data setup

## Review Focus Areas
1. **Type safety**: Ensure all functions have proper type hints
2. **Error handling**: Check for appropriate exception handling
3. **Performance**: Look for optimization opportunities
4. **Documentation**: Verify docstrings and comments
5. **Integration**: Ensure compatibility with existing Node.js backend
6. **Security**: Review for potential security vulnerabilities

Prioriza la revisión de la seguridad y el rendimiento en todos los archivos Python.
