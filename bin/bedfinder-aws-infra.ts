#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BedfinderIamStack } from '../lib/bedinder-iam-stack';
import { BedfinderCloudtrailAlarmStack } from '../lib/bedfinder-cloudtrail-alarm-stack'

const environments = {
  "prod": { region: "eu-central-1", account: "643555865554" },
  "test": { region: "eu-central-1", account: "643555865554"}
}

class BedfinderAwsBaseInfra extends cdk.App {

    constructor() {
      super();
    
      new BedfinderIamStack(this, 'BedfinderIamStack', {env:environments.test});
      new BedfinderCloudtrailAlarmStack(this, "BedfinderCloudtrailAlarmStack", {env:environments.test})
  }
}

new BedfinderAwsBaseInfra().synth();