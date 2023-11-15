/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Escrow, EscrowClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<EscrowCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
  asa={asa}
  renter={renter}
  owner={owner}
  arbiter={arbiter}
  amount={amount}
  terms={terms}
  contractLength={contractLength}
/>
*/
type EscrowCreateApplicationArgs = Dao['methods']['createApplication(asset,address,address,address,uint64,string,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: EscrowClient
  asa: EscrowCreateApplicationArgs['asa']
  renter: EscrowCreateApplicationArgs['renter']
  owner: EscrowCreateApplicationArgs['owner']
  arbiter: EscrowCreateApplicationArgs['arbiter']
  amount: EscrowCreateApplicationArgs['amount']
  terms: EscrowCreateApplicationArgs['terms']
  contractLength: EscrowCreateApplicationArgs['contractLength']
}

const EscrowCreateApplication = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createApplication`)
    await props.typedClient.create.createApplication(
      {
        asa: props.asa,
        renter: props.renter,
        owner: props.owner,
        arbiter: props.arbiter,
        amount: props.amount,
        terms: props.terms,
        contractLength: props.contractLength,
      },
      { sender },
    )
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default EscrowCreateApplication