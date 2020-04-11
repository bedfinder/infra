import * as cdk from '@aws-cdk/core';
import { Role, ArnPrincipal, PolicyStatement, PolicyDocument, Effect, Condition, User } from '@aws-cdk/aws-iam'


export class BedfinderIamStack extends cdk.Stack {
 
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    //blub

    this.createAwsAdminRoleAssets(props);
    this.createDevOpsRoleAssets(props);
    this.createPipelineUserAssets(props);

  }


  createPipelineUserAssets(props?:cdk.StackProps){
    new User(this,"PipelineUser",{userName:"PipelineUser"})    
  }

  createAwsAdminRoleAssets(props?:cdk.StackProps) {
    const adminRole = this.createAwsAdminRole();
    const adminPolicies = this.createAdminPolicies()

    adminPolicies.forEach(adminPolicy => {
      adminRole.addToPolicy(adminPolicy)
    })    
  
  }

  createAdminPolicies():PolicyStatement[]{
    const adminPolicies = []

    const allowAssignRole = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ArnPrincipal(`arn:aws:iam::123:root}`)],
      actions: ["sts:AssumeRole"],
      conditions: [{"Bool": {"aws:MultiFactorAuthPresent": "true"}}]
    })


    adminPolicies.push(allowAssignRole)
    return adminPolicies
  }

  createAwsAdminRole(props?:cdk.StackProps):Role{
    return new Role(this, "BedfinderAWSAdminRole", { 
        assumedBy: new ArnPrincipal(`arn:aws:iam::${props?.env?.account}:root}`) ,
        roleName: "AwsAdmin" 
    })
  }


  createDevOpsRoleAssets(props?:cdk.StackProps){
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
      principals: [new ArnPrincipal(`arn:aws:iam::12314:root}`)],
      actions: ["sts:AssumeRole"],
      conditions: [{"Bool": {"aws:MultiFactorAuthPresent": "true"}}]
    })


    devOpsPolicies.push(allowAssignRole)
    return devOpsPolicies
  }

  createDevOpsRole(props?:cdk.StackProps):Role{
    return new Role(this, "BedfinderDevOpsRole", { 
        assumedBy: new ArnPrincipal(`arn:aws:iam::${props?.env?.account}:root}`) ,
        roleName: "AwsDevOps" 
    })
  }

}
