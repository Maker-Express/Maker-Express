"""Post skill scan results as a PR comment. Called from verify-skill.yml."""
import os
import subprocess
import sys


def main() -> int:
    exit_code = int(os.environ.get("SCAN_EXIT_CODE", "0"))
    pr_number = os.environ.get("PR_NUMBER", "")
    scan_output_path = os.environ.get("SCAN_OUTPUT", "/tmp/scan_output.txt")

    try:
        with open(scan_output_path) as f:
            output = f.read().strip()
    except FileNotFoundError:
        output = "(no output)"

    if exit_code == 2:
        header = "### Skill security scan — FAILED"
        summary = "Security issues were found. This PR **cannot be merged** until they are resolved."
        label_add = "skill-security-fail"
        label_remove = "skill-security-pass"
    elif exit_code == 1:
        header = "### Skill security scan — warnings"
        summary = "Quality warnings found. Maintainer review required before merge."
        label_add = "skill-quality-warning"
        label_remove = "skill-security-fail"
    else:
        header = "### Skill security scan — passed"
        summary = "No security or quality issues found."
        label_add = "skill-security-pass"
        label_remove = "skill-security-fail"

    body = (
        f"{header}\n\n{summary}\n\n"
        f"<details><summary>Scanner output</summary>\n\n```\n{output}\n```\n\n</details>\n\n"
        f"---\n_Powered by [hardstack.xyz](https://hardstack.xyz)_"
    )

    subprocess.run(["gh", "pr", "comment", pr_number, "--body", body], check=True)
    subprocess.run(["gh", "pr", "edit", pr_number, "--remove-label", label_remove], check=False)
    subprocess.run(["gh", "pr", "edit", pr_number, "--add-label", label_add], check=False)

    return 0


if __name__ == "__main__":
    sys.exit(main())
