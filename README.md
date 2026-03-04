# YouTube Premium Tab

## Overview

Premium tab for the homeserver platform: download YouTube videos with **yt-dlp**, manage channel subscriptions, and run nightly subscription checks. Supports manual URL downloads, per-channel audio-only, configurable quality/format, optional hardlink into media library, and in-tab yt-dlp updates. See the [premium tab system](../../README.md) for platform context.

## Directory Structure

```
youtube/
├── index.json              # Tab manifest (files, backend, frontend, permissions)
├── homeserver.patch.json   # Tab config (displayName, adminOnly, order)
├── backend/
│   ├── routes.py           # Flask blueprint /api/youtube
│   ├── youtube_manager.py  # yt-dlp downloads, archive, logs, hardlink
│   └── subscription_manager.py  # Subscriptions, settings, cron schedule
├── frontend/
│   ├── index.tsx           # Tab UI (download | config | subscriptions | logs)
│   ├── types.ts
│   ├── hooks/useYoutubeControls.ts
│   └── components/        # DownloadForm, SubscriptionList, ScheduleConfig, DownloadSettings, LogsView
├── permissions/
│   └── flask-youtube       # Sudoers: crontab, yt-dlp, pip, gunicorn restart
└── system/
    └── dependencies.json   # pip: yt-dlp
```

## Features

- **Manual download**: URL + quality/format; optional audio-only; optional hardlink to `/mnt/nas/media/YouTube`.
- **Subscriptions**: Add/remove channels; per-subscription audio-only; one-shot “fetch” for a channel.
- **Schedule**: Enable/disable and set time for nightly subscription check (cron).
- **Settings**: Global quality, format, and auto-hardlink; apply to manual and subscription downloads.
- **Logs**: View download log in the tab.
- **yt-dlp update**: In-tab button to upgrade yt-dlp and restart gunicorn.

## Data and Paths

| Purpose           | Path |
|------------------|------|
| Download output  | `/mnt/nas/youtube/` (by channel subdir) |
| Media hardlink   | `/mnt/nas/media/YouTube/` (optional) |
| Archive (no re-dl)| `/mnt/nas/youtube/downloaded.txt` |
| Subscriptions    | `/var/www/homeserver/data/youtube/subscriptions.json` |
| Settings         | `/var/www/homeserver/data/youtube/settings.json` |
| Tab logs         | `/var/www/homeserver/premium/youtube_logs.txt` |
| Cron script      | `/usr/local/bin/youtube-subscription-check.sh` |

## API (prefix `/api/youtube`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/download` | Download from URL. Body: `url`, optional `quality`, `format`, `audio_only`, `auto_hardlink` follows settings. |
| POST   | `/download/info` | Get video info only. Body: `url`. |
| GET    | `/subscriptions` | List subscriptions. |
| POST   | `/subscriptions` | Add subscription. Body: `url`, optional `name`, `audio_only`. |
| DELETE | `/subscriptions/<channel_id>` | Remove subscription. |
| POST   | `/subscriptions/<channel_id>/fetch` | Run download for that channel now. |
| GET    | `/settings` | Get quality, format, auto_hardlink. |
| POST   | `/settings` | Update settings. |
| GET    | `/schedule` | Get cron schedule (enabled, hour, minute). |
| POST   | `/schedule` | Update schedule. Body: `enabled`, `hour`, `minute`. |
| GET    | `/logs` | Get download log lines. |
| POST   | `/update-ytdlp` | Upgrade yt-dlp and restart gunicorn. |

Responses use homeserver standard: `{ success: boolean, ... }`.

## Configuration

- **Tab**: `homeserver.patch.json` — `displayName`: "YouTube", `adminOnly`: true, `order`: 90.
- **Runtime**: Subscriptions/settings in `data/youtube/`; cron script and schedule managed by the backend.

## Requirements

- `yt-dlp` (pip, via system/dependencies.json).
- `/mnt/nas/youtube` exists and writable by the process that runs yt-dlp (sudo).
- Optional: linker at `/usr/local/lib/linker` for hardlink to `/mnt/nas/media/YouTube`; if missing, hardlink is skipped.

## Installation

```bash
sudo python3 /var/www/homeserver/premium/installer.py install youtube
```

## Usage

1. **Download**: Open tab → Download section → paste URL, set quality/audio if desired → Download.
2. **Subscriptions**: Subscriptions section → Add (channel URL, optional name, audio-only) → remove or “Fetch now” per channel.
3. **Schedule**: Config → set time and enable/disable nightly check.
4. **Settings**: Config → quality, format, auto-hardlink.
5. **Logs**: Logs section to inspect download output.
6. **Update yt-dlp**: Config → update button (restarts gunicorn).

## Development

After code changes, sync and reinstall:

```bash
rsync -av --delete ./youtube/ root@server:/var/www/homeserver/premium/youtube/
ssh root@server 'sudo python3 /var/www/homeserver/premium/installer.py reinstall youtube'
```

Rebuild frontend if UI changed; restart gunicorn after backend changes (reinstall does not always restart — restart explicitly if needed).

## Troubleshooting

- **Downloads fail**: Check `/mnt/nas/youtube` exists and permissions; run `yt-dlp -U` (or use in-tab update); check `youtube_logs.txt`.
- **Cron not running**: Verify cron script exists and is executable; check root crontab for `homeserver-youtube-subscriptions` entry.
- **Hardlink option does nothing**: Linker must be installed at `/usr/local/lib/linker`; otherwise only direct download to `/mnt/nas/youtube` is used.
