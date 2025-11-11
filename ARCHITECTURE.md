# Architecture Diagram

## System Architecture

                      ┌─────────────────────────────────┐
                      │        Telegram Platform        │
                      └─────────────────────────────────┘
                                 │
                                 ▼
                      ┌─────────────────────────────────┐
                      │     Portfolio Sentinel Bot      │
                      │                                 │
                      │  ┌─────────────────────────┐    │
                      │  │      Command Router     │    │
                      │  └─────────────────────────┘    │
                      │              │                  │
                      │  ┌───────────┼───────────┐      │
                      │  │           │           │      │
                      │  ▼           ▼           ▼      │
                      │┌──────┐   ┌──────┐   ┌──────┐   │
                      ││Start │   │Port- │   │Status│   │
                      ││Handler│  │folio │   │Handler│  │
                      │└──────┘   │Handler│   └──────┘   │
                      │           └──────┘              │
                      └─────────────────────────────────┘
                                 │
                                 ▼
                      ┌─────────────────────────────────┐
                      │         Service Layer           │
                      │                                 │
                      │  ┌─────────────────────────┐    │
                      │  │    BlockchainService    │─────┼───▶ Alchemy API
                      │  └─────────────────────────┘    │
                      │                                 │
                      │  ┌─────────────────────────┐    │
                      │  │      PriceService       │─────┼───▶ CoinGecko API
                      │  └─────────────────────────┘    │
                      └─────────────────────────────────┘

## Data Flow Sequence

1. User → Telegram → Bot Command → Service Layer → External APIs → Response → User
