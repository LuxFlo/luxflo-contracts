import { Contract } from '@algorandfoundation/tealscript';

class Escrow extends Contract {
  asa = GlobalStateKey<Asset>();
  renter = GlobalStateKey<Address>();
  owner = GlobalStateKey<Address>();
  arbiter = GlobalStateKey<Address>();
  amount = GlobalStateKey<number>();
  terms = GlobalStateKey<string>();
  expiresTime = GlobalStateKey<number>();
  arbitration = GlobalStateKey<number>(); // a boolean signaling if either the buyer or seller want to enter arbitration

  createApplication(
    asa: Asset,
    renter: Address,
    owner: Address,
    arbiter: Address,
    amount: number,
    terms: string,
    contractLength: number
  ): void {
    this.asa.value = asa;
    this.renter.value = renter;
    this.owner.value = owner;
    this.arbiter.value = arbiter;
    this.amount.value = amount;
    this.terms.value = terms;
    this.expiresTime.value = contractLength + globals.latestTimestamp; // in seconds
  }

  // createApplication(proposal: string): void {
  //   this.proposal.value = proposal;
  // }

  // mint DAO token
  bootstrap(): void {
    verifyTxn(this.txn, { sender: this.app.creator });
    assert(!this.asa.exists);
    // const registeredAsa = sendAssetCreation({
    //   configAssetTotal: 1_000,
    //   configAssetFreeze: this.app.address,
    //   configAssetClawback: this.app.address,
    // });
    // this.asa.value = registeredAsa;
    // return registeredAsa;
  }

  // optInToApplication(registeredAsa: Asset): void {
  //   register(registeredAsa: Asset): void {
  //     assert(this.txn.sender.assetBalance(this.registeredAsa.value) === 0);
  //     sendAssetTransfer({
  //       xferAsset: this.registeredAsa.value,
  //       assetReceiver: this.txn.sender,
  //       assetAmount: 1,
  //     });

  //     sendAssetFreeze({
  //       freezeAsset: this.registeredAsa.value,
  //       freezeAssetAccount: this.txn.sender,
  //       freezeAssetFrozen: true,
  //     });
  //   }

  // closeOutOfApplication(registeredAsa: Asset): void {
  //   deregister(registeredAsa: Asset): void {
  //     // Delete the users vote when they clear state
  //     if (this.inFavor(this.txn.sender).exists) {
  //       this.votesTotal.value = this.votesTotal.value - 1;
  //       if (this.inFavor(this.txn.sender).value) {
  //         this.votesInFavor.value = this.votesInFavor.value - 1;
  //       }

  //       const preMBR = this.app.address.minBalance;
  //       this.inFavor(this.txn.sender).delete();

  //       sendPayment({
  //         amount: preMBR - this.app.address.minBalance,
  //         receiver: this.txn.sender,
  //       });
  //     }

  //     sendAssetTransfer({
  //       xferAsset: this.registeredAsa.value,
  //       assetSender: this.txn.sender,
  //       assetReceiver: this.app.address,
  //       assetAmount: 1,
  //     });
  //   }

  //   vote(boxMBRPayment: PayTxn, inFavor: boolean, registeredAsa: Asset): void {
  //     assert(globals.latestTimestamp <= this.endTime.value);
  //     assert(this.txn.sender.assetBalance(this.registeredAsa.value) === 1);
  //     assert(!this.inFavor(this.txn.sender).exists);
  //     const preBoxMBR = this.app.address.minBalance;
  //     this.inFavor(this.txn.sender).value = inFavor;
  //     // verifyTxn(boxMBRPayment, {
  //     //   receiver: this.app.address,
  //     //   amount: this.app.address.minBalance - preBoxMBR
  //     // })`
  //     this.votesTotal.value = this.votesTotal.value + 1;
  //     if (inFavor) {
  //       this.votesInFavor.value = this.votesInFavor.value + 1;
  //     }
  //   }

  getParties(): [Address, Address, Address] {
    return [this.renter.value, this.owner.value, this.arbiter.value];
  }

  //   getVotes(): [number, number] {
  //     return [this.votesInFavor.value, this.votesTotal.value];
  //   }

  //   getRegisteredAsa(): Asset {
  //     return this.registeredAsa.value;
  //   }
}
