
---
applyTo: "**/*.ts,**/*.tsx"
---
# UI Code Instructions

## Introduction


When performing a code review, respond in Spanish.

When performing a code review, focus on readability and avoid nested ternary operators.

Always end the code review with a slogan. Good Job!


This document sets the **standards and practices for all UI code** in this repository, inspired by our team's principles and React best practices. All developers and reviewers must consistently apply these rules to maintain code health, design quality, and project velocity.

**Priority Order**: Security → Maintainability → Consistency → Readability → Testability → Scalability → Performance

---

## Code Style & Consistency

### Naming Conventions
- **camelCase** for variables: `const userName = "Alice";`
- **PascalCase** for components/types: `function UserCard() { ... }`
- **kebab-case** for CSS classes/files: `.user-icon { ... }` and `user-card.module.css`

### Code Quality
- Enforce **ESLint** and **Prettier** for linting and formatting
- Use descriptive naming for all variables, functions, and components
- Add comments for complex code using JSDoc:
  ```js
  /** Converts user data into display form */
  function transformUserData(user) { ... }
  ```
- Follow **SOLID**, **DRY**, **KISS**, and **YAGNI** principles

---

## AI Tools in Development

- Use **Cursor Editor**, **Co-Pilot**, and custom prompts for:
  - Generating unit tests
  - Facilitating prototyping
  - Creating React Storybook stories
- Always verify AI-generated code before merging
- **AI is not a substitute for peer review**
- Store and share team prompts for efficiency

---

## File & Component Organization

### File Structure
Place related files together:
```
Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx
└── README.md
```

### Page Components
```
UserPage/
├── user-page.tsx
├── user-page-utils.tsx
├── user-specific-component.tsx
├── use-user-hook.ts
├── use-user-hook.test.tsx
└── use-user-hook-utils.ts
```

### General Rules
- Place page-specific hooks/utilities next to page components
- Centralize shared utilities in `hooks/api` folder
- Each component in separate file (except compound components)

---

## Component Architecture

### Core Principles
- Build from **small, reusable, and independent components**
- **Single Responsibility Principle**: One component, one job
- Use **container** and **presentation** component separation where clarity is improved
- Bottom-up development: Start simple; refactor for reusability later

### When to Create New Components
Strong indicators for separation:
- Component requires reuse (low-level components)
- Component encapsulates specific logic or state
- Component needs access to its own lifecycle

### Before Creating
- Search for existing analogues
- Collaborate with Design Team for global components
- Follow SOLID principles when beneficial

---

## Hooks Usage Guidelines

### Rules
- Use **functional components only**—no class components
- Use built-in and existing custom hooks before creating new ones
- **Rules of Hooks**:
  - Call hooks at top level, not inside loops or conditions
  - Only call hooks in React functions
- Write unit tests for custom hooks
- Custom hooks should be based on other hooks

### Example
```jsx
function useUserData(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUser(userId).then(setUser).finally(() => setLoading(false));
    }
  }, [userId]);

  return { user, loading };
}
```

---

## Data Flow & State Management

### State Rules
- **Props**: Immutable, top-down only
- **State**: Local by default (`useState`), lift to parent/page where needed
- Use **Context API** or external state if prop drilling is excessive
- Prefer `useState` over `useReducer`, unless state logic is complex
- Derive computed values instead of duplicating state
- Use **React Query** for server data—not Redux

### Examples
```jsx
// Local state
const [count, setCount] = useState(0);

// Derived state (don't store separately)
const isEven = count % 2 === 0;

// React Query for API data
const { data: user, isLoading } = useQuery(
  ['user', userId],
  () => fetchUser(userId),
  { enabled: !!userId }
);
```

---

## Declarative UI & Performance

### Declarative Patterns
Always describe UI via state, never manipulate DOM directly:
```jsx
// Good
{isOpen ? <Modal /> : <Button onClick={() => setIsOpen(true)} />}

// Bad - imperative DOM manipulation
document.getElementById('modal').style.display = 'block';
```

