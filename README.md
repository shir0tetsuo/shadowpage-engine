# shadowpage-engine

![Build Passing](https://img.shields.io/badge/Build-Passing-green) ![Build Passing](https://img.shields.io/badge/NodeJS-v20.3.1-orange)

# Project Building

## Dependencies

1. You'll need NodeJS. Version used is v20.3.1.
2. Run `npm.sh`

## Ubuntu Building

Assumes your NodeJS distribution can be found at `/usr/local/bin/node` so this might need to change in `configure.sh`, `npm.sh` and `up.sh` accordingly.

1. Follow the instructions over at https://github.com/nodejs/node and compiled on Ubuntu 22.04 worked just fine.
2. `git clone https://github.com/shir0tetsuo/shadowpage-engine/`
3. Inspect `npm.sh`, `up.sh`, and `configure.sh`, modify to your liking.
4. Execute `npm.sh`.
5. Execute `configure.sh`, when `(changeme)` appears, it's strongly recommended that you set a new password. After the configuration is done, your UUID and hash for debugging will be shown.
6. (Configure a proxy in your web server daemon.)

