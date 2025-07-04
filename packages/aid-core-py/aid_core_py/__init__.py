from __future__ import annotations

from importlib import resources
import json
from pathlib import Path
from typing import Any, Dict, Union, List

import jsonschema

# Load canonical schema bundled in the package
_SCHEMA_PATH = resources.files(__package__).joinpath("aid.schema.json")
with _SCHEMA_PATH.open("r", encoding="utf-8") as _fh:
    _SCHEMA = json.load(_fh)

# ---------------- Runtime helpers ---------------- #
JsonLike = Union[str, bytes, Dict[str, Any]]


def _ensure_json(data: JsonLike) -> Dict[str, Any]:
    if isinstance(data, (bytes, str)):
        return json.loads(data)
    return data  # assume dict-like already


def validate_manifest(manifest: JsonLike) -> None:
    """Raise jsonschema.ValidationError if manifest is invalid per canonical schema."""
    jsonschema.validate(instance=_ensure_json(manifest), schema=_SCHEMA)


def _parse_txt(txt: str) -> Dict[str, str]:
    parts = [p.strip() for p in txt.strip().split(";") if p.strip()]
    kv: Dict[str, str] = {}
    for part in parts:
        if "=" not in part:
            continue
        k, v = part.split("=", 1)
        kv[k] = v
    return kv


def validate_txt(txt: str) -> bool:
    """Return True if the TXT record string looks like a valid AID v1 record."""
    txt = txt.strip()
    # Extract the portion that starts with v=aid1
    if "v=aid1" not in txt:
        raise ValueError("TXT record missing 'v=aid1'")
    start = txt.index("v=aid1")
    kv_part = txt[start:]
    kv_part = kv_part.strip('"')
    kv = _parse_txt(kv_part)
    if "uri" not in kv and "config" not in kv:
        raise ValueError("TXT record must contain either 'uri' or 'config' key")
    return True


def validate_pair(manifest: JsonLike, txt: str) -> None:
    validate_manifest(manifest)
    validate_txt(txt)


__all__ = [
    "validate_manifest",
    "validate_txt",
    "validate_pair",
    "build_txt_record",
]

# ---------------- Generator helper ---------------- #

def build_txt_record(
    cfg: Dict[str, Any],
    manifest_path: str = "/.well-known/aid.json",
    ttl: int = 3600,
) -> str:
    """Build a DNS TXT record string equivalent to TS implementation."""
    domain: str = (cfg.get("domain") or "").rstrip(".")
    record_name = f"_agent.{domain}."

    parts: List[str] = ["v=aid1"]
    if env := cfg.get("env"):
        parts.append(f"env={env}")

    implementations = cfg.get("implementations", [])

    def is_complex() -> bool:
        if len(implementations) > 1:
            return True
        if len(implementations) == 1:
            impl = implementations[0]
            if impl.get("type") == "local":
                return True
            # extra fields
            for key in ("requiredConfig", "requiredPaths", "certificate", "platformOverrides"):
                if impl.get(key):
                    return True
        return False

    # primary remote impl
    primary_remote = next((i for i in implementations if i.get("type") == "remote"), None)
    if primary_remote:
        parts.append(f"uri={primary_remote['uri']}")
        parts.append(f"proto={primary_remote['protocol']}")
        if primary_remote.get("authentication", {}).get("scheme") != "none":
            parts.append(f"auth={primary_remote['authentication']['scheme']}")

    if is_complex() and domain:
        manifest_url = f"https://{domain}{manifest_path}"
        parts.append(f"config={manifest_url}")

    record_value = ";".join(parts)
    return f"{record_name} {ttl} IN TXT \"{record_value}\"" 