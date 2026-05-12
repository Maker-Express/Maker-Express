"""Tests for scripts/agent_validate.py"""
import json
import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))
from agent_validate import main as av_main  # noqa: E402


def run(resource_type: str, entries: object, monkeypatch) -> int:
    """Run agent_validate.main() with the given env vars and return its exit code."""
    entries_raw = json.dumps(entries) if not isinstance(entries, str) else entries
    monkeypatch.setenv("RESOURCE_TYPE", resource_type)
    monkeypatch.setenv("ENTRIES_JSON", entries_raw)
    return av_main()


# ── Happy path ────────────────────────────────────────────────────────────────

def test_valid_type_and_single_entry_returns_0(monkeypatch):
    entries = [{"name": "Test Lab", "slug": "test-lab-01", "city": "Bangalore", "state": "Karnataka"}]
    assert run("testing-lab", entries, monkeypatch) == 0


def test_valid_type_with_20_entries_returns_0(monkeypatch):
    entries = [
        {"name": f"Lab {i}", "slug": f"lab-{i:02d}", "city": "Pune", "state": "Maharashtra"}
        for i in range(1, 21)
    ]
    assert run("makerspace", entries, monkeypatch) == 0


def test_all_valid_resource_types_return_0(monkeypatch):
    valid_types = [
        "testing-lab", "pcb-fab", "makerspace", "manufacturer",
        "component-supplier", "distributor", "prototyping-lab",
        "research-lab", "certification-body", "accelerator", "online-tool",
        "laser-scanning", "funding",
    ]
    entry = [{"name": "X", "slug": "valid-slug", "city": "Delhi", "state": "Delhi"}]
    for t in valid_types:
        result = run(t, entry, monkeypatch)
        assert result == 0, f"Type '{t}' should be valid but got {result}"


# ── Type validation ───────────────────────────────────────────────────────────

def test_unknown_resource_type_returns_1(monkeypatch, capsys):
    entries = [{"name": "X", "slug": "x", "city": "Delhi", "state": "Delhi"}]
    result = run("not-a-type", entries, monkeypatch)
    assert result == 1
    out = capsys.readouterr().out
    assert "Unknown resource type" in out


def test_empty_resource_type_returns_1(monkeypatch, capsys):
    entries = [{"name": "X", "slug": "x", "city": "Delhi", "state": "Delhi"}]
    result = run("", entries, monkeypatch)
    assert result == 1


# ── JSON parsing ──────────────────────────────────────────────────────────────

def test_invalid_json_returns_1(monkeypatch, capsys):
    result = run("testing-lab", "{not valid json", monkeypatch)
    assert result == 1
    out = capsys.readouterr().out
    assert "Invalid JSON" in out


def test_empty_string_json_returns_1(monkeypatch, capsys):
    result = run("testing-lab", "", monkeypatch)
    assert result == 1


def test_json_object_instead_of_array_returns_1(monkeypatch, capsys):
    result = run("testing-lab", {"name": "x"}, monkeypatch)
    assert result == 1
    out = capsys.readouterr().out
    assert "non-empty JSON array" in out


def test_empty_array_returns_1(monkeypatch, capsys):
    result = run("testing-lab", [], monkeypatch)
    assert result == 1
    out = capsys.readouterr().out
    assert "non-empty JSON array" in out


# ── Entry count limit ─────────────────────────────────────────────────────────

def test_21_entries_returns_1(monkeypatch, capsys):
    entries = [
        {"name": f"Lab {i}", "slug": f"lab-{i:02d}", "city": "Pune", "state": "Maharashtra"}
        for i in range(1, 22)
    ]
    result = run("testing-lab", entries, monkeypatch)
    assert result == 1
    out = capsys.readouterr().out
    assert "Maximum 20 entries" in out


def test_exactly_20_entries_is_allowed(monkeypatch):
    entries = [
        {"name": f"Lab {i}", "slug": f"lab-{i:02d}", "city": "Pune", "state": "Maharashtra"}
        for i in range(1, 21)
    ]
    assert run("testing-lab", entries, monkeypatch) == 0


# ── Required field validation ─────────────────────────────────────────────────

@pytest.mark.parametrize("missing_field", ["name", "slug", "city", "state"])
def test_missing_required_field_returns_1(monkeypatch, capsys, missing_field):
    entry = {"name": "Test Lab", "slug": "test-lab", "city": "Pune", "state": "Maharashtra"}
    del entry[missing_field]
    result = run("testing-lab", [entry], monkeypatch)
    assert result == 1
    out = capsys.readouterr().out
    assert f"missing required field '{missing_field}'" in out


def test_extra_fields_are_allowed(monkeypatch):
    entries = [{
        "name": "Test Lab", "slug": "test-lab", "city": "Pune", "state": "Maharashtra",
        "website": "https://example.in", "description": "A great lab",
    }]
    assert run("testing-lab", entries, monkeypatch) == 0


# ── Slug format ───────────────────────────────────────────────────────────────

@pytest.mark.parametrize("bad_slug", [
    "My-Lab",       # uppercase
    "my lab",       # space
    "my_lab",       # underscore
    "-starts-dash", # leading dash
    "ends-dash-",   # trailing dash
])
def test_invalid_slug_format_returns_1(monkeypatch, capsys, bad_slug):
    entries = [{"name": "X", "slug": bad_slug, "city": "Pune", "state": "Maharashtra"}]
    result = run("testing-lab", entries, monkeypatch)
    assert result == 1
    out = capsys.readouterr().out
    assert "invalid" in out.lower()


def test_valid_slug_with_digits_returns_0(monkeypatch):
    entries = [{"name": "Lab 3", "slug": "lab-3d-print", "city": "Pune", "state": "Maharashtra"}]
    assert run("testing-lab", entries, monkeypatch) == 0


def test_success_output_contains_count(monkeypatch, capsys):
    entries = [
        {"name": "Lab A", "slug": "lab-a", "city": "Pune", "state": "Maharashtra"},
        {"name": "Lab B", "slug": "lab-b", "city": "Mumbai", "state": "Maharashtra"},
    ]
    run("makerspace", entries, monkeypatch)
    out = capsys.readouterr().out
    assert "2 entries" in out
