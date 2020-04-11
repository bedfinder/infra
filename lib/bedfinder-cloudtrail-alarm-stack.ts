import * as cdk from '@aws-cdk/core';
import { MetricFilter, LogGroup, RetentionDays  } from '@aws-cdk/aws-logs'
import { Alarm, Metric, ComparisonOperator  } from '@aws-cdk/aws-cloudwatch'
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions'
import { Trail } from '@aws-cdk/aws-cloudtrail'
import { Topic, Subscription, SubscriptionProtocol } from '@aws-cdk/aws-sns'

export class BedfinderCloudtrailAlarmStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const trail = new Trail(this, 'CloudTrail', {
            sendToCloudWatchLogs: true
        });

        const cloudtrailLogGroup = this.createCloudwatchLogGroup();
        const rootAccountUsageCount = new Metric({metricName:"RootAccountUsageCount", namespace: "CloudTrailMetrics"})
        
        const alarmTopic = this.createAlarmTopic()

        this.createCloudwatchMetricsFilter(cloudtrailLogGroup,rootAccountUsageCount)

        this.createRootAccessAlarm(rootAccountUsageCount,alarmTopic);
    
      }


      createAlarmTopic():Topic{
        const alarmTopic = new Topic(this,"AlarmTopic",{topicName: "AlarmTopic", displayName:"AlarmTopic"})
        new Subscription(this,"alarmTopicSubscription", {topic:alarmTopic, 
                                                         protocol: SubscriptionProtocol.EMAIL,
                                                         endpoint:"sebastian.sulzbacher@googlemail.com"})
        return alarmTopic

      }

      createCloudwatchLogGroup():LogGroup{
        return new LogGroup(this,"CloudtrailLogs",{logGroupName:"CloudtrailLogs",retention : RetentionDays.ONE_DAY })
      }


      createRootAccessAlarm(rootAccountUsageCount:Metric,alarmTopic:Topic){
        
        const rootAccessAlarm =  new Alarm(this, "RootAccessAlarm", {
            alarmName: "RootAccessAlarm",
            metric: rootAccountUsageCount,
            threshold: 1,
            evaluationPeriods: 1,
            comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            alarmDescription: "This alarm fires whenever the root user does anything",

        })
        
        const action = new SnsAction(alarmTopic)
        rootAccessAlarm.addAlarmAction(action)


      }

      createCloudwatchMetricsFilter(cloudtrailLogGroup: LogGroup,rootAccountUsageCount:Metric):MetricFilter {
          
       
       const filterPattern = { logPatternString: '{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }' } 
         
                 
        return new MetricFilter(this, "RootAccountUsageCount", { 
            logGroup: cloudtrailLogGroup,
            filterPattern: filterPattern, 
            metricName: rootAccountUsageCount.metricName,
            metricNamespace: rootAccountUsageCount.namespace,
            metricValue: "1"
        })
      }

}