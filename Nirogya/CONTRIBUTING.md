# 🤝 Contributing to Nirogya

Thank you for your interest in contributing to Nirogya! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Coding Standards](#-coding-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Community](#-community)

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, education
- Nationality, personal appearance, race
- Religion, sexual identity and orientation

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Violations can be reported to: conduct@nirogya.health

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0+
- **Python** 3.8+
- **Git**
- **Code Editor** (VSCode recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/nirogya.git
cd nirogya
```

3. **Add upstream remote:**
```bash
git remote add upstream https://github.com/original/nirogya.git
```

4. **Install dependencies:**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../model/api
pip install -r requirements.txt
```

### Create a Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

---

## 🔄 Development Workflow

### 1. Sync with Upstream

Before starting work, sync with the main repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### 2. Make Changes

- Write clean, readable code
- Follow coding standards
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Frontend
cd frontend
npm run build
npm run dev

# Backend
cd model/api
python app_v2.py
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to GitHub
- Click "New Pull Request"
- Fill in the PR template
- Wait for review

---

## 💻 Coding Standards

### TypeScript/JavaScript

**Style Guide:**
- Use TypeScript for type safety
- Use functional components with hooks
- Use meaningful variable names
- Add JSDoc comments for functions

**Example:**
```typescript
/**
 * Predicts disease outbreak cases
 * @param region - Region in State_District format
 * @param disease - Disease name
 * @param historicalCases - Array of 14 historical case numbers
 * @returns Prediction with confidence intervals
 */
async function predictOutbreak(
  region: string,
  disease: string,
  historicalCases: number[]
): Promise<PredictionResponse> {
  // Implementation
}
```

**Formatting:**
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters

### Python

**Style Guide:**
- Follow PEP 8
- Use type hints
- Add docstrings
- Use meaningful variable names

**Example:**
```python
def predict_outbreak(
    region: str,
    disease: str,
    historical_cases: List[float]
) -> Dict[str, Any]:
    """
    Predicts disease outbreak cases.
    
    Args:
        region: Region in State_District format
        disease: Disease name
        historical_cases: List of 14 historical case numbers
        
    Returns:
        Dictionary with prediction and confidence intervals
    """
    # Implementation
```

**Formatting:**
- Use 4 spaces for indentation
- Max line length: 88 characters (Black formatter)
- Use double quotes for strings

### React Components

**Best Practices:**
- One component per file
- Use TypeScript interfaces for props
- Extract reusable logic to hooks
- Use proper prop types

**Example:**
```typescript
interface PredictionProps {
  region: string
  disease: string
  onPredictionComplete: (result: PredictionResponse) => void
}

export const Prediction: React.FC<PredictionProps> = ({
  region,
  disease,
  onPredictionComplete
}) => {
  // Component implementation
}
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

**Good commits:**
```
feat(prediction): add confidence interval display

Added visual representation of confidence intervals
in the prediction results component.

Closes #123
```

```
fix(api): handle invalid region names

Added validation for region names before making
predictions to prevent 500 errors.

Fixes #456
```

**Bad commits:**
```
update stuff
fixed bug
changes
```

### Commit Best Practices

- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- First line max 50 characters
- Body max 72 characters per line
- Reference issues and PRs

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No console errors
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes

## Screenshots
If applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] Added tests
- [ ] Tests pass
- [ ] No breaking changes
```

### Review Process

1. **Automated Checks**: CI/CD runs tests
2. **Code Review**: Maintainers review code
3. **Feedback**: Address review comments
4. **Approval**: Get approval from maintainers
5. **Merge**: Maintainer merges PR

### After Merge

- Delete your branch
- Update your fork
- Celebrate! 🎉

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend

# Type checking
npm run type-check

# Build test
npm run build

# Manual testing
npm run dev
```

### Backend Tests

```bash
cd model/api

# Run tests
python test_api_v2.py

# Validate model
python validate_v2.py
```

### Writing Tests

**Frontend (Jest/React Testing Library):**
```typescript
import { render, screen } from '@testing-library/react'
import { Prediction } from './Prediction'

test('renders prediction form', () => {
  render(<Prediction />)
  expect(screen.getByText('Select Region')).toBeInTheDocument()
})
```

**Backend (pytest):**
```python
def test_predict_endpoint():
    response = client.post('/predict', json={
        'region': 'Maharashtra_Mumbai',
        'disease': 'Dengue',
        'historical_cases': [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
    })
    assert response.status_code == 200
    assert 'predicted_cases' in response.json()
```

---

## 📚 Documentation

### What to Document

- New features
- API changes
- Configuration options
- Breaking changes
- Migration guides

### Documentation Style

- Use clear, simple language
- Include code examples
- Add screenshots for UI changes
- Update README.md
- Update API_DOCUMENTATION.md

### Example

```markdown
## New Feature: Batch Predictions

You can now make predictions for multiple regions at once.

**Usage:**
\`\`\`typescript
const results = await batchPredict([
  { region: 'Delhi_Central Delhi', disease: 'Dengue', ... },
  { region: 'Mumbai_Mumbai', disease: 'Malaria', ... }
])
\`\`\`

**Response:**
\`\`\`json
{
  "predictions": [...],
  "total": 2,
  "successful": 2,
  "failed": 0
}
\`\`\`
```

---

## 👥 Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas
- **Discord**: Real-time chat
- **Email**: General inquiries

### Getting Help

1. **Search existing issues** first
2. **Check documentation**
3. **Ask in Discord** for quick help
4. **Create GitHub issue** for bugs

### Helping Others

- Answer questions in issues
- Review pull requests
- Improve documentation
- Share your experience

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Featured on project website
- Invited to contributor events

---

## 📞 Contact

- **Email**: contribute@nirogya.health
- **Discord**: [Join our server](https://discord.gg/nirogya)
- **Twitter**: [@NirogyaHealth](https://twitter.com/nirogyahealth)

---

## 🙏 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for helping make Nirogya better!

**Happy Contributing! 🚀**

