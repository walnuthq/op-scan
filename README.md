> [!WARNING]
> This project is under active development and not yet suitable for production. For questions or feature requests, [contact us on Telegram](https://t.me/+DYI4FMia43I1NDI8) or [submit an issue](https://github.com/walnuthq/op-scan/issues). To track progress, star the repository. [Supported by an Optimism grant](https://gov.optimism.io/t/season-5-cycle-19-intent-1-developer-advisory-board-finalists-review/7899?u=0xmilton), the project is divided into four milestones. This warning will be removed after completion of Milestone 4.
>
> - [x] Milestone 1: Homepage and basic nav (current stage)
> - [x] Milestone 2: Tx detail page
> - [x] Milestone 3: Contract detail page
> - [x] Milestone 4: Feedback incorporation and polish

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
NodeJS >= 22
pnpm >= 9
```

### Explorer Configuration

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
NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS="..."
NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS="..."
```

You will find theses addresses in your rollup deployment artifacts in `contracts-bedrock/deployments/your-deployment/L1Contract.json`.
Note that you always need to provide the proxy address, not the underlying contract.

If you don't want to run the explorer with your local chain setup, you will find all the necessary environment variables commented in `.env.local.example` to configure the explorer with OP Sepolia or OP Mainnet.

If you want to be able to use the Write Contract feature on verified contracts, you will also need to provide a [Reown](https://docs.reown.com/) project ID.

```
NEXT_PUBLIC_REOWN_PROJECT_ID="..."
```

### Indexer Configuration

To run the indexer, you first need to setup your `DATABASE_URL` in `.env.local` as well as websocket connections to your L1/L2 chains (once again you can get them from a 3rd-party provider):

```
DATABASE_URL="file:dev.db"
L1_RPC_WS="wss://eth-mainnet.g.alchemy.com/v2/API_KEY"
L2_RPC_WS="wss://opt-mainnet.g.alchemy.com/v2/API_KEY"
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

Indexing a blockchain is putting a heavy load on the RPC as you need to perform a large number of JSON-RPC requests to fully index a block (along with transactions and logs).
When indexing non-local chains you will probably encounter 429 errors related to rate-limiting, you may provide up to 3 fallback RPC URLs in case this happens:

```
NEXT_PUBLIC_L1_FALLBACK1_RPC_URL="https://opt-mainnet.g.alchemy.com/v2/FALLBACK1_API_KEY"
NEXT_PUBLIC_L2_FALLBACK1_RPC_URL="https://opt-mainnet.g.alchemy.com/v2/FALLBACK1_API_KEY"
NEXT_PUBLIC_L1_FALLBACK2_RPC_URL="https://opt-mainnet.g.alchemy.com/v2/FALLBACK2_API_KEY"
NEXT_PUBLIC_L2_FALLBACK2_RPC_URL="https://opt-mainnet.g.alchemy.com/v2/FALLBACK2_API_KEY"
NEXT_PUBLIC_L1_FALLBACK3_RPC_URL="https://opt-mainnet.g.alchemy.com/v2/FALLBACK3_API_KEY"
NEXT_PUBLIC_L2_FALLBACK3_RPC_URL="https://opt-mainnet.g.alchemy.com/v2/FALLBACK3_API_KEY"
```

You can pass several parameters to the indexer to control the indexing range and execution:

- `--l2-from-block` (short `-f`, defaults to latest block) start indexing from this L2 block.
- `--l2-index-block` (short `-b`) index this particular L2 block number.
- `--l1-from-block` (defaults to latest block) start indexing from this L1 block.
- `--l1-index-block` index this particular L1 block number.
- `--index-delay` (short `-d`, defaults to 1000) delay in ms between indexing 2 blocks to avoid overloading the RPC.

Example of running the indexer:

```
pnpm op-indexer -f 123416717 --l1-index-block 20426733 --l1-index-block 20426726 -d 500
```

### Running the Explorer

When you're done configuring your environment variables you can build the app:

```
pnpm build
```

Make sure your local chain is started and the indexer is running, then launch the explorer to see it live at `http://localhost:3000`

```
pnpm start
```

Alternatively you can launch the explorer in dev mode if you want to customize it:

```
pnpm dev
```

# 🚀 Deploying

Deployments are handled automatically by [Vercel](https://www.vercel.com/), as soon as your PR is merged to main.

# 🤗 Contributing

Head on to the issues tab to find a list of open contributions. Before making your first contribution, get familiar with our [contributor guidelines](https://github.com/walnuthq/op-scan/issues/1).
