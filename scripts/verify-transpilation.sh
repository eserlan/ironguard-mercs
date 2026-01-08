#!/bin/bash
# scripts/verify-transpilation.sh
# Scans the 'out' directory for illegal transpilation patterns that cause runtime errors.

TARGET_DIR="out"
ERRORS=0

echo "[Sanity Check] Verifying Luau transpilation in $TARGET_DIR..."

# 1. Check for library-as-object-call pattern (e.g. os:time instead of os.time)
# This usually happens if a global is mis-declared in a .d.ts file.
ILLEGAL_COLON_PATTERNS=("os:time" "os:clock" "math:random" "math:abs" "math:max" "math:min")

for PATTERN in "${ILLEGAL_COLON_PATTERNS[@]}"; do
    FOUND=$(grep -r "$PATTERN" "$TARGET_DIR")
    if [ ! -z "$FOUND" ]; then
        echo "FAIL: Found illegal pattern '$PATTERN' in generated Lua:"
        echo "$FOUND"
        ERRORS=$((ERRORS + 1))
    fi
done

if [ $ERRORS -eq 0 ]; then
    echo "[Sanity Check] PASSED: No illegal transpilation patterns found."
fi

# 2. Optionally check for expected dot-notation patterns to catch missing globals (e.g. os.time)
# This is a non-fatal warning-only check to avoid changing existing pass/fail behavior.
REQUIRED_DOT_PATTERNS=("os.time" "os.clock")

for PATTERN in "${REQUIRED_DOT_PATTERNS[@]}"; do
    FOUND=$(grep -r "$PATTERN" "$TARGET_DIR")
    if [ -z "$FOUND" ]; then
        echo "WARN: Pattern '$PATTERN' not found in $TARGET_DIR. If your code relies on this API, ensure the corresponding global is declared at runtime."
    fi
done

exit $?
