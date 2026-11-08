"""Re-export until scripts use ``dads.config`` (#350)."""

from dads.config import load_config

__all__ = ["load_config"]
