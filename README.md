# YouTube Downloader Premium Tab

## Overview

The YouTube Downloader Premium Tab is an add-on module for the homeserver platform that provides comprehensive YouTube video downloading functionality using `yt-dlp`. It supports manual URL downloads and automated nightly checks for new videos from subscribed channels.

---

## Infinite Army Decomposition System

The Court's infinite army operates through a sophisticated decomposition system that enables parallel execution and hierarchical task management.

### Task Decomposition Table System

When facing complex tasks, the Court uses explicit decomposition to break work into parallel worker streams:

**Explicit Decomposition Requirements:**
- **State Intent Clearly**: Use phrases like "DECOMPOSE INTO N PARALLEL WORKERS" or "You must decompose this task into MULTIPLE WORKERS working in parallel. Do NOT route to a single worker."
- **Define Worker Roles**: Specify what each worker creates:
  ```
  Worker 1 - Core Engine: Create fibonacci_engine.py with...
  Worker 2 - Renderer: Create fibonacci_renderer.py with...
  Worker 3 - Controls: Create controls.py with...
  Worker 4 - Orchestration: Create main.py, requirements.txt, setup_venv.sh...
  ```
- **Specify Output Directory**: Always specify the exact folder path where files should be created
- **Verify Integration**: After workers complete, verify that orchestration files actually import and use the modules created by other workers

**Successful Pattern:**
```
CRITICAL: You must decompose this task into MULTIPLE WORKERS working in parallel.

DECOMPOSE INTO 4 PARALLEL WORKERS:
Worker 1 - Core Engine: Create fibonacci_engine.py with...
Worker 2 - Renderer: Create fibonacci_renderer.py with...
Worker 3 - Controls: Create controls.py with...
Worker 4 - Orchestration: Create main.py that imports all modules...

ALL WORKERS MUST:
- Work in parallel (spawn them simultaneously)
- Output files to /path/to/project/
```

### Asmodeus and Amaymon Hierarchy

**4-Layer Delegation Chain:**
1. **Court**: Provides divine providence and task orchestration
2. **Asmodeus (Divine Commander)**: Routes tasks through the divine hierarchy
3. **Amaymon (Specialist Manager)**: Manages the worker roster and technical precision
4. **Workers**: Execute with complete contextualized instructions

**How Asmodeus and Amaymon Work Together:**
- **Asmodeus Routing**: All delegation goes through Asmodeus (`agent_name: "asmodeus"`) who routes through the divine hierarchy
- **Amaymon Coordination**: Asmodeus hands off to Amaymon for worker management and task specialization
- **Worker Execution**: Amaymon coordinates the worker roster (ornias, notary-tender, cold-storage-tender, cursorwatch-worker, paimon)
- **Result Synthesis**: Results flow back through Asmodeus to the Court for synthesis

### Post-Execution Cleanup

**Ephemeral Worker Pattern:**
- Workers are designed to be ephemeral - they complete their tasks and vanish
- No persistent state is maintained between invocations
- Context is preserved through constitutional frameworks and invocation records
- Clean execution ensures no resource leaks or state pollution

---

## Features

### Manual Downloads
- **URL Input**: Download videos directly by entering a YouTube URL
- **Configurable Quality**: Choose video quality and format settings
- **Organized Storage**: Videos are saved to `/mnt/nas/youtube/{channel_name}/` with proper naming
- **Download Archive**: Prevents duplicate downloads by tracking downloaded videos

### Channel Subscriptions
- **Subscription Management**: Add and remove YouTube channel subscriptions
- **Automatic Downloads**: Nightly checks for new videos from subscribed channels
- **Configurable Schedule**: Set the time for nightly subscription checks (default: 2 AM)
- **Channel Organization**: Videos organized by channel name in subdirectories

### Download Settings
- **Quality Selection**: Configurable video quality options (best, bestvideo+bestaudio, etc.)
- **Format Options**: Customize download format preferences
- **Archive Tracking**: Automatic tracking of downloaded videos to prevent duplicates

