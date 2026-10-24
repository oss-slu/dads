"""
Module Dcstring: This file manages interactions
between frontend and backend
"""

from dads.app import create_app

app = create_app()

if __name__ == '__main__':
    app.run()
