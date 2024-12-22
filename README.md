# Senddit 📩

Senddit is a Solana-based decentralized application (dApp) that allows users to:

1. **Post Links** 🖇️: Share links with upvote functionality.
2. **Upvote Posts** 👍: Engage with the community by upvoting posts.
3. **Post Comments** 💬: Add comments to posts and upvote comments.
4. **Manage Fees** 💰: Integrates a treasury for managing platform fees.

---

## Features

- **Post Management**: Create and share posts with a unique PDA for each post.
- **Upvoting System**: Upvote both posts and comments.
- **Comment Management**: Add and upvote comments with a dedicated comment store.

---

## Prerequisites

Before running the program, ensure you have the following installed:

1. **Rust**: [Install Rust](https://www.rust-lang.org/tools/install)
2. **Anchor CLI**: [Install Anchor](https://book.anchor-lang.com/chapter_3/installation.html)
3. **Solana CLI**: [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
4. **Node.js** (optional for testing): [Install Node.js](https://nodejs.org)

---

## Running the Program

### 1. Clone the Repository

```bash
git clone <repository-url>
cd senddit
```

### 2. Build the Program

Compile the program with Anchor:

```bash
anchor build
```

### 3. Deploy the Program

Deploy to your local Solana validator:

```bash
anchor deploy
```

### 4. Set Up Local Validator

Start a Solana local validator:

```bash
solana-test-validator
```

Connect Anchor to the local cluster:

```bash
solana config set --url localhost
```

---

## Usage

### Initialize the Program

Run the `initialize` instruction to set up the Senddit treasury and authority:

```bash
anchor test --skip-build
```

### Key Instructions

- **Initialize Post Store**: Creates a PDA for storing posts.
- **Post Links**: Add a new link to the store with an initial upvote.
- **Upvote Posts**: Increment upvotes for a specific post.
- **Post Comments**: Add a comment to a post.
- **Upvote Comments**: Increment upvotes for a comment.

---

## Testing

Anchor comes with a built-in testing framework. To run all tests, execute:

```bash
anchor test
```

---

## Program Structure

- **Senddit PDA**: Main account storing program settings (authority, treasury, fees).
- **Post Store PDA**: Account for managing posts and their metadata.
- **Post PDA**: Unique PDA for each post with fields like `link`, `upvotes`, and `comments`.
- **Comment Store PDA**: Manages comments linked to specific posts.
- **Comment PDA**: Unique PDA for each comment.

---

## Error Codes

- **LinkTooLarge**: The submitted link exceeds the size limit.
- **NoTextSubmitted**: Empty link or comment.
- **OverflowUnderflow**: Arithmetic overflow or underflow detected.
- **InvalidTreasury**: Treasury account mismatch.

---

## Contributing

Feel free to fork this project and contribute to its development. For major changes, open an issue to discuss your ideas.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
