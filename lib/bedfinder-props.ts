import * as cdk from '@aws-cdk/core';

export enum BedfinderStages {
    test="Test",
    prod="Prod"
}

export interface BedfinderStackProbs extends cdk.StackProps {
    stage:BedfinderStages,
    context:string
}