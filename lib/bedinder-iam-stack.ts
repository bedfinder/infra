import * as cdk from '@aws-cdk/core';
import { Role, ArnPrincipal, PolicyStatement, PolicyDocument, Effect, Condition, User } from '@aws-cdk/aws-iam'
import { BedfinderStackProbs }  from '../lib/bedfinder-props'

export class BedfinderIamStack extends cdk.Stack {
  
  props?: BedfinderStackProbs

  constructor(scope: cdk.Construct, id: string, props?: BedfinderStackProbs) {
    super(scope, id, props);
    //blub
    
    this.props = props;

    this.createAwsAdminRoleAssets();
    //this.createDevOpsRoleAssets();
    this.createPipelineUserAssets();

  }


  createPipelineUserAssets(){
    new User(this,"PipelineUser",{userName:"PipelineUser"})    
  }

  createAwsAdminRoleAssets() {
    const adminRole = this.createAwsAdminRole();
    // const adminPolicies = this.createAdminPolicies()

    // adminPolicies.forEach(adminPolicy => {
    //   adminRole.addToPolicy(adminPolicy)
    // })    
  
  }

  createAdminPolicies():PolicyStatement[]{
    const adminPolicies = []

    const martin = new ArnPrincipal(`arn:aws:iam::${this.props?.env?.account}:user/martin`)
    const sebastian = new ArnPrincipal(`arn:aws:iam::${this.props?.env?.account}:user/sebastian`)


    const allowAssignRole = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["sts:AssumeRole"],
      conditions: [{"Bool": {"aws:MultiFactorAuthPresent": "true"}}]
    })


    adminPolicies.push(allowAssignRole)
    return adminPolicies
  }

  createAwsAdminRole():Role{
    return new Role(this, `${this.props?.stage}-${this.props?.context}-Aws-Admin`, { 
        assumedBy: new ArnPrincipal(`arn:aws:iam::${this.props?.env?.account}:root`) ,
        roleName: `${this.props?.stage}-${this.props?.context}-Aws-Admin` 
    })
  }


  createDevOpsRoleAssets(){
    const devOpsRole = this.createDevOpsRole();
    const devOpsPolicies = this.createDevOpsPolicies()
    devOpsPolicies.forEach(devOpsPolicy => {
      devOpsRole.addToPolicy(devOpsPolicy)
    })    
  }

  createDevOpsPolicies():PolicyStatement[]{
    const devOpsPolicies = []

    const allowAssignRole = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ArnPrincipal(`arn:aws:iam::${this.props?.env?.account}:martin`)],
      actions: ["sts:AssumeRole"],
      conditions: [{"Bool": {"aws:MultiFactorAuthPresent": "true"}}]
    })


    devOpsPolicies.push(allowAssignRole)
    return devOpsPolicies
  }

  createDevOpsRole():Role{
    return new Role(this, `${this.props?.stage}-${this.props?.context}-Devops-Role`, { 
        assumedBy: new ArnPrincipal(`arn:aws:iam::${this.props?.env?.account}:root`) ,
        roleName: `${this.props?.stage}-${this.props?.context}-Devops-Role`
    })
  }

}
