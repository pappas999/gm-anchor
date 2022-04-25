import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GmAnchor } from "../target/types/gm_anchor";
const assert = require("assert");
const expect = require("chai").expect;

describe("gm-anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  //anchor.setProvider(anchor.AnchorProvider.env());
  const user = provider.wallet;
  const program = anchor.workspace.GmAnchor as Program<GmAnchor>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.execute("test").rpc();
    console.log("Your transaction signature", tx);
  });

  it("Name set correctly!", async () => {
    // Add your test here.
    console.log('provider:'+ provider.wallet.publicKey)

    await provider.connection.confirmTransaction(await provider.connection.requestAirdrop(provider.wallet.publicKey, 10000000000),"confirmed");

    const gmAccount = anchor.web3.Keypair.generate();
    const name = 'Harry'

    // Execute the RPC.
    let tx = await program.rpc.execute(name, {
      accounts: {
        gmAccount: gmAccount.publicKey,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      options: { commitment: "confirmed" },
      signers: [gmAccount],
    });

    const storedName = await program.account.greetingAccount.fetch(gmAccount.publicKey);
    console.log(storedName.name);

    // Ensure the price returned is a positive value
    expect(storedName.name).to.equal(name);

  });


});