## Architecture

### Download Organization

Videos are organized by channel in the following structure:
```
/mnt/nas/youtube/
├── {channel_name_1}/
│   ├── video_title_1.ext
│   └── video_title_2.ext
└── {channel_name_2}/
    └── video_title_3.ext
```

### Data Storage

- **Subscriptions**: `/var/www/homeserver/data/youtube/subscriptions.json`
- **Settings**: `/var/www/homeserver/data/youtube/settings.json`
- **Download Archive**: `/mnt/nas/youtube/downloaded.txt` (yt-dlp format)

### Cron Job Management

The subscription check runs as a cron job:
- **Format**: `{minute} {hour} * * * /usr/local/bin/youtube-subscription-check.sh`
- **Script**: Created and managed by the backend
- **Default**: Daily at 2 AM (configurable)

## Requirements

- `yt-dlp` Python package installed
- `/mnt/nas/youtube` directory exists and is writable
- Admin privileges required for all operations
- Cron access for subscription management

## API Endpoints

### Download Operations
- `POST /api/youtube/download` - Download video from URL
  - Body: `{ "url": "https://youtube.com/watch?v=...", "quality": "best" }`
- `GET /api/youtube/download/status` - Get download status/history

### Subscription Management
- `GET /api/youtube/subscriptions` - List all subscribed channels
- `POST /api/youtube/subscriptions` - Add new channel subscription
  - Body: `{ "url": "https://youtube.com/channel/...", "name": "Channel Name" }`
- `DELETE /api/youtube/subscriptions/<channel_id>` - Remove subscription

### Configuration
- `GET /api/youtube/settings` - Get download settings (quality, format)
- `POST /api/youtube/settings` - Update download settings
  - Body: `{ "quality": "best", "format": "bestvideo+bestaudio" }`
- `GET /api/youtube/schedule` - Get subscription check schedule
- `POST /api/youtube/schedule` - Update subscription check schedule
  - Body: `{ "enabled": true, "hour": 2, "minute": 0 }`

## Configuration

The tab is configured in `homeserver.patch.json` with:
- `displayName`: "YouTube"
- `adminOnly`: true
- `order`: 90

## Permissions

The tab requires sudo permissions for:
- Cron job management (read/write root crontab)
- File system access to `/mnt/nas/youtube`
- Executing yt-dlp commands

All permissions are defined in `permissions/flask-youtube`.

## Installation

Install using the premium tab installer:

```bash
sudo python3 /var/www/homeserver/premium/installer.py install youtube
```

## Usage

### Manual Download

1. Navigate to the YouTube tab
2. Enter a YouTube URL in the download form
3. Select quality/format settings (optional)
4. Click "Download" to start the download

### Managing Subscriptions

1. Click "Add Subscription" in the subscriptions section
2. Enter a YouTube channel URL or channel ID
3. The channel will be checked nightly for new videos
4. Remove subscriptions by clicking the remove button

### Configuring Schedule

1. Open the schedule configuration section
2. Set the hour and minute for nightly checks
3. Enable or disable the automatic check
4. Changes are applied immediately

### Download Settings

1. Open the download settings section
2. Select preferred video quality
3. Configure format options
4. Settings apply to all future downloads

## Development

For development iterations, use the reinstall command:

```bash
# Sync files to server
rsync -av --delete ./youtube/ root@server:/var/www/homeserver/premium/youtube/

# Reinstall
sudo python3 /var/www/homeserver/premium/installer.py reinstall youtube
```

## Integration with Homeserver Platform

This tab integrates with the homeserver platform's premium tab system:
- Uses the standard premium tab installer for deployment
- Follows homeserver's permission model (sudo-based operations)
- Integrates with homeserver's admin authentication system
- Uses homeserver's standard API response format (`{ success: boolean, ... }`)

