import * as cdk from '@aws-cdk/core';
import { Peer, Port, SecurityGroup, SubnetType, Vpc } from '@aws-cdk/aws-ec2'
import { BedfinderStackProbs }  from '../lib/bedfinder-props'

const vpc_ranges = {
    "Test": "10.0.0.0/16",
    "Prod": "10.1.0.0/16"
}

export class BedfinderNetworkStack extends cdk.Stack {
  
     
    constructor(scope: cdk.Construct, id: string, props: BedfinderStackProbs) {
      super(scope, id, props);

      const prefix = `${props.stage}-${props.context}`
    
      const vpc = new Vpc(this, `${prefix}-VPC`, {
        cidr: vpc_ranges["Test"],
        maxAzs: 2,
        subnetConfiguration: [{
            cidrMask: 26,
            name: `${prefix}-PrivateSubnet`,
            subnetType: SubnetType.PRIVATE,
        },
        {
            cidrMask: 26,
            name: `${prefix}-PublicSubnet`,
            subnetType: SubnetType.PUBLIC,
        }],
    });
      
    }


}  