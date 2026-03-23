FROM mcr.microsoft.com/devcontainers/javascript-node:24

ARG LEFTHOOK_VERSION=2.1.4
ARG GIT_TOWN_VERSION=22.7.0

# Install Lefthook
RUN curl -1sLf 'https://dl.cloudsmith.io/public/evilmartians/lefthook/setup.deb.sh' | bash \
    && apt-get install -y lefthook=${LEFTHOOK_VERSION} \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Git Town
RUN curl -fsSL "https://github.com/git-town/git-town/releases/download/v${GIT_TOWN_VERSION}/git-town_linux_intel_64.deb" -o /tmp/git-town.deb \
    && dpkg -i /tmp/git-town.deb \
    && rm /tmp/git-town.deb

# Install Doppler CLI
RUN curl -sLf --retry 3 --tlsv1.2 --proto '=https' 'https://get.doppler.com' | sh
