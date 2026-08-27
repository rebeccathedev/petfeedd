<div align="center">

# 🐾 petfeedd

### A reusable Raspberry Pi pet-feeder daemon with scheduling, GPIO control, and a friendly web UI.

[![CI and container release](https://github.com/rebeccathedev/petfeedd/actions/workflows/ci.yml/badge.svg)](https://github.com/rebeccathedev/petfeedd/actions/workflows/ci.yml)

[Quick start](#-quick-start) · [Features](#-features) · [Hardware](#-supported-hardware) · [Documentation](#-documentation) · [Development](#-development)

</div>

---

petfeedd packages the common software pieces of a DIY pet feeder into one reusable service. Bring the feeder, servo, and Raspberry Pi; petfeedd provides scheduling, GPIO control, history, integrations, and browser-based configuration.

## ✨ Features

- **⏰ Precise schedules** — create any number of daily feeds with second-level timing and configurable portions.
- **🍽️ Feed on demand** — trigger a configured feed from the web interface or API and see whether the hardware operation succeeded.
- **🖥️ Web configuration** — manage feeds, servos, GPIO buttons, sounds, and integrations from a responsive interface.
- **🔌 REST API** — build third-party clients and home-automation integrations.
- **📡 Network discovery** — find feeders on the local network with Bonjour/Zeroconf.
- **📨 Notifications** — publish feed activity through email, MQTT, sounds, and X/Twitter.
- **📦 Multi-architecture container** — one GHCR image supports amd64, arm/v6, arm/v7, and arm64.

## 🚀 Quick start

Install Docker on the Raspberry Pi, then run:

```shell
sudo touch /opt/petfeedd.db
sudo chown "$(id -un)":"$(id -gn)" /opt/petfeedd.db

docker pull ghcr.io/rebeccathedev/petfeedd:latest
docker run --detach \
  --name petfeedd \
  --restart unless-stopped \
  --privileged \
  --env TZ=America/Denver \
  --volume /opt/petfeedd.db:/opt/petfeedd.db \
  --publish 8080:8080 \
  ghcr.io/rebeccathedev/petfeedd:latest
```

Open `http://<raspberry-pi-address>:8080` and follow the onboarding flow. The container needs `--privileged` so it can operate the Pi's GPIO pins.

See the [installation guide](docs/INSTALL.md) for architecture details, source installation, and updates. See [configuration](docs/CONFIGURE.md) for timezone, restart, and Compose examples.

## 🧰 Supported hardware

petfeedd has been reported working on Raspberry Pi Zero/Zero 2, Raspberry Pi 3/3B/3B+, and Raspberry Pi 4. The GHCR package supplies images for Pi Zero-class `arm/v6`, 32-bit `arm/v7`, 64-bit `arm64`, and `amd64` hosts.

Lower-memory Pi Zero models may take longer to start and have less headroom than newer boards.

## 📚 Documentation

- **[📦 Installation](docs/INSTALL.md)** — Docker quick start, supported architectures, source builds, and updates.
- **[⚙️ Configuration](docs/CONFIGURE.md)** — timezone handling, persistent data, restart policies, and Docker Compose.
- **[🌐 API](docs/API.md)** — REST endpoints, request formats, settings, and on-demand feeds.
- **[📡 Discovery](docs/DISCOVERY.md)** — locating petfeedd instances with Bonjour/Zeroconf.
- **[❓ FAQ](docs/FAQ.md)** — security guidance, GPIO troubleshooting, and project history.

## 🔒 Security

petfeedd is intended for a trusted home network. It does not provide users, passwords, or API keys, so do not expose port 8080 directly to the internet. If remote access is required, place it behind an authenticated reverse proxy or a private VPN. See the [security FAQ](docs/FAQ.md#security).

## 🛠️ Development

Requirements: Node.js 22+, npm, and the native build dependencies required by `sqlite3` and `pigpio`.

```shell
npm ci --ignore-scripts
npm test
npx webpack --mode production
```

Container releases are built by GitHub Actions. A merge to `main` publishes the `latest` and commit-SHA tags to `ghcr.io/rebeccathedev/petfeedd` as a multi-architecture manifest.

Contributions are welcome. Use `development` as the integration branch and open focused pull requests against it.

## 👩‍💻 Author

Rebecca Peck ([@rebeccathedev](https://github.com/rebeccathedev))

## 📄 License

GPLv3 — see [LICENSE.md](LICENSE.md).
