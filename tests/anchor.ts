import assert from "assert";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Senddit } from "../target/types/senddit";
import assert from "assert";
import type { Senddit } from "../target/types/senddit";

describe("senddit", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Senddit as anchor.Program<Senddit>;
  
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);
  const program = anchor.workspace.Senddit as Program<Senddit>;

  const authority = program.provider.wallet.payer;
  const treasury = authority.publicKey;

  const myPost = "https://www.example.com";
  const postUpvote = "1";
  const myComment = "Testing Comment 1";
  const commentUpvote = "1";

  let sendditPda: PublicKey,
    postStorePda: PublicKey,
    postPda: PublicKey,
    postMainPda: PublicKey,
    commentStorePda: PublicKey,
    commentPda: PublicKey;

  it("Is initialized!", async () => {
    const [sendditPda1, sendditBump] = await PublicKey.findProgramAddress(
      [Buffer.from("senddit")],
      program.programId
    );

    sendditPda = sendditPda1;
    // Add your test here.
    await program.rpc.initialize({
      accounts: {
        senddit: sendditPda,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [authority],
    });

    await delay(2000);

    // Fetch the account and check if the fields are set correctly
    const senddit = await program.account.senddit.fetch(sendditPda);
    assert.equal(senddit.authority.toBase58(), authority.publicKey.toBase58());
    assert.equal(senddit.treasury.toBase58(), treasury.toBase58());
  });

  it("Initialize the post store", async () => {
    const currentDateInDays = Math.floor(
      Date.now() / (1000.0 * 60.0 * 60.0 * 24.0)
    ); // Number of days since epoch
    const [postStorePda1, postStoreBump] = await PublicKey.findProgramAddress(
      [Buffer.from(currentDateInDays.toString())],
      program.programId
    );

    postStorePda = postStorePda1;

    console.log(sendditPda.toString(), "\n", postStorePda.toString());

    await program.rpc.initPostStore({
      accounts: {
        senddit: sendditPda,
        treasury: treasury,
        authority: authority.publicKey,
        postStore: postStorePda,
        systemProgram: SystemProgram.programId,
      },
      signers: [authority],
    });

    await delay(2000);

    // Fetch the account and check if the fields are set correctly
    console.log("here");
    const postStore = await program.account.postStore.fetch(postStorePda);
    assert.equal(postStore.posts, 0);
  });

  it("Post a link", async () => {
    const [postPda1, postPdaBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(myPost)],
        program.programId
      );

    const postSeed = Buffer.concat([
      postStorePda.toBuffer(),
      Buffer.from((1).toString()),
    ]);
    const [postMainPda1, postBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [postSeed],
        program.programId
      );

    postPda = postPda1;
    postMainPda = postMainPda1;

    await program.rpc.postLink(myPost, {
      accounts: {
        senddit: sendditPda,
        treasury: treasury,
        postStore: postStorePda,
        post: postMainPda,
        authority: authority.publicKey,
        posterWallet: authority.publicKey,
        postPda: postPda,
        systemProgram: SystemProgram.programId,
      },
      signers: [authority],
    });

    await delay(2000);

    // Fetch the account and check if the fields are set correctly
    const post = await program.account.post.fetch(postMainPda);
    assert.equal(post.link, myPost);
  });

  it("Initialize the comment store", async () => {
    const [commentStorePda1, commentStoreBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [postMainPda.toBuffer()],
        program.programId
      );

    commentStorePda = commentStorePda1;

    await program.rpc.initCommentStore({
      accounts: {
        senddit: sendditPda,
        treasury: treasury,
        commentStore: commentStorePda,
        authority: authority.publicKey,
        post: postMainPda,
        systemProgram: SystemProgram.programId,
      },
      signers: [authority],
    });

    await delay(2000);

    // Fetch the account and check if the fields are set correctly
    const commentStore = await program.account.commentStore.fetch(
      authority.publicKey
    );
    assert.equal(commentStore.comments, 0);
  });

  it("Upvote a post", async () => {
    await program.rpc.upvotePost(postUpvote, {
      accounts: {
        senddit: sendditPda,
        treasury: treasury,
        postStore: postStorePda,
        post: postMainPda,
        authority: authority.publicKey,
        posterWallet: authority.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [authority],
    });

    await delay(2000);

    // Fetch the account and check if the fields are set correctly
    const post = await program.account.post.fetch(postMainPda);
    assert.equal(post.upvotes, parseInt(postUpvote));
  });

  it("Post a comment", async () => {
    const commentSeed = Buffer.concat([
      commentStorePda.toBuffer(),
      Buffer.from((1).toString()),
    ]);
    const [commentPda1, commentPdaBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [commentSeed],
        program.programId
      );

    commentPda = commentPda1;

    await program.rpc.postComment(myComment, {
      accounts: {
        senddit: sendditPda,
        treasury: treasury,
        commentStore: commentStorePda,
        comment: commentPda,
        authority: authority.publicKey,
        commenterWallet: authority.publicKey,
        post: postMainPda,
        systemProgram: SystemProgram.programId,
      },
      signers: [authority],
    });

    await delay(2000);

    // Fetch the account and check if the fields are set correctly
    const comment = await program.account.comment.fetch(commentPda);
    assert.equal(comment.text, myComment);
  });

  it("Upvote a comment", async () => {
    await program.rpc.upvoteComments(commentUpvote, {
      accounts: {
        senddit: sendditPda,
        treasury: treasury,
        commentStore: commentStorePda,
        comment: commentPda,
        authority: authority.publicKey,
        commenterWallet: authority.publicKey,
        post: postMainPda,
        systemProgram: SystemProgram.programId,
      },
      signers: [authority],
    });

    await delay(2000);

    // Fetch the account and check if the fields are set correctly
    const comment = await program.account.comment.fetch(commentPda);
    assert.equal(comment.upvotes, parseInt(commentUpvote));
  });
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    let current = start;
    while (current - start < ms) {
      current = Date.now();
    }
    resolve();
  });
}
