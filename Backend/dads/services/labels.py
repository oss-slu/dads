"""Construct human-readable model labels from database rows."""


def construct_label(data) -> str:
    """Build the standard 1.sigma_one.sigma_two.ordinal label string."""
    return (
        '1.'
        + data['sigma_one']
        + '.'
        + data['sigma_two']
        + '.'
        + str(data['ordinal'])
    )
