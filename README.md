# 🔎 OP Scan

OP Scan is a transaction explorer tailored specifically for the [OP Stack](https://docs.optimism.io/builders/chain-operators/tutorials/create-l2-rollup) and the [Superchain vision](https://www.youtube.com/watch?v=O6vYNgrQ1LE).
You can use it locally to explore and monitor transactions on your own rollup developed with the OP Stack.

![screenshot](screenshot.png)

# 🙋‍♀️ Collaborate with us on OP Scan v1

OP Scan is built for teams working on their own rollup with the OP Stack.
If you are interested in monitoring your rollup locally and you want to submit a feature request of a bug, feel free by opening an issue in this repository.

# ⚙️ Installation

The app requires the following dependencies:

NodeJS >= 18
pnpm

# 👩‍💻 Local Development

For contributing to the project, you can quickly get the application running by following these steps:

Clone this repository:

```
git clone git@github.com:walnuthq/op-scan
```

Install the dependencies:

```
pnpm install
```

You will need to create a `.env.local` file in the root of your repository and populate it with `NEXT_PUBLIC_L1_RPC_URL` and `NEXT_PUBLIC_L2_RPC_URL`.

```
NEXT_PUBLIC_L1_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/..."
NEXT_PUBLIC_L2_RPC_URL="https://opt-mainnet.g.alchemy.com/v2/..."
```

You can get free node rpcs url by signing up to services such as [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/).

Start up the app and see it running at `http://localhost:3000`

```
pnpm dev
```

# 🚀 Deploying

Deployments are handled automatically by [Vercel](https://www.vercel.com/), as soon as your PR is merged to main.

# 🤗 Contributing

Head on to the issues tab to find a list of open contributions. Before making your first contribution, get familiar with our [contributor guidelines](https://github.com/walnuthq/op-scan/issues/1).

## Contributor's chat

Join us on Telegram [here](https://t.me/+DYI4FMia43I1NDI8). Do not hesitate to ask any question, we will do our best to answer in the best way we can.

## Coding conventions

The project is already pre-configured with Eslint, TypeScript, and Prettier.

Check for any linting issues:

```
pnpm lint
```

Run prettier before committing:

```
pnpm prettier
```
