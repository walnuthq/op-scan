> [!WARNING]
> This project is under active development and not yet suitable for production. For questions or feature requests, [contact us on Telegram](https://t.me/+DYI4FMia43I1NDI8) or [submit an issue](https://github.com/walnuthq/op-scan/issues). To track progress, star the repository. [Supported by an Optimism grant](https://gov.optimism.io/t/season-5-cycle-19-intent-1-developer-advisory-board-finalists-review/7899?u=0xmilton), the project is divided into four milestones. This warning will be removed after completion of Milestone 4.
>
> - [x] Milestone 1: Homepage and basic nav (current stage)
> - [x] Milestone 2: Tx detail page
> - [ ] Milestone 3: Contract detail page
> - [ ] Milestone 4: Feedback incorporation and polish

# 🔎 OP Scan

OP Scan is a transaction explorer tailored specifically for the [OP Stack](https://docs.optimism.io/builders/chain-operators/tutorials/create-l2-rollup) and the [Superchain vision](https://www.youtube.com/watch?v=O6vYNgrQ1LE). It's purpose built to be lightweight, so that anyone can run it locally next to their OP Stack nodes, when working on a new rollup.

![screenshot](screenshot.png)

# 🦄 How OP Scan Differs from Other Explorers

1. **Lightweight**: The code and dependencies are designed to be minimalistic. This ensures minimal resource consumption, allowing anyone to run it locally alongside an OP Stack node when working on a rollup.
2. **OP Stack Native**: This explorer is purpose-built for the OP Stack. It ensures 100% compatibility with rollups in Optimism’s Superchain.
3. **Scalable**: Despite its lightweight design, the explorer is built to handle any scale.
4. **Open Source**: All code is open source from day one. This alignment with the community allows anyone to contribute or fork the repository to meet their specific needs.

# 🙋‍♀️ Share Feedback by Submitting an Issue

OP Scan is built for rollups built on the [OP Stack](https://docs.optimism.io/builders/chain-operators/tutorials/create-l2-rollup). If you are interested in it, have feedback or feature request, submit an issue [here](https://github.com/walnuthq/op-scan/issues).

# ⚙️ Installation

The app requires the following dependencies:

```
NodeJS >= 20
pnpm >= 9
```

### Run the Explorer Locally

Clone this repository:

```
git clone git@github.com:walnuthq/op-scan
```

Install the dependencies:

```
pnpm install
```

You will need to copy `.env.local.example` into `.env.local` at the root of your repository and populate it with your own values.

In particular you will need to provide configuration for both L1 and L2 chains:

```
NEXT_PUBLIC_L1_CHAIN_ID="11155111"
NEXT_PUBLIC_L1_NAME="Sepolia"
NEXT_PUBLIC_L1_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/API_KEY"
NEXT_PUBLIC_L2_CHAIN_ID="42069"
NEXT_PUBLIC_L2_NAME="OP Local"
NEXT_PUBLIC_L2_RPC_URL="http://localhost:8545"
```

You can get free node rpcs url by signing up to services such as [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/).

You will also need to provide your L1 contracts addresses:

```
NEXT_PUBLIC_DISPUTE_GAME_FACTORY_ADDRESS="..."
NEXT_PUBLIC_L2_OUTPUT_ORACLE_ADDRESS="..."
NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS="..."
NEXT_PUBLIC_L1_STANDARD_BRIDGE_ADDRESS="..."
NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS="..."
```

You will find theses addresses in your rollup deployment artifacts in `contracts-bedrock/deployments/your-deployment/L1Contract.json`.
Note that you always need to provide the proxy address, not the underlying contract.

If you don't want to run the explorer with your local chain setup, you will find all the necessary environment variables commented in `.env.local.example` to configure the explorer with OP Mainnet.

When you're done configuring your environment variables you can build the app:

```
pnpm build
```

Make sure your local chain is started and launch the explorer to see it running at `http://localhost:3000`

```
pnpm start
```

### Run the Indexer

To run the indexer, you first need to setup your `DATABASE_URL` in `.env.local` as well as websocket connections to your L1/L2 chains (once again you can get them from a 3rd-party provider):

```
DATABASE_URL="file:dev.db"
L1_RPC_WSS="wss://eth-mainnet.g.alchemy.com/v2/..."
L2_RPC_WSS="wss://opt-mainnet.g.alchemy.com/v2/..."
```

Then you can sync your local database with the Prisma schema:

```
pnpm prisma:db:push
```

We use [Bun](https://bun.sh/) to run the indexer as a long-running script so make sure it is installed globally on your system.
Now you will be able to start indexing the blockchain by running the `op-indexer` command:

```
pnpm op-indexer
```

You should start seeing blocks getting indexed in your terminal and you can explore the state of your local database using Prisma studio:

```
pnpm prisma:studio
```

If you need to change the Prisma schema at some point, make sure to regenerate the Prisma client and push to your local database:

```
pnpm prisma:generate
pnpm prisma:db:push
```

# 🚀 Deploying

Deployments are handled automatically by [Vercel](https://www.vercel.com/), as soon as your PR is merged to main.

# 🤗 Contributing

Head on to the issues tab to find a list of open contributions. Before making your first contribution, get familiar with our [contributor guidelines](https://github.com/walnuthq/op-scan/issues/1).
