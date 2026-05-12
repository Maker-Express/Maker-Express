"""Tests for scripts/validate_md.py"""
import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))
from validate_md import validate_file, parse_rows  # noqa: E402


def make_md(entries: list[dict]) -> str:
    """Build a minimal MD file with one section per entry dict."""
    lines = ["# Test File\n"]
    for e in entries:
        lines.append(f"### {e.get('name', 'Entry')}\n")
        lines.append("| Field | Value |\n|---|---|\n")
        for k, v in e.items():
            if k == "name":
                continue
            lines.append(f"| **{k}** | {v} |\n")
    return "".join(lines)


def write_tmp(tmp_path: Path, content: str) -> Path:
    f = tmp_path / "test.md"
    f.write_text(content, encoding="utf-8")
    return f


# ── Happy path ────────────────────────────────────────────────────────────────

def test_valid_entry_produces_no_errors(tmp_path):
    content = make_md([{
        "name": "Test Lab",
        "slug": "`test-lab-01`",
        "location": "Bangalore, Karnataka",
        "access": "L1 — open to students",
    }])
    errs = validate_file(write_tmp(tmp_path, content))
    assert errs == []


def test_valid_entry_with_website_url(tmp_path):
    content = make_md([{
        "name": "Test Lab",
        "slug": "`valid-lab`",
        "location": "Mumbai, Maharashtra",
        "access": "L0",
        "website": "https://example-lab.in",
    }])
    errs = validate_file(write_tmp(tmp_path, content))
    assert errs == []


def test_multiple_valid_entries_no_errors(tmp_path):
    content = make_md([
        {"name": "Lab A", "slug": "`lab-a`", "location": "Delhi, Delhi", "access": "L2"},
        {"name": "Lab B", "slug": "`lab-b`", "location": "Chennai, Tamil Nadu", "access": "L0"},
    ])
    errs = validate_file(write_tmp(tmp_path, content))
    assert errs == []


# ── Slug validation ───────────────────────────────────────────────────────────

def test_missing_slug_returns_error(tmp_path):
    content = make_md([{"name": "No Slug", "location": "Pune, Maharashtra", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("Missing required field: slug" in str(e) for e in errs)


def test_slug_with_underscores_returns_error(tmp_path):
    content = make_md([{"name": "Bad Slug", "slug": "my_lab", "location": "Pune, Maharashtra", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("Invalid slug format" in str(e) for e in errs)


def test_slug_is_normalized_to_lowercase(tmp_path):
    # The validator lowercases before checking, so My-Lab → my-lab (valid)
    content = make_md([{"name": "OK", "slug": "My-Lab", "location": "Pune, Maharashtra", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    format_errs = [e for e in errs if "Invalid slug format" in str(e)]
    assert format_errs == []


def test_slug_with_spaces_returns_error(tmp_path):
    content = make_md([{"name": "Bad", "slug": "my lab", "location": "Pune, Maharashtra", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("Invalid slug format" in str(e) for e in errs)


def test_slug_too_short_returns_error(tmp_path):
    content = make_md([{"name": "X", "slug": "ab", "location": "Pune, Maharashtra", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("Invalid slug format" in str(e) for e in errs)


def test_duplicate_slug_returns_error(tmp_path):
    content = make_md([
        {"name": "Lab A", "slug": "`dup-slug`", "location": "Pune, Maharashtra", "access": "L1"},
        {"name": "Lab B", "slug": "`dup-slug`", "location": "Mumbai, Maharashtra", "access": "L2"},
    ])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("Duplicate slug" in str(e) for e in errs)


def test_placeholder_slug_returns_error(tmp_path):
    content = make_md([{"name": "X", "slug": "your-lab-here", "location": "Pune, Maharashtra", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("placeholder" in str(e).lower() for e in errs)


# ── Location validation ───────────────────────────────────────────────────────

def test_missing_location_returns_error(tmp_path):
    content = make_md([{"name": "X", "slug": "`good-slug`", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("location" in str(e).lower() for e in errs)


def test_location_without_comma_returns_error(tmp_path):
    content = make_md([{"name": "X", "slug": "`good-slug`", "location": "Bangalore Karnataka", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("location" in str(e).lower() for e in errs)


def test_location_empty_city_returns_error(tmp_path):
    content = make_md([{"name": "X", "slug": "`good-slug`", "location": ", Karnataka", "access": "L1"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("city" in str(e).lower() for e in errs)


# ── Access level validation ───────────────────────────────────────────────────

def test_missing_access_returns_error(tmp_path):
    content = make_md([{"name": "X", "slug": "`good-slug`", "location": "Pune, Maharashtra"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("access" in str(e).lower() for e in errs)


def test_invalid_access_level_returns_error(tmp_path):
    content = make_md([{"name": "X", "slug": "`good-slug`", "location": "Pune, Maharashtra", "access": "open"}])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("Invalid access level" in str(e) for e in errs)


def test_all_valid_access_levels(tmp_path):
    for level in range(5):
        content = make_md([{
            "name": "Lab",
            "slug": f"`lab-l{level}`",
            "location": "Pune, Maharashtra",
            "access": f"L{level}",
        }])
        errs = validate_file(write_tmp(tmp_path, content))
        access_errs = [e for e in errs if "access" in str(e).lower()]
        assert access_errs == [], f"L{level} should be valid but got: {access_errs}"


# ── URL / placeholder validation ─────────────────────────────────────────────

def test_invalid_website_url_returns_error(tmp_path):
    content = make_md([{
        "name": "X", "slug": "`good-slug`", "location": "Pune, Maharashtra",
        "access": "L1", "website": "not-a-url",
    }])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("not a valid URL" in str(e) for e in errs)


def test_placeholder_website_returns_error(tmp_path):
    content = make_md([{
        "name": "X", "slug": "`good-slug`", "location": "Pune, Maharashtra",
        "access": "L1", "website": "https://example.com/lab",
    }])
    errs = validate_file(write_tmp(tmp_path, content))
    assert any("placeholder" in str(e).lower() for e in errs)


def test_em_dash_website_is_ok(tmp_path):
    content = make_md([{
        "name": "X", "slug": "`good-slug`", "location": "Pune, Maharashtra",
        "access": "L1", "website": "—",
    }])
    errs = validate_file(write_tmp(tmp_path, content))
    url_errs = [e for e in errs if "URL" in str(e)]
    assert url_errs == []


# ── parse_rows helper ─────────────────────────────────────────────────────────

def test_parse_rows_extracts_backtick_slug():
    block = "| **Slug** | `my-lab` |\n| **Access** | L1 |\n"
    rows = parse_rows(block)
    assert rows["slug"] == "my-lab"


def test_parse_rows_lowercases_keys():
    block = "| **Access Level** | L2 |\n"
    rows = parse_rows(block)
    assert "access_level" in rows
