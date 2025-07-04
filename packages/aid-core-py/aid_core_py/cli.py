import argparse
import json
import sys
from . import validate_manifest, validate_txt, validate_pair


def main() -> None:
    parser = argparse.ArgumentParser("aid-validate (Python)")
    parser.add_argument("path", nargs="?", help="Path to artefact (.json or .txt). If omitted, reads stdin.")
    parser.add_argument("second", nargs="?", help="Optional second artefact for pair validation.")
    parser.add_argument("--quiet", action="store_true", help="Suppress output; use exit code only.")
    args = parser.parse_args()

    def read_file(p):
        if p:
            with open(p, "r", encoding="utf-8") as fh:
                return fh.read()
        return sys.stdin.read()

    try:
        if args.second:
            # pair validation
            manifest_str = read_file(args.path)
            txt_str = read_file(args.second)
            validate_pair(json.loads(manifest_str), txt_str)
        else:
            content = read_file(args.path)
            if args.path and args.path.endswith(".txt"):
                validate_txt(content)
            else:
                validate_manifest(json.loads(content))
        if not args.quiet:
            print("✓ validation passed")
        sys.exit(0)
    except Exception as e:
        if not args.quiet:
            print("❌", e, file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main() 