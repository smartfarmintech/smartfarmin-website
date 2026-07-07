# Contributing to Rythu360

Thank you for your interest in contributing to Rythu360! We welcome contributions from developers, designers, and community members.

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## How to Contribute

### Reporting Bugs

Before creating a bug report, check the issue list to avoid duplicates.

**How to submit a bug report:**

1. Use a clear and descriptive title
2. Describe the exact steps to reproduce the problem
3. Provide specific examples to demonstrate the steps
4. Describe the behavior you observed
5. Explain the expected behavior
6. Include screenshots/GIFs if possible
7. Include your environment (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub Issues.

**How to submit an enhancement suggestion:**

1. Use a clear and descriptive title
2. Provide a detailed description of the enhancement
3. List some examples of how this enhancement would benefit users
4. Include mockups or wireframes if applicable

### Pull Requests

**Development Process:**

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
4. Make your changes
5. Write or update tests
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to your fork (`git push origin feature/amazing-feature`)
8. Open a Pull Request

**Pull Request Guidelines:**

- Use a clear and descriptive title
- Follow the existing code style
- Update documentation as needed
- Add tests for new functionality
- Ensure all tests pass
- Reference any related issues

### Code Style

#### TypeScript

- Use strict mode (`"strict": true` in tsconfig.json)
- Type all function parameters and returns
- Avoid `any` type - use `unknown` if needed
- Use descriptive variable names

```typescript
// Good
function calculateBookingPrice(
  basePrice: number,
  duration: number,
  discount: number
): number {
  return (basePrice * duration) - discount;
}

// Bad
function calc(p: any, d: any, disc: any): any {
  return (p * d) - disc;
}
```

#### React Components

- Use functional components with hooks
- Extract complex logic to custom hooks
- Keep components small and focused
- Use meaningful prop names

```typescript
// Good
interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
}

function BookingCard({ booking, onCancel }: BookingCardProps) {
  return <div>{/* component JSX */}</div>;
}

// Bad
function BookingCard(props: any) {
  return <div>{/* component JSX */}</div>;
}
```

#### Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Components | PascalCase | `BookingCard.tsx` |
| Hooks | camelCase with `use` prefix | `useBooking.ts` |
| Utilities | camelCase | `calculatePrice.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_BOOKINGS = 100` |
| Variables | camelCase | `bookingId`, `isLoading` |
| Interfaces | PascalCase with `I` prefix or no prefix | `IBooking` or `Booking` |

### Git Workflow

#### Branch Naming

- Feature: `feature/short-description`
- Bug fix: `fix/short-description`
- Documentation: `docs/short-description`
- Refactor: `refactor/short-description`
- Testing: `test/short-description`

Example: `feature/machinery-gps-tracking`, `fix/booking-payment-bug`

#### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build, dependencies, tooling
- `ci:` - CI/CD configuration

**Examples:**

```
feat(machinery): add GPS tracking during bookings
fix(wallet): correct balance calculation for withdrawals
docs(api): update API documentation with examples
refactor(components): extract booking logic into custom hook
test(auth): add test cases for password reset flow
```

### Development Setup

#### Prerequisites
- Node.js 18+
- pnpm or npm
- Git
- Supabase account

#### Steps

1. **Clone Repository**
```bash
git clone https://github.com/smartfarmintech/rythu360.git
cd rythu360
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Run Development Server**
```bash
pnpm dev
```

5. **Run Tests**
```bash
pnpm test
```

6. **Run Linter**
```bash
pnpm lint
```

### Testing

#### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test filename.test.ts
```

#### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { calculateBookingPrice } from './calculateBookingPrice';

describe('calculateBookingPrice', () => {
  it('should calculate correct price with no discount', () => {
    const result = calculateBookingPrice(100, 2, 0);
    expect(result).toBe(200);
  });

  it('should apply discount correctly', () => {
    const result = calculateBookingPrice(100, 2, 20);
    expect(result).toBe(180);
  });
});
```

### Documentation

When adding new features:

1. Update relevant documentation files
2. Add code comments for complex logic
3. Update API.md for new endpoints
4. Update DATABASE.md for schema changes
5. Add JSDoc comments to functions

**JSDoc Example:**

```typescript
/**
 * Calculate the total booking price including operator fees and discounts
 * @param basePrice - Machine rental price per unit
 * @param duration - Booking duration in units
 * @param operatorFee - Optional operator fee
 * @param discount - Optional discount amount
 * @returns Calculated total price
 * @throws Error if price is negative
 * @example
 * const price = calculateBookingPrice(500, 2, 100, 50);
 * // Returns 1050
 */
function calculateBookingPrice(
  basePrice: number,
  duration: number,
  operatorFee: number = 0,
  discount: number = 0
): number {
  const total = (basePrice * duration) + operatorFee - discount;
  if (total < 0) throw new Error('Price cannot be negative');
  return total;
}
```

### Performance Considerations

When contributing, please consider:

1. **Database Queries:** Use indexes, avoid N+1 queries
2. **API Responses:** Implement pagination for large datasets
3. **Frontend:** Lazy load components, optimize images
4. **Caching:** Cache database queries when appropriate
5. **Bundle Size:** Monitor and keep bundle size small

### Security

Before submitting a PR with security implications:

1. Review [SECURITY.md](SECURITY.md)
2. Test for common vulnerabilities
3. Never commit secrets or API keys
4. Validate all user inputs
5. Use parameterized queries

### Review Process

#### What to Expect

1. **Automated Checks:** GitHub Actions runs tests and linting
2. **Code Review:** Maintainers review your code
3. **Feedback:** Maintainers may request changes
4. **Approval:** PR approved when all checks pass
5. **Merge:** Maintainer merges your PR

#### Tips for Faster Approval

- Keep PRs small and focused
- Write clear commit messages
- Add tests for your changes
- Update documentation
- Respond promptly to feedback

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Questions?

- Open a GitHub Discussion
- Join our community Slack (coming soon)
- Email: developers@smartfarmintech.com

---

Thank you for contributing to Rythu360!
