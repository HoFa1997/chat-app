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
