import json
from pathlib import Path

import pytest

from aid_core_py import validate_manifest, validate_txt, validate_pair, build_txt_record

ROOT = Path(__file__).resolve().parents[3]
FIXTURES_DIR = ROOT / "packages" / "aid-conformance" / "tests" / "fixtures"
VALID_DIR = FIXTURES_DIR / "valid"
INVALID_DIR = FIXTURES_DIR / "invalid"


@pytest.mark.parametrize("manifest_path", [p for p in VALID_DIR.glob("*.json") if p.exists()])
def test_valid_manifest(manifest_path):
    content = manifest_path.read_text(encoding="utf-8")
    # Expect no exception
    validate_manifest(json.loads(content))


@pytest.mark.parametrize("manifest_path", [p for p in INVALID_DIR.glob("*.json") if p.exists()])
def test_invalid_manifest(manifest_path):
    content = manifest_path.read_text(encoding="utf-8")
    with pytest.raises(Exception):
        validate_manifest(json.loads(content))


def test_validate_txt_basic():
    txt = '_agent.example.com. 3600 IN TXT "v=aid1;uri=https://api.example.com;proto=mcp"'
    assert validate_txt(txt)


def test_validate_pair():
    manifest = {
        "schemaVersion": "1",
        "name": "Simple Service",
        "implementations": [
            {
                "type": "remote",
                "name": "prod",
                "title": "prod",
                "protocol": "mcp",
                "uri": "https://api.example.com",
                "authentication": {"scheme": "none"}
            }
        ]
    }
    txt = build_txt_record({"domain": "example.com", "implementations": [
        {
            "type": "remote",
            "name": "prod",
            "title": "prod",
            "protocol": "mcp",
            "uri": "https://api.example.com",
            "authentication": {"scheme": "none"}
        }
    ]})
    validate_pair(manifest, txt) 