"""
This module contains functionality to load the PostgreSQL
configuration from a file.
"""

from configparser import ConfigParser

def load_config(filename='database.ini', section='postgresql_local'):
    parser = ConfigParser()
    parser.read(filename)

    # get section, default to postgresql
    config_data = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            config_data[param[0]] = param[1]
    else:
        raise KeyError(f'Section {section} not found in the {filename} file')

    return config_data

if __name__ == '__main__':
    config = load_config()
    print(config)
