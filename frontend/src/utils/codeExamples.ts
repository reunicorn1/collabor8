export type LanguageCode =
  | 'javascript'
  | 'python'
  | 'c'
  | 'typescript'
  | 'markdown'
  | 'html'
  | 'unknown';

export const codeExamples: Record<LanguageCode, string> = {
  javascript: `// JavaScript Example: Function to Calculate Factorial
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// Test the function
console.log('Factorial of 5:', factorial(5)); // Output: Factorial of 5: 120
`,

  python: `# Python Example: Function to Calculate Factorial
def factorial(n):
    """Return the factorial of n."""
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

# Test the function
print('Factorial of 5:', factorial(5))  # Output: Factorial of 5: 120
`,

  c: `/* C Example: Function to Calculate Factorial */
#include <stdio.h>

// Function to calculate factorial
int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    // Test the function
    printf("Factorial of 5: %d\\n", factorial(5)); // Output: Factorial of 5: 120
    return 0;
}
`,

  typescript: `// TypeScript Example: Function to Calculate Factorial
function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// Test the function
console.log('Factorial of 5:', factorial(5)); // Output: Factorial of 5: 120
`,

  markdown: `# Markdown Example

## Introduction

This is an example of Markdown syntax. Markdown is a lightweight markup language with plain text formatting syntax.

### Features

- **Bold Text**: \`**bold**\`
- *Italic Text*: \`*italic*\`
- [Link](https://www.example.com)

### Code Example

\`\`\`javascript
console.log('Hello World');
\`\`\`
`,

  html: `<!-- HTML Example: Simple Web Page -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <header>
        <h1>Hello World</h1>
    </header>
    <main>
        <p>This is a simple HTML example.</p>
    </main>
    <footer>
        <p>&copy; 2024 Example Corp.</p>
    </footer>
</body>
</html>
`,
  unknown: `// Unknown Language Example`,
};
