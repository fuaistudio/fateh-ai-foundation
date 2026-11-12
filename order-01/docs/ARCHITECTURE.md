# FATEH AI — Architecture baseline

## Product identity
FATEH AI is an AI operating-assistant platform. The web dashboard is its control surface; the backend, agent runtime, provider router, tools, memory and studio pipelines provide the capabilities.

## Core design rules
- Build from a clean architecture; old projects are references only and must not be overwritten.
- One file = one responsibility.
- Provider-neutral interfaces: user-facing provider label is `Used: FATEH`.
- No fake completion states: show a capability as available only after its integration and tests pass.
- Least privilege, explicit approval for sensitive actions, and auditable execution.
- Free-first development; paid APIs may be added later.

## Planned 300 core modules
| Domain | Planned modules |
|---|---:|
| UI and screens | 35 |
| AI brain and router | 30 |
| Master and specialist agents | 55 |
| Tools and integrations | 45 |
| Memory and knowledge | 20 |
| Backend and database | 35 |
| Security and privacy | 25 |
| User and personalization | 15 |
| Admin and analytics | 20 |
| Testing and deployment | 20 |
| **Total** | **300** |

## Target runtime flow
User request -> policy/permission check -> Master Agent planner -> specialist agents -> provider-neutral model router and tools -> execution sandbox / integrations -> verification and quality judge -> result, logs and memory update (when permitted).

## Build orders
1. Foundation: repository structure, API, database connection, dashboard shell, health checks, project CRUD, test baseline.
2. Intelligence: provider adapter contract, model router, task classification, Master Agent planner, memory contracts.
3. Agent workforce: specialist registry, task queue, delegation, temporary-agent lifecycle, tool permissions and audit events.
4. Studios: studio registry and production pipelines; enable each studio only when its required engines and tests exist.
5. Productization: full UI, owner controls, multilingual UX, hardening, observability, security review, deployment and acceptance tests.

## Order 01 status
Implemented in this starter: FastAPI service, SQLAlchemy database layer (SQLite local / PostgreSQL via URL), health endpoint, project create/list API, responsive dashboard shell, Docker Compose PostgreSQL option, and API tests.

Not yet implemented: real authentication, production migrations, encrypted provider-key vault, AI provider calls, Master Agent runtime, studio execution engines, deployment automation. These are deliberately not represented as completed.
