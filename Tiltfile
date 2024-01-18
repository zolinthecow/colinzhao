# Tiltfile

# Load docker compose
docker_compose('./docker-compose.yml')

docker_build(
  'codechat-backend',
  './infra',
  match_in_env_vars=True,
  live_update=[
    sync('apps/backend', '/app/apps/backend'),
    sync('packages', '/app/packages'),
    restart_container()
  ]
)

dc_resource(
  'server',
  labels=['BackendAPI']
)
dc_resource(
  'postgres',
  labels=['BackendAPI']
)

local_resource(
  'codechat-frontend',
  serve_cmd='cd apps/frontend && pnpm i && pnpm run dev',
  labels=["Frontend"]
)
