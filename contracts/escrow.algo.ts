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

  getParties(): [Address, Address, Address] {
    return [this.renter.value, this.owner.value, this.arbiter.value];
  }

  renterArbitration(): void {
    assert(globals.latestTimestamp <= this.expiresTime.value);
    verifyTxn(this.txn, { sender: this.renter.value });
    this.arbitration.value = 1;
  }

  ownerArbitration(): void {
    assert(globals.latestTimestamp <= this.expiresTime.value);
    verifyTxn(this.txn, { sender: this.owner.value });
    this.arbitration.value = 1;
  }

  ownerWithdraw(): void {
    assert(globals.latestTimestamp > this.expiresTime.value);
    assert(this.arbitration.value === 0);

    sendPayment({
      amount: this.app.address.balance,
      receiver: this.owner.value,
    });
  }

  arbiterWithdraw(): void {
    assert(globals.latestTimestamp > this.expiresTime.value);
    assert(this.arbitration.value === 1);

    sendPayment({
      amount: this.app.address.balance,
      receiver: this.arbiter.value,
    });
  }
}