### Performance Optimization
- Optimize **after** identifying real performance issues
- Prefer `React.memo` first; then `useCallback`/`useMemo` if needed
- Use lazy loading and code-splitting for larger modules
- Optimize list rendering with proper keys and virtualization

```jsx
// Memoization example
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() =>
    expensiveCalculation(data), [data]
  );

  return <div>{processedData}</div>;
});
```

---

## Security

### Input Validation & Sanitization
- **All user input must be validated and sanitized**
- Sanitize HTML before rendering:
  ```jsx
  import DOMPurify from 'dompurify';

  function SafeHTML({ htmlContent }) {
    const cleanHTML = DOMPurify.sanitize(htmlContent);
    return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
  }
  ```

### Data Protection
- Never expose sensitive data in frontend code or URLs
- Filter sensitive info from third-party tools:
  ```jsx
  <div className={PENDO_IGNORE}>
    Sensitive User ID: {userId}
  </div>
  ```

---

## Accessibility & UX

### WCAG 2 Compliance
- Use semantic HTML, ARIA attributes, keyboard navigation
- Ensure all interactive elements are keyboard accessible
- Implement proper focus management
- Use `tabIndex` for custom navigation

### Testing Attributes
- Add `data-auto-id` attributes for E2E/test selectors:
  ```jsx
  <button data-auto-id="submit-form" onClick={handleSubmit}>
    Submit
  </button>
  ```

### Responsive Design
- Ensure responsive and adaptive design
- Test across different screen sizes and devices

---

## Error Handling & Logging

### User Experience
- Show user-friendly messages for all error states
- **All error scenarios must be handled gracefully**
- Runtime errors must not block navigation or crash the UI
- Provide clear recovery actions where possible
- **Always use safe API data access** with optional chaining (`data?.result?.[0]`)

### Required Error Handling

**Important**: Always use typography components instead of native HTML elements:
```jsx
import { Heading, Text } from 'components/typography';
```

#### Form Validation Errors
```jsx
// Required: Handle all form field validation errors
function CreateDatabaseForm() {
  return (
    <Controller
      name="databaseName"
      control={provisionedControl}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <NameAndDescription
          dataAutoId={maybeDataAutoId()}
          values={value}
          onChange={onChange}
          nameError={error?.message}
        />
      )}
    />
  );
}

// Required: Display validation summary for complex forms
const groupServicesErrors = useMemo(() => validateGroupsServices(specs), [specs]);

if (!isValid || groupServicesErrors.length) {
  return (
    <div className="error-summary">
      {groupServicesErrors.map((error) => (
        <Text key={specs[error.index].id} variant="t4" color="text-on-error-decoration">
          SERVICE GROUP {specs[error.index].id + 1}: {error.message}.
        </Text>
      ))}
    </div>
  );
}
```

#### API Error Handling with React Query
```jsx
// Required: Use Fetch component pattern for queries with safe data access
function CreateDatabasePage() {
  // Safe API data access examples
  const dataApiStatus = database?.data?.dataApiState ?? 'disabled';
  const databaseProvider = getProvider(database?.data?.provider);
  const firstTemplate = deploymentServiceGroups?.data?.serviceGroupsTemplates?.[0];

  return (
    <Fetch
      query={{
        error: trialQuery.error || databaseListQuery.error || deploymentServiceGroupsV2.error,
        data: {},
        isLoading: trialQuery.isLoading || databaseListQuery.isLoading || deploymentTypesV2Query.isLoading,
        isSuccess: trialQuery.isSuccess && databaseListQuery.isSuccess && deploymentTypesV2Query.isSuccess,
      }}
    >
      {/* content - safely access API data */}
    </Fetch>
  );
}

// Required: Handle mutation errors with parseGoof and createNotification
export const useDatabaseSnapshotDelete = ({ databaseName, ...params }) => {
  const { createNotification } = useNotifications();
  const queryClient = useQueryClient();

  const deleteDatabaseSnapshot = useMutation((id: string) => deleteBackup({ ...params, backupId: id }), {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(['databaseSnapshots']), 500);
      createNotification({
        level: 'success',
        message: `Deleted Backup for cluster ${databaseName}.`,
      });
    },
    onError: (error) => {
      const { message } = parseGoof(error);
      createNotification({
        message,
        level: 'error',
      });
    },
  });

  return { deleteDatabaseSnapshot };
};
```

