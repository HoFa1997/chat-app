install:
	echo "" > packages/supabase/seed.sql
	cat packages/supabase/scripts/*.sql >> packages/supabase/seed.sql
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
	@read -p "Are you sure you want to reset the database? [y/N]: " confirm && \
		[ $$confirm = y ] && \
		echo "" > packages/supabase/seed.sql && \
		cd packages/supabase && pnpm db:reset

supabase-seed:
	echo "" > packages/supabase/seed.sql
	cat packages/supabase/scripts/*.sql >> packages/supabase/seed.sql
	psql -h 127.0.0.1 -p 54322 -d postgres -U postgres -f packages/supabase/seed.sql
