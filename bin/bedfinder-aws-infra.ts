#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BedfinderIamStack } from '../lib/bedinder-iam-stack';
import { BedfinderNetworkStack } from '../lib/bedfinder-network-stack';
import { BedfinderCloudtrailAlarmStack } from '../lib/bedfinder-cloudtrail-alarm-stack'
import { BedfinderStages }  from '../lib/bedfinder-props'


const environments = {
  "prod": { region: "eu-central-1", account: "643555865554"},
  "test": { region: "eu-central-1", account: "643555865554"}
}

class BedfinderAwsBaseInfra extends cdk.App {
    constructor() {
      super();
    
      new BedfinderIamStack(this, `${BedfinderStages.test}-BedfinderIam-Stack`, { stage:BedfinderStages.test, context:"BedfinderIam",env:environments.test});
      new BedfinderNetworkStack(this, `${BedfinderStages.test}-BedfinderNetwork-Stack`, {stage: BedfinderStages.test, context:"BedfinderNetwork", env:environments.test});
      new BedfinderCloudtrailAlarmStack(this, "Global-BedfinderCloudtrailAlarm-Stack", {env:environments.test})
  }
}

new BedfinderAwsBaseInfra().synth();