import os
from pathlib import Path

import psycopg
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = (
        "Apply Supabase SQL schema files using the configured DATABASE_URL. "
        "Defaults to running recipes/sql/0001_initial_schema.sql."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=str,
            help="Optional path to a SQL file to execute. Defaults to the initial schema file.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print the SQL that would be executed without applying it.",
        )

    def handle(self, *args, **options):
        sql_path = options.get("path")
        dry_run = options.get("dry_run", False)

        if sql_path:
            sql_file = Path(sql_path)
        else:
            sql_file = (
                Path(settings.BASE_DIR)
                / "recipes"
                / "sql"
                / "0001_initial_schema.sql"
            )

        if not sql_file.exists():
            raise CommandError(f"SQL file not found: {sql_file}")

        sql = sql_file.read_text(encoding="utf-8").strip()
        if not sql:
            self.stdout.write(self.style.WARNING("SQL file is empty; aborting."))
            return

        database_url = os.environ.get("DATABASE_URL")
        if not database_url:
            raise CommandError(
                "DATABASE_URL is not set. Update your .env with Supabase connection string."
            )
        if database_url.startswith("sqlite"):
            raise CommandError(
                "Supabase migrations require a PostgreSQL DATABASE_URL, not SQLite."
            )

        self.stdout.write(self.style.NOTICE(f"Using SQL file: {sql_file}"))

        if dry_run:
            self.stdout.write(sql)
            self.stdout.write(self.style.SUCCESS("Dry run complete."))
            return

        try:
            with psycopg.connect(database_url, autocommit=True) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql)
        except Exception as exc:  # pragma: no cover - error path
            raise CommandError(f"Failed to execute SQL: {exc}") from exc

        self.stdout.write(self.style.SUCCESS("Supabase schema applied successfully."))


