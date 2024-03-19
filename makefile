.PHONY: install back-start back-stop front-dev local supabase-status supabase-reset supabase-seed prepare-seed

install:
	pnpm install

back-start:
	cd packages/supabase && pnpm start

back-stop:
	cd packages/supabase && pnpm stop

front-dev:
	cd packages/web && pnpm dev

local:
	make -j 2 back-start front-dev

supabase-status:
	cd packages/supabase && pnpm status

# Resets the local database to a clean state.
supabase-reset:
	@echo "Resetting the database..."
	@read -p "Are you sure you want to reset the database? [y/N]: " confirm; \
	if [ "$$confirm" = "y" ]; then \
		make prepare-seed && \
		cd packages/supabase && pnpm db:reset; \
	else \
		echo "Database reset canceled."; \
	fi

# Prepare seed.sql by clearing its contents
prepare-seed:
	@echo "Preparing seed file..."
	echo "" > packages/supabase/seed.sql

# Seed the database
supabase-seed:
	make prepare-seed
	cat packages/supabase/scripts/*.sql >> packages/supabase/seed.sql
	psql -h 127.0.0.1 -p 54322 -d postgres -U postgres -f packages/supabase/seed.sql
