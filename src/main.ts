import { join } from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { FilterPattern, SubscriptionFilter } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    console.log('Dirname: ' +__dirname);

    const produceLogHandler = new NodejsFunction(
      this,
      'produce-log',
      {
        functionName: 'produce-log-function',
        handler: 'handler',
        runtime: Runtime.NODEJS_18_X,
        entry: join(__dirname, '/lambda/produceLog.ts'),
      },
    );

    const ingestLogsFunction = NodejsFunction.fromFunctionArn(this, 'ingest-logs', 'arn:aws:lambda:us-east-1:273460028245:function:manualFunction');


    new SubscriptionFilter(this, 'lambdaLogSubscriptionFilter', {
      logGroup: produceLogHandler.logGroup,
      destination: new LambdaDestination(ingestLogsFunction),
      filterPattern: FilterPattern.allEvents(),
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: '273460028245',
};

const app = new App();

new MyStack(app, 'lambda-forward-logs-dev', { env: devEnv });
// new MyStack(app, 'lambda-forward-logs-prod', { env: prodEnv });

app.synth();