#### File Upload Error Handling
```jsx
// Required: Handle all file upload scenarios with Dropzone
function LibraryCreateFormFields() {
  const [isFileError, setIsFileError] = useState(false);

  return (
    <>
      {!file && !isFileError ? (
        <Dropzone
          accept="text/javascript"
          maxSize={5 * 1024}
          className="w-full justify-center pt-6"
          onDrop={async ([receivedFile]) => {
            setIsFileError(false);

            try {
              const content = await readImportedFile(receivedFile);
              setFile(receivedFile);
              setValue('code', content, { shouldDirty: true, shouldValidate: true });
              setIsDirty(true);
            } catch {
              // Required: Handle file reading errors
              setIsFileError(true);
            }
          }}
          onDropRejected={() => {
            // Required: Handle file validation errors
            setIsFileError(true);
          }}
        >
          <CloudUploadIcon className="h-8 w-8" />
          <Text variant="t4" color="on-background-alternate" className="text-center">
            Upload a JavaScript file (Max size: 5KB)
          </Text>
        </Dropzone>
      ) : null}

      {/* Required: Show file validation errors */}
      {isFileError && (
        <Text color="text-on-error-decoration" variant="t4">
          <Icon className="fill-on-error-decoration" name="error" />
          File upload failed. Please check file type and size.
        </Text>
      )}
    </>
  );
}
```

#### Try-Catch for Specific Operations
```jsx
// Required: Wrap risky operations in try-catch
function DataProcessor({ data }) {
  const [processedData, setProcessedData] = useState(null);
  const [processingError, setProcessingError] = useState(null);

  useEffect(() => {
    const processData = async () => {
      try {
        setProcessingError(null);

        // Required: Handle potential JSON parsing errors
        const parsed = JSON.parse(data);

        // Required: Handle potential transformation errors
        const transformed = await complexDataTransformation(parsed);

        setProcessedData(transformed);

      } catch (error) {
        const errorMessage = error instanceof SyntaxError
          ? 'Invalid data format'
          : 'Failed to process data';

        setProcessingError(errorMessage);

        datadogLogs.logger.error('DataProcessor', {
          operation: 'data_processing',
          dataLength: data?.length
        }, error);
      }
    };

    if (data) {
      processData();
    }
  }, [data]);

  // Required: Show processing errors
  if (processingError) {
    return (
      <div className="error-state">
        <Text variant="t3" color="text-on-error-decoration">{processingError}</Text>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  return <div>{/* processed data content */}</div>;
}

### Error Logging Requirements
All errors must be logged to Datadog and use createNotification for user feedback:

```js
// Required: Use parseGoof for API errors and createNotification
export const useUpgradeStandard = () => {
  const { createNotification } = useNotifications();

  return useMutation(upgradeStandard, {
    onError: (error) => {
      const { message } = parseGoof(error);
      createNotification({
        level: 'error',
        message,
      });
    },
  });
};
```

#### Logging Standards
- **Always use parseGoof** for API error parsing
- **Use createNotification** instead of toast for user feedback
- **Include level** ('error', 'success', 'warning') in notifications
- **Keep error messages** from parseGoof for consistency with backend
- **Use useMutation onError** pattern for all mutation error handling

#### Typography Standards
- **Never use native HTML** elements like `<p>`, `<h1>`, `<h2>`, etc.
- **Always import** `{ Heading, Text }` from `'components/typography'`
- **Use Text variants**: `t1`, `t2`, `t3`, `t4` for different text sizes
- **Use Heading variants**: `h1`, `h2`, `h3`, `h4` for headings
- **Use color props**: `text-on-error-decoration`, `on-background-alternate`, etc.
- **Example**: `<Text variant="t4" color="text-on-error-decoration">Error message</Text>`

---

## TypeScript Practices

### Type Definitions
- Use **type** (not interface) for all scenarios
- Minimize complex types; leverage type inference
- Prefer `const` for enums and unions
- Avoid `any` and `as`—define types explicitly
- **Use indexed access types** to derive subtypes instead of breaking down large types into multiple definitions

### Examples
```tsx
// Good
type User = {
  id: string;
  name: string;
  email: string;
  profile: {
    avatar: string;
    settings: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
}

const UserRoles = ['admin', 'user', 'guest'] as const;
type UserRole = typeof UserRoles[number];

// Derived types using indexed access - preferred approach
type UserEmail = User['email'];
type UserProfile = User['profile'];
type UserSettings = User['profile']['settings'];
type UserTheme = User['profile']['settings']['theme'];

// Explicit typing
const users: User[] = [];
const result = array.reduce<User[]>((acc, item) => [...acc, item], []);
```

### Avoid
```tsx
// Bad
interface User { ... } // Use type instead
let user: any = {}; // Never use any
const user = data as User; // Avoid type assertion

// Bad - breaking down large types into multiple definitions
type UserProfile = {
  avatar: string;
  settings: UserSettings;
};
type UserSettings = {
  theme: 'light' | 'dark';
  notifications: boolean;
};
type User = {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
};

// Good - use indexed access types instead
type User = {
  id: string;
  name: string;
  email: string;
  profile: {
    avatar: string;
    settings: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
};
type UserProfile = User['profile'];
type UserSettings = User['profile']['settings'];
```

---

## Testing

### Testing Strategy
- **Unit tests** (Jest): atoms, molecules, hooks, utilities
- **Integration/E2E tests** (Cypress): organisms, pages, flows
- Test **behavior over implementation details**

### Component Testing
```jsx
// Good - testing behavior
test('increments counter when button is clicked', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });
  const counter = screen.getByText('0');

  fireEvent.click(button);
  expect(counter).toHaveTextContent('1');
});

