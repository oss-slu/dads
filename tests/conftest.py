"""
Module docstring: This module contains fixtures and configuration for tests.
"""

import sys
import os

# This code will run before any tests are executed
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
    )
