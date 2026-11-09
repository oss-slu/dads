"""Abstract database connector interface used by API routes."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Optional, Tuple

from psycopg2 import sql


class DadsConnector(ABC):
    """Interface implemented by Postgres and (future) SQLite connectors."""

    @abstractmethod
    def get_system(self, function_id: Any) -> dict[str, Any]:
        """Return full details for one dynamical system."""

    @abstractmethod
    def get_all_systems(self) -> list[dict[str, Any]]:
        """Return every dynamical system row."""

    @abstractmethod
    def get_selected_systems(self, labels: list[str]) -> list[dict[str, Any]]:
        """Return systems whose labels appear in the given list."""

    @abstractmethod
    def get_filtered_systems(
        self, filters: dict[str, Any]
    ) -> Tuple[list[list[Any]], Any]:
        """Return search result rows and a statistics value for the filters."""

    @abstractmethod
    def get_statistics(self, where_sql: sql.Composed, params: list[Any]) -> Any:
        """Return the count of systems matching a SQL WHERE fragment."""

    @abstractmethod
    def get_family(self, family_id: Any) -> Optional[dict[str, Any]]:
        """Return one family record and its citation text."""

    @abstractmethod
    def get_all_families(self) -> list[dict[str, Any]]:
        """Return every family row."""

    @abstractmethod
    def get_filtered_families(self, filters: dict[str, Any]) -> list[dict[str, Any]]:
        """Return families matching the filter object."""

    @abstractmethod
    def get_rational_periodic_data(self, function_id: Any) -> list[dict[str, Any]]:
        """Return rational preperiodic point rows for a system."""

    @abstractmethod
    def get_label(self, function_id: Any) -> Optional[str]:
        """Return the display label string for a system id."""

    @abstractmethod
    def get_graph_data(self, graph_id: Any) -> Optional[dict[str, Any]]:
        """Return graph data for a portrait graph id."""

    @abstractmethod
    def get_graph_metadata(self, graph_id: Any) -> Optional[dict[str, Any]]:
        """Return summary metadata for a graph id."""

    @abstractmethod
    def is_connection_active(self) -> bool:
        """Return whether the database connection can run a simple query."""

    @abstractmethod
    def build_where_text(
        self, filters: dict[str, Any]
    ) -> Tuple[sql.Composed, list[Any]]:
        """Build a SQL WHERE clause and parameters from search filters."""