// Bad - testing implementation
test('calls setState when button is clicked', () => {
  // Don't test internal state directly
});
```

### Hook Testing
```jsx
function renderUseCounter() {
  return renderHook(() => useCounter());
}

test('useCounter increments correctly', () => {
  const { result } = renderUseCounter();

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### Cypress Guidelines
- Prioritize readability and simplicity
- Use `data-auto-id` for selectors
- Don't over-abstract; prefer regular functions
- Focus on user workflows, not implementation

---

## Pull Requests & Code Reviews

### PR Requirements
- **Small and focused** changes only
- Clear title and detailed description
- Include screenshots for UI changes
- All tests and lint checks must pass
- Git hooks must be installed: `make install-git-hooks`

### Review Process
- All feedback/comments must be addressed before merging
- Self-review before requesting peer review
- Address comments by: fixing, discussing, or marking won't-fix with justification

### PR Template
```markdown
## What
Brief description of changes

## Why
Reason for the change

## How
Technical approach taken

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests considered
- [ ] Manual testing completed

## Screenshots
[Include for UI changes]
```

---

## Troubleshooting Workflow

### Debugging Process
1. **Reproduce** the issue with consistent steps
2. **Isolate** by commenting out code sections
3. **Root cause** analysis—don't just fix symptoms
4. **Collaborate** with domain experts for complex issues
5. **Test thoroughly** after fixes
6. **Cover with tests** to prevent regressions

### Monitoring & Logging
- Use `requestId` headers for API debugging
- Check Datadog `cp-ui-logs` dashboard for production errors
- Filter by environment (`dev`, `prod`)
- Utilize AI tools like Cursor for debugging assistance

### State Management Issues
- Check for unintentional side effects
- Verify proper dependency arrays in `useEffect`
- Look for state mutations (should be immutable)

---

## Collaboration with Adjacent Teams

### Design Team & Figma
- Reference "Ready for Dev" Figma screens as source of truth
- Verify consistent fonts, colors, spacing, component names
- Check for existing components before creating new ones
- Use browser tools for pixel-perfect implementation

### QE Team & E2E
- Ensure `data-auto-id` attributes on testable elements
- Search E2E folder for affected tests when making changes
- Run UI sanity pipelines for significant changes: `/run-cp-provisioned-sanity-pipeline_serverversion(7.6.3)`
- Use Cypress Selector Playground for element identification

### Backend Team & HTTP
- Sync on proper HTTP status codes and response formats
- Maintain original field names from backend for traceability
- Use backend pagination, sorting, filtering when available
- Ensure errors are in proper Goof format
- Use short polling for frequently changing states

### PM Team & Copy
- **Never change copy** (text, labels, error messages) without PM approval
- Don't write tests for wording/copy
- Search `cp-ui-v2/test` folder before changing any text
- Ensure copy changes don't break E2E tests

---

## Common Issues and Anti-Patterns

### Component Usage
```jsx
// Bad - calling component as function
const result = MyComponent(props);

// Good - rendering as JSX
const result = <MyComponent {...props} />;

// Alternative patterns for dynamic rendering
const Component = useMemo(() => getComponent(type), [type]);
return <Component {...props} />;
```

### useEffect Usage
```jsx
// Bad - synchronous logic in useEffect
useEffect(() => {
  setProcessedData(processData(inputData));
}, [inputData]);

// Good - handle in event handler or derived state
const processedData = useMemo(() => processData(inputData), [inputData]);

// Good useEffect - for side effects only
useEffect(() => {
  const subscription = api.subscribe(data => {
    setLiveData(data);
  });

  return () => subscription.unsubscribe(); // cleanup
}, []);
```

### Safe API Data Access
```jsx
// Bad - unsafe array access can cause runtime errors
const firstUser = data.users[0];
const userName = response.data.result[0].name;
const config = database.data.config.version;

// Good - safe array access with optional chaining
const firstUser = data?.users?.[0];
const userName = response?.data?.result?.[0]?.name;
const config = database?.data?.config?.version;

// Real examples from codebase
const dataApiStatus = database?.data?.dataApiState ?? 'disabled';
const databaseProvider = getProvider(database?.data?.provider);
const connectionString = `https://${database?.data?.dataApiHostname}`;

// Safe access with fallback values
const totalItems = queryAppServiceList.data?.cursor?.pages?.totalItems || appServiceList.length;
const isSourceDBOver8 = isMagmaDefaultFF && isDbVersionAtLeast800(database?.data?.config?.version);

// Safe array access with index
const firstTemplate = resp?.serviceGroupsTemplates?.[0];
const nextService = service || availableServices?.[0];
```

### Resource Accessibility (RA) Flags
- Backend provides Create/Read/Update/Delete permissions
- UI must respect these flags and show appropriate error messages
- Display reason descriptions when operations are forbidden
- Apply flags to relevant controls and panels on every page

```jsx
function ActionButton({ canCreate, createReason }) {
  if (!canCreate) {
    return (
      <Tooltip content={createReason}>
        <Button disabled>Create</Button>
      </Tooltip>
    );
  }
  return <Button onClick={handleCreate}>Create</Button>;
}
```

---

## Scope Discipline

### Task Approach
1. **Verify** the issue exists (not reporter misunderstanding)
2. **Identify** the goal clearly (What needs to be done?)
3. **Break down** into smaller steps if necessary
4. **Define** success criteria (When is task complete?)
5. **Avoid scope creep**—stick to original objective

### Benefits
- Prevents wasted effort on unnecessary additions
- Increases efficiency by maintaining focus
- Ensures timely completion without delays
- Maintains quality by preventing rushed work

---

## Backward Compatibility

### Routing Changes
- Reuse existing routes when changing from single to multi-tab layouts
- Ensure old paths still work and redirect appropriately
- Test legacy URL patterns after route changes

---

This document serves as the definitive guide for UI development practices. Adherence to these rules is required for PR approval and code merge. For detailed examples and implementation specifics, refer to team README files and codebase comments.