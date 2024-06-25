FROM amazonlinux:2023
SHELL ["/bin/bash", "--login", "-c"]
RUN touch $HOME/.bashrc

# Install dependencies
RUN yum install tar gzip wget bzip2 fontconfig freetype freetype-devel fontconfig-devel libstdc++ python3 python3-pip -y
RUN python3 -m pip

# # Copy the global nvmrc
# COPY .nvmrc /spare-change/.nvmrc

# Install nvm
ENV NODE_VERSION 20.9.0
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
    && chmod +x $HOME/.nvm/nvm.sh \
    && $HOME/.nvm/nvm.sh
RUN source ~/.nvm/nvm.sh && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default


# Copy over our dependencies
COPY ./package.json /frontend/package.json
COPY ./package-lock.json /frontend/package-lock.json

# Install the dependencies
RUN source ~/.nvm/nvm.sh && cd /frontend && npm install

# Copy everything else
COPY . /frontend/

# Actually build
RUN source ~/.nvm/nvm.sh && cd /frontend && npm run build

# Sleep infinity as an entrypoint
CMD ["sleep", "infinity"]