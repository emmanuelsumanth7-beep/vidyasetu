import os
import glob

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace hardcoded light mode classes with theme-aware classes
    replacements = {
        'bg-white': 'glass-card',
        'border-gray-100': 'border-[var(--color-border)]',
        'border-gray-200': 'border-[var(--color-border)]',
        'text-ink-primary': 'text-[var(--color-text-primary)]',
        'text-ink-secondary': 'text-[var(--color-text-secondary)]',
        'bg-gray-50': 'bg-black/5 dark:bg-white/5',
        'bg-gray-100': 'bg-black/10 dark:bg-white/10',
    }
    
    new_content = content
    for old, new in replacements.items():
        # Careful not to replace 'glass-card glass-card' if it's already there
        # But this is a simple script, it should be fine.
        new_content = new_content.replace(old, new)
        
    # Clean up duplicate glass-card
    new_content = new_content.replace('glass-card glass-card', 'glass-card')
    new_content = new_content.replace('glass-card rounded-3xl overflow-hidden glass-card', 'glass-card rounded-3xl overflow-hidden')
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

# Fix specific files that have issues
files_to_fix = [
    'src/app/dashboard/leaves/page.tsx',
    'src/app/dashboard/expenses/page.tsx',
    'src/app/dashboard/payroll/page.tsx',
    'src/app/dashboard/approvals/page.tsx',
    'src/app/dashboard/classes/page.tsx',
]

for f in files_to_fix:
    if os.path.exists(f):
        fix_file(f)

# Also remove ThemeToggle from layout.tsx and page.tsx
def remove_theme_toggle(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if '<ThemeToggle' in line or 'import { ThemeToggle }' in line:
            continue
        new_lines.append(line)
        
    with open(filepath, 'w') as f:
        f.writelines(new_lines)

remove_theme_toggle('src/app/dashboard/layout.tsx')
remove_theme_toggle('src/app/dashboard/page.tsx')
remove_theme_toggle('src/app/dashboard/settings/page.tsx')
remove_theme_toggle('src/components/Sidebar.tsx')
remove_theme_toggle('src/components/Header.tsx')

print("Done")